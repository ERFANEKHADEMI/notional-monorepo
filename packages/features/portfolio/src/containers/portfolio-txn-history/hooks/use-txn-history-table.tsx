import { useCallback } from 'react';
import {
  MultiValueIconCell,
  MultiValueCell,
  TxnHashCell,
  DataTableColumn,
  DateTimeCell,
  DisplayCell,
  SelectedOptions,
} from '@notional-finance/mui';
import { Box, useTheme } from '@mui/material';
import { TXN_HISTORY_TYPE } from '@notional-finance/shared-config';
import { getDateString } from '@notional-finance/helpers';
import { FormattedMessage } from 'react-intl';

export const useTxnHistoryTable = (
  currencyOptions: SelectedOptions[],
  assetOrVaultOptions: SelectedOptions[],
  txnHistoryType: TXN_HISTORY_TYPE,
  accountHistoryData: any[]
) => {
  const VaultNameCell = ({ cell: { value } }) => {
    const theme = useTheme();
    return (
      <Box sx={{ width: theme.spacing(19), textWrap: 'wrap' }}>{value}</Box>
    );
  };

  const tableColumns: DataTableColumn[] = [
    {
      Header: (
        <FormattedMessage
          defaultMessage="Transaction Type"
          description={'Transaction Type header'}
        />
      ),
      accessor: 'transactionType',
      Cell: MultiValueIconCell,
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Vault Name"
          description={'Vault Name header'}
        />
      ),
      Cell: VaultNameCell,
      accessor: 'vaultName',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Underlying Amount"
          description={'Underlying Amount header'}
        />
      ),
      Cell: DisplayCell,
      accessor: 'underlyingAmount',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Asset Amount"
          description={'Asset Amount header'}
        />
      ),
      Cell: MultiValueCell,
      accessor: 'assetAmount',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Asset"
          description={'Asset  header'}
        />
      ),
      Cell: MultiValueIconCell,
      accessor: 'asset',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage defaultMessage="Price" description={'Price header'} />
      ),
      accessor: 'price',
      textAlign: 'right',
    },
    {
      Header: (
        <FormattedMessage defaultMessage="Time" description={'Time header'} />
      ),
      Cell: DateTimeCell,
      accessor: 'time',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="TX LINK"
          description={'TX LINK header'}
        />
      ),
      accessor: 'txLink',
      Cell: TxnHashCell,
      textAlign: 'right',
      showLinkIcon: true,
    },
  ];

  const txnHistoryColumns =
    txnHistoryType === TXN_HISTORY_TYPE.PORTFOLIO_HOLDINGS
      ? tableColumns.filter(({ accessor }) => accessor !== 'vaultName')
      : tableColumns;

  const getIds = (options: SelectedOptions[]) => {
    return options.map(({ id }) => id);
  };

  const filterTxnHistoryData = () => {
    const currencyIds = getIds(currencyOptions);
    const assetOrVaultIds = getIds(assetOrVaultOptions);
    const filterData = [...currencyIds, ...assetOrVaultIds];

    if (filterData.length === 0) return accountHistoryData;

    if (assetOrVaultIds.length > 0 && currencyIds.length > 0) {
      return txnHistoryType === TXN_HISTORY_TYPE.PORTFOLIO_HOLDINGS
        ? accountHistoryData
            .filter(({ currency }) => filterData.includes(currency))
            .filter(({ token }) => filterData.includes(token.id))
        : accountHistoryData
            .filter(({ currency }) => filterData.includes(currency))
            .filter(({ token }) => filterData.includes(token.vaultAddress));
    }
    if (currencyIds.length > 0) {
      return accountHistoryData.filter(({ currency }) =>
        currencyIds.includes(currency)
      );
    }
    if (
      assetOrVaultIds.length > 0 &&
      txnHistoryType === TXN_HISTORY_TYPE.PORTFOLIO_HOLDINGS
    ) {
      return accountHistoryData.filter(({ token }) =>
        filterData.includes(token.id)
      );
    }
    if (
      assetOrVaultIds.length > 0 &&
      txnHistoryType === TXN_HISTORY_TYPE.LEVERAGED_VAULT
    ) {
      return accountHistoryData.filter(({ token }) =>
        filterData.includes(token.vaultAddress)
      );
    }
    return accountHistoryData;
  };

  const marketDataCSVFormatter = useCallback((data: any[]) => {
    return data.map(
      ({
        transactionType,
        vaultName,
        underlyingAmount,
        assetAmount,
        asset,
        price,
        time,
        txLink,
      }) => {
        let result = {};
        result = {
          'Transaction Type': `${
            transactionType.label
          } ${transactionType.symbol.toUpperCase()}`,
          'Underlying Amount': underlyingAmount,
          'Asset Amount': assetAmount.data[0],
          Asset: asset.label,
          Price: price,
          Time: getDateString(time, { showTime: true, slashesFormat: true }),
          'TX Hash': txLink.hash,
        };
        vaultName && (result = { 'Vault Name': vaultName, ...result });
        return result;
      }
    );
  }, []);

  const txnHistoryData = filterTxnHistoryData();

  return { txnHistoryData, txnHistoryColumns, marketDataCSVFormatter };
};