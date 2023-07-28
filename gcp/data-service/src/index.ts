import * as path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
import express from 'express';
import Knex from 'knex';
import DataService from './DataService';
import {
  AssetType,
  Network,
  decodeERC1155Id,
  getProviderFromNetwork,
  padToHex256,
} from '@notional-finance/util';
import { BigNumber } from 'ethers';
import { VaultAccount, BackfillType } from './types';

const port = parseInt(process.env.SERVICE_PORT || '8080');
const app = express();

const createUnixSocketPool = () => {
  return Knex({
    client: 'pg',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
    },
  });
};

async function main() {
  if (!process.env.NETWORK) {
    throw Error('Network not defined');
  }
  if (!process.env.REGISTRY_BASE_URL) {
    throw Error('Registry URL not defined');
  }

  const db = createUnixSocketPool();
  const provider = getProviderFromNetwork(Network[process.env.NETWORK], true);
  const dataService = new DataService(provider, db, {
    network: Network[process.env.NETWORK],
    // TODO: get from env
    blocksPerSecond: {
      [Network.ArbitrumOne]: 2.5, // 2.5 blocks per second on arbitrum
      [Network.Mainnet]: 0.083,
    },
    maxProviderRequests: 50,
    interval: 1, // 1 Hour
    frequency: 3600, // Hourly
    startingBlock: 86540848, // Oldest block in the subgraph
    registryUrl: process.env.REGISTRY_BASE_URL,
  });

  app.use(express.json());

  app.get('/', (_, res) => {
    res.send('OK');
  });

  app.get('/block', async (req, res) => {
    const blockNum = parseInt((req.query.number as string) || '0');
    console.log(`blockNum=${blockNum}`);
    const block = await provider.getBlock(blockNum);
    res.send(JSON.stringify(block));
  });

  app.get('/time', async (req, res) => {
    const targetTimestamp = req.query.targetTimestamp
      ? parseInt(req.query.targetTimestamp as string)
      : dataService.latestTimestamp();
    const network = req.query.network
      ? (req.query.network as Network)
      : Network.Mainnet;
    const block = await dataService.getBlockNumberByTimestamp(
      network,
      targetTimestamp
    );
    res.send(JSON.stringify(block));
  });

  app.get('/backfillOracleData', async (req, res) => {
    const startTime = parseInt((req.query.startTime as string) || '0');
    let endTime = Date.now() / 1000;
    if (req.query.endTime) {
      endTime = parseInt(req.query.endTime as string);
    }
    if (endTime < startTime) {
      res.status(400).send('endTime must be greater than startTime');
      return;
    }
    try {
      await dataService.backfill(startTime, endTime, BackfillType.OracleData);
      res.send('OK');
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.get('/backfillGenericData', async (req, res) => {
    const startTime = parseInt((req.query.startTime as string) || '0');
    let endTime = Date.now() / 1000;
    if (req.query.endTime) {
      endTime = parseInt(req.query.endTime as string);
    }
    if (endTime < startTime) {
      res.status(400).send('endTime must be greater than startTime');
      return;
    }
    try {
      await dataService.backfill(startTime, endTime, BackfillType.GenericData);
      res.send('OK');
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.get('/syncOracleData', async (_, res) => {
    try {
      res.send(
        JSON.stringify(
          await dataService.syncOracleData(dataService.latestTimestamp())
        )
      );
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.get('/syncGenericData', async (_, res) => {
    try {
      res.send(
        JSON.stringify(
          await dataService.syncGenericData(dataService.latestTimestamp())
        )
      );
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.get('/data/oracles', async (_, res) => {
    try {
      res.send(JSON.stringify(await dataService.query()));
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.post('/accounts', async (req, res) => {
    try {
      if (req.body.accountId && req.body.accountId !== '') {
        await dataService.insertAccounts([req.body.accountId]);
      }
      res.status(200).send('OK');
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.post('/events', async (req, res) => {
    try {
      const accountIds: string[] = [];
      const vaultAccounts: VaultAccount[] = [];
      req.body.events.forEach((event) => {
        const contextUpdated = event.matchReasons.find(
          (reason) => reason.signature === 'AccountContextUpdate(address)'
        );
        if (contextUpdated) {
          accountIds.push(contextUpdated.args[0]);
          return;
        }
        const transferSingle = event.matchReasons.find(
          (reason) =>
            reason.signature ===
            'TransferSingle(address,address,address,uint256,uint256)'
        );
        if (transferSingle) {
          const id = BigNumber.from(transferSingle.params.id);
          const params = decodeERC1155Id(padToHex256(id));
          if (
            params.assetType === AssetType.VAULT_SHARE_ASSET_TYPE &&
            params.vaultAddress
          ) {
            accountIds.push(transferSingle.params.to);
            vaultAccounts.push({
              accountId: transferSingle.params.to,
              vaultId: params.vaultAddress,
            });
          }
        }
      });

      if (accountIds.length > 0) {
        await dataService.insertAccounts(accountIds);
      }
      if (vaultAccounts.length > 0) {
        await dataService.insertVaultAccounts(vaultAccounts);
      }
      res.status(200).send('OK');
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.get('/accounts', async (_, res) => {
    try {
      res.send(JSON.stringify(await dataService.accounts()));
    } catch (e: any) {
      res.status(500).send(e.toString());
    }
  });

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

main();