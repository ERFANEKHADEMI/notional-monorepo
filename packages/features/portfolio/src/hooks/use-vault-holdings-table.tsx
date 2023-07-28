import { useMemo, useEffect, useState } from 'react';
import { Theme, useTheme } from '@mui/material';
import {
  DataTableColumn,
  MultiValueCell,
  MultiValueIconCell,
  SliderCell,
  ExpandedRows,
  ChevronCell,
} from '@notional-finance/mui';
import {
  formatCryptoWithFiat,
  formatLeverageRatio,
  formatMaturity,
  formatNumberAsPercent,
} from '@notional-finance/helpers';
import { FormattedMessage } from 'react-intl';
import {
  useBalanceStatements,
  useVaultRiskProfiles,
} from '@notional-finance/notionable-hooks';
import { TXN_HISTORY_TYPE } from '@notional-finance/shared-config';
import { PRIME_CASH_VAULT_MATURITY } from '@notional-finance/util';
import { VaultAccountRiskProfile } from '@notional-finance/risk-engine';
import { TokenBalance } from '@notional-finance/core-entities';
import { useHistory } from 'react-router-dom';

export function getVaultLeveragePercentage(
  v: VaultAccountRiskProfile,
  theme: Theme
) {
  const maxLeverageRatio = v.maxLeverageRatio;
  const leverageRatio = v.leverageRatio();
  const leveragePercentage = leverageRatio
    ? (leverageRatio * 100) / maxLeverageRatio
    : null;
  let trackColor: string | undefined;

  if (leveragePercentage) {
    trackColor =
      leveragePercentage > 90
        ? theme.palette.error.main
        : leveragePercentage > 70
        ? theme.palette.warning.main
        : undefined;
  }

  return { maxLeverageRatio, leverageRatio, leveragePercentage, trackColor };
}

export const useVaultHoldingsTable = () => {
  const [expandedRows, setExpandedRows] = useState<ExpandedRows | null>(null);
  const initialState = expandedRows !== null ? { expanded: expandedRows } : {};
  const vaults = useVaultRiskProfiles();
  const theme = useTheme();
  const history = useHistory();
  const balanceStatements = useBalanceStatements();

  const vaultHoldingsColumns: DataTableColumn[] = useMemo(() => {
    return [
      {
        Header: (
          <FormattedMessage
            defaultMessage="Vault"
            description={'vault header'}
          />
        ),
        Cell: MultiValueIconCell,
        accessor: 'strategy',
        textAlign: 'left',
        expandableTable: true,
      },
      {
        Header: (
          <FormattedMessage
            defaultMessage="Net Worth"
            description={'Net Worth header'}
          />
        ),
        Cell: MultiValueCell,
        accessor: 'netWorth',
        textAlign: 'right',
        expandableTable: true,
      },
      {
        Header: (
          <FormattedMessage
            defaultMessage="Profits"
            description={'profits header'}
          />
        ),
        Cell: MultiValueCell,
        accessor: 'profit',
        textAlign: 'right',
        expandableTable: true,
      },
      {
        Header: (
          <FormattedMessage defaultMessage="APY" description={'Debts header'} />
        ),
        accessor: 'totalAPY',
        textAlign: 'right',
        expandableTable: true,
      },
      {
        Header: (
          <FormattedMessage
            defaultMessage="Leverage Ratio"
            description={'currency header'}
          />
        ),
        Cell: SliderCell,
        accessor: 'leveragePercentage',
        textAlign: 'right',
        expandableTable: true,
      },
      {
        Header: '',
        Cell: ChevronCell,
        accessor: 'chevron',
        textAlign: 'left',
        expandableTable: true,
      },
    ];
  }, []);

  const vaultHoldingsData = vaults.map((v) => {
    const config = v.vaultConfig;
    const { leveragePercentage, leverageRatio, maxLeverageRatio, trackColor } =
      getVaultLeveragePercentage(v, theme);

    const debtPnL = balanceStatements.find(
      (b) => b.token.id === v.vaultDebt.tokenId
    );
    const assetPnL = balanceStatements?.find(
      (b) => b.token.id === v.vaultShareDefinition.id
    );
    const profit = (
      assetPnL?.totalProfitAndLoss ||
      TokenBalance.zero(v.denom(v.defaultSymbol))
    ).sub(
      debtPnL?.totalProfitAndLoss || TokenBalance.zero(v.denom(v.defaultSymbol))
    );
    // TODO: need to fill out the APY calculation
    const totalAPY = 0;
    const strategyAPY = 0;
    const borrowAPY =
      debtPnL?.impliedFixedRate !== undefined
        ? formatNumberAsPercent(debtPnL.impliedFixedRate)
        : // TODO: if this is variable then show the current prime cash borrow rate
          0;

    return {
      strategy: {
        symbol: v.defaultSymbol,
        label: config.name,
        caption:
          v.maturity === PRIME_CASH_VAULT_MATURITY
            ? 'Open Term'
            : `Maturity: ${formatMaturity(v.maturity)}`,
      },
      netWorth: formatCryptoWithFiat(v.netWorth()),
      profit: formatCryptoWithFiat(profit),
      totalAPY: formatNumberAsPercent(totalAPY),
      leveragePercentage: leveragePercentage
        ? {
            value: leveragePercentage,
            captionLeft: formatLeverageRatio(leverageRatio || 0, 1),
            captionRight: `Max: ${formatLeverageRatio(
              maxLeverageRatio || 0,
              1
            )}`,
            trackColor,
          }
        : undefined,
      // TODO: these values are inside the accordion
      strategyAPY: {
        displayValue: formatNumberAsPercent(strategyAPY, 3),
        isNegative: strategyAPY && strategyAPY < 0,
      },
      borrowAPY: {
        displayValue: formatNumberAsPercent(borrowAPY, 3),
      },
      leverageRatio: formatLeverageRatio(v.leverageRatio() || 0),
      actionRow: {
        subRowData: [
          {
            label: <FormattedMessage defaultMessage={'Borrow APY'} />,
            value: formatNumberAsPercent(borrowAPY, 3),
          },
          {
            label: <FormattedMessage defaultMessage={'Strategy APY'} />,
            value: formatNumberAsPercent(strategyAPY, 3),
          },
          {
            label: <FormattedMessage defaultMessage={'Leverage Ratio'} />,
            value: formatLeverageRatio(v.leverageRatio() || 0),
          },
        ],
        buttonBarData: [
          {
            buttonText: <FormattedMessage defaultMessage={'Manage'} />,
            callback: () => {
              history.push('/vaults/manage');
            },
          },
          {
            buttonText: <FormattedMessage defaultMessage={'Withdraw'} />,
            callback: () => {
              history.push('');
            },
          },
        ],
        txnHistory: `/portfolio/transaction-history?${new URLSearchParams({
          txnHistoryType: TXN_HISTORY_TYPE.LEVERAGED_VAULT,
          assetOrVaultId: config.vaultAddress,
        })}`,
      },
    };
  });

  useEffect(() => {
    const formattedExpandedRows = vaultHoldingsColumns.reduce(
      (accumulator, _value, index) => {
        return { ...accumulator, [index]: index === 0 ? true : false };
      },
      {}
    );

    if (
      expandedRows === null &&
      JSON.stringify(formattedExpandedRows) !== '{}'
    ) {
      setExpandedRows(formattedExpandedRows);
    }
  }, [vaultHoldingsColumns, expandedRows, setExpandedRows]);

  return {
    vaultHoldingsColumns,
    vaultHoldingsData,
    setExpandedRows,
    initialState,
  };
};