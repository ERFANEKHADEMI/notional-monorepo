import { IDataWriter, DataRow, DataContext } from './types';
import { Knex } from 'knex';

export class GenericDataWriter implements IDataWriter {
  public async write(
    db: Knex,
    context: DataContext,
    rows: DataRow[]
  ): Promise<void> {
    await db
      .insert(
        rows.map((v) => ({
          strategy_id: v.strategyId,
          variable: v.variable,
          network: v.networkId,
          timestamp: context.timestamp,
          block_number: v.blockNumber,
          decimals: v.dataConfig.decimals,
          contract_address: v.contractAddress,
          method: v.method,
          latest_rate: v.value.toString(),
        }))
      )
      .into(context.tableName)
      .onConflict(['strategy_id', 'variable', 'network', 'timestamp'])
      .ignore();
  }
}