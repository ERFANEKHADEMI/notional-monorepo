import {
  Network,
  getNowSeconds,
  getProviderFromNetwork,
} from '@notional-finance/util';
import { BigNumber, ethers } from 'ethers';
import * as tokens from './config/tokens.json';
import VaultV3Liquidator from './VaultV3Liquidator';
import { IGasOracle, MetricNames } from './types';
import { Logger } from '@notional-finance/durable-objects';

export interface Env {
  ACCOUNT_SERVICE_URL: string;
  DATA_SERVICE_AUTH_TOKEN: string;
  NETWORK: string;
  FLASH_LIQUIDATOR_CONTRACT: string;
  FLASH_LIQUIDATOR_OWNER: string;
  FLASH_LENDER_ADDRESS: string;
  FLASH_LOAN_BUFFER: string;
  NOTIONAL_PROXY_CONTRACT: string;
  DUST_THRESHOLD: string;
  ALCHEMY_KEY: string;
  BN_API_KEY: string;
  DD_API_KEY: string;
  DD_APP_KEY: string;
  TX_RELAY_URL: string;
  TX_RELAY_AUTH_TOKEN: string;
  SLIPPAGE_LIMIT: string;
  GAS_COST_BUFFER: string;
  PROFIT_THRESHOLD: string;
  ZERO_EX_SWAP_URL: string;
  ZERO_EX_API_KEY: string;
}

// TODO: this needs to be fetched dynamically
const vaults = ['0xdb08f663e5D765949054785F2eD1b2aa1e9C22Cf'];

class ArbitrumGasOracle implements IGasOracle {
  public async getGasPrice(): Promise<BigNumber> {
    // 0.1 gwei
    return ethers.utils.parseUnits('1', 8);
  }
}

const run = async (env: Env) => {
  const logger = new Logger({
    apiKey: env.DD_API_KEY,
    version: '1',
    env: env.NETWORK,
    service: 'vault-liquidator',
  });

  const accounts = (await (
    await fetch(env.ACCOUNT_SERVICE_URL, {
      headers: {
        'x-auth-token': env.DATA_SERVICE_AUTH_TOKEN,
      },
    })
  ).json()) as any;
  const addrs = accounts.map((a) => a.account_id);

  const provider = getProviderFromNetwork(Network[env.NETWORK], true);
  const liq = new VaultV3Liquidator(
    provider,
    {
      network: env.NETWORK,
      vaultAddrs: vaults,
      flashLiquidatorAddress: env.FLASH_LIQUIDATOR_CONTRACT,
      flashLiquidatorOwner: env.FLASH_LIQUIDATOR_OWNER,
      flashLenderAddress: env.FLASH_LENDER_ADDRESS,
      flashLoanBuffer: BigNumber.from(env.FLASH_LOAN_BUFFER),
      slippageLimit: BigNumber.from(env.SLIPPAGE_LIMIT),
      notionalAddress: env.NOTIONAL_PROXY_CONTRACT,
      dustThreshold: BigNumber.from(env.DUST_THRESHOLD),
      txRelayUrl: env.TX_RELAY_URL,
      txRelayAuthToken: env.TX_RELAY_AUTH_TOKEN,
      tokens: new Map<string, string>(Object.entries(tokens.arbitrum)),
      gasCostBuffer: BigNumber.from(env.GAS_COST_BUFFER),
      profitThreshold: BigNumber.from(env.PROFIT_THRESHOLD),
      zeroExUrl: env.ZERO_EX_SWAP_URL,
      zeroExApiKey: env.ZERO_EX_API_KEY,
      gasOracle: new ArbitrumGasOracle(),
    },
    logger
  );

  const riskyAccounts = await liq.getRiskyAccounts(addrs);

  const ddSeries = {
    series: [],
  };

  ddSeries.series.push({
    name: MetricNames.NUM_RISKY_ACCOUNTS,
    value: riskyAccounts.length,
    tags: [`network:${env.NETWORK}`],
    timestamp: getNowSeconds(),
  });

  if (riskyAccounts.length > 0) {
    const riskyAccount = riskyAccounts[0];

    const accountLiq = await liq.getAccountLiquidation(riskyAccount);

    if (accountLiq) {
      await liq.liquidateAccount(accountLiq);
    }
  }

  await logger.submitMetrics(ddSeries);
};

export default {
  async fetch(
    request: Request,
    env: Env,
    _: ExecutionContext
  ): Promise<Response> {
    try {
      await run(env);
    } catch (e) {
      console.error(e);
      console.trace();
    }

    const response = new Response('OK', { status: 200 });
    return response;
  },
  async scheduled(
    controller: ScheduledController,
    env: Env,
    _: ExecutionContext
  ): Promise<void> {
    try {
      await run(env);
    } catch (e) {
      console.error(e);
      console.trace();
    }
  },
};
