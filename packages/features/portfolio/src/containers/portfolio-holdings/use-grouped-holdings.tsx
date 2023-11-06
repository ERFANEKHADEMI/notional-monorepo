import { TokenBalance } from '@notional-finance/core-entities';
import {
  formatCryptoWithFiat,
  formatLeverageRatio,
  formatMaturity,
  formatNumberAsPercent,
  formatNumberAsPercentWithUndefined,
  formatTokenType,
  getHoldingsSortOrder,
} from '@notional-finance/helpers';
import {
  useFiat,
  useNOTE,
  useGroupedTokens,
} from '@notional-finance/notionable-hooks';
import {
  Network,
  TXN_HISTORY_TYPE,
  leveragedYield,
} from '@notional-finance/util';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

function formatCaption(asset: TokenBalance, debt: TokenBalance) {
  if (asset.tokenType === 'nToken' && debt.tokenType === 'PrimeDebt') {
    return 'Variable Borrow';
  } else if (asset.tokenType === 'nToken' && debt.tokenType === 'fCash') {
    return `Fixed Borrow: ${formatMaturity(debt.maturity)}`;
  } else if (asset.tokenType === 'fCash' && debt.tokenType === 'PrimeDebt') {
    return `Fixed Lend: ${formatMaturity(asset.maturity)}, Variable Borrow`;
  } else if (asset.tokenType === 'PrimeCash' && debt.tokenType === 'fCash') {
    return `Variable Lend, Fixed Borrow: ${formatMaturity(debt.maturity)}`;
  } else if (asset.tokenType === 'fCash' && debt.tokenType === 'fCash') {
    return `Fixed Lend: ${formatMaturity(
      asset.maturity
    )}, Fixed Borrow: ${formatMaturity(debt.maturity)}`;
  } else {
    return undefined;
  }
}

export function useGroupedHoldings() {
  const baseCurrency = useFiat();
  const NOTE = useNOTE();
  const groupedTokens = useGroupedTokens();
  const history = useHistory();

  const groupedRows = groupedTokens.map(
    ({
      asset: {
        balance: asset,
        marketYield: assetYield,
        statement: assetStatement,
        totalNOTEEarnings,
      },
      debt: { balance: debt, statement: debtStatement },
      hasMatured,
      isPending,
      leverageRatio,
      presentValue,
      borrowAPY,
    }) => {
      const underlying = asset.underlying;
      const { icon } = formatTokenType(asset.token);
      const debtData = formatTokenType(debt.token);

      const marketApy = leveragedYield(
        assetYield?.totalAPY,
        borrowAPY,
        leverageRatio
      );
      const noteAPY = assetYield?.incentives?.find(
        (i) => i.tokenId === NOTE?.id
      )?.incentiveAPY;
      const noteIncentives =
        noteAPY !== undefined
          ? leveragedYield(noteAPY, 0, leverageRatio)
          : undefined;

      const amountPaid =
        assetStatement && debtStatement
          ? assetStatement?.accumulatedCostRealized.add(
              debtStatement?.accumulatedCostRealized
            )
          : undefined;
      const earnings =
        assetStatement && debtStatement
          ? assetStatement?.totalProfitAndLoss.add(
              debtStatement?.totalProfitAndLoss
            )
          : undefined;
      const totalEarningsWithNOTE = earnings
        ?.toFiat(baseCurrency)
        .add(
          totalNOTEEarnings?.toFiat(baseCurrency) ||
            TokenBalance.fromSymbol(0, baseCurrency, Network.All)
        );
      return {
        sortOrder: getHoldingsSortOrder(asset.token),
        tokenId: asset.tokenId,
        asset: {
          symbol: icon,
          symbolBottom: debtData?.icon,
          label:
            asset.tokenType === 'nToken'
              ? `Leveraged ${underlying.symbol} Liquidity`
              : `Leveraged ${underlying.symbol} Lend`,
          caption: formatCaption(asset, debt),
        },
        isPending,
        marketApy: {
          data: [
            {
              displayValue: formatNumberAsPercentWithUndefined(
                marketApy,
                '-',
                2
              ),
              isNegative: marketApy !== undefined && marketApy < 0,
            },
            {
              displayValue: noteIncentives
                ? `${formatNumberAsPercent(noteIncentives)} NOTE`
                : '',
              isNegative: false,
            },
          ],
        },
        amountPaid: amountPaid
          ? formatCryptoWithFiat(baseCurrency, amountPaid)
          : '-',
        presentValue: formatCryptoWithFiat(baseCurrency, presentValue),
        earnings: totalEarningsWithNOTE
          ? totalEarningsWithNOTE
              .toFiat(baseCurrency)
              .toDisplayStringWithSymbol(3, true)
          : '-',
        toolTipData: totalNOTEEarnings?.isPositive()
          ? {
              underlyingBaseCurrency: earnings
                ?.toFiat(baseCurrency)
                .toDisplayStringWithSymbol(),
              underlying: earnings?.toDisplayStringWithSymbol(),
              noteBaseCurrency: totalNOTEEarnings
                .toFiat(baseCurrency)
                .toDisplayStringWithSymbol(),
              note: totalNOTEEarnings.toDisplayStringWithSymbol(),
            }
          : undefined,
        actionRow: {
          subRowData: [
            {
              label: <FormattedMessage defaultMessage={'Borrow APY'} />,
              value: formatNumberAsPercentWithUndefined(borrowAPY, '-', 3),
            },
            {
              label: <FormattedMessage defaultMessage={'Strategy APY'} />,
              value: formatNumberAsPercentWithUndefined(
                assetYield?.totalAPY,
                '-',
                3
              ),
              showLoadingSpinner: true,
            },
            {
              label: <FormattedMessage defaultMessage={'Leverage Ratio'} />,
              value: formatLeverageRatio(leverageRatio),
            },
          ],
          buttonBarData: [
            {
              buttonText: <FormattedMessage defaultMessage={'Manage'} />,
              callback: () => {
                history.push(
                  `/liquidity-leveraged/Manage/${underlying.symbol}`
                );
              },
            },
            {
              buttonText: <FormattedMessage defaultMessage={'Withdraw'} />,
              callback: () => {
                history.push(
                  `/liquidity-leveraged/Withdraw/${underlying.symbol}`
                );
              },
            },
          ],
          hasMatured: hasMatured,
          txnHistory: `/portfolio/transaction-history?${new URLSearchParams({
            txnHistoryType: TXN_HISTORY_TYPE.PORTFOLIO_HOLDINGS,
            assetOrVaultId: asset.token.id,
            debtId: debtStatement?.token.id || '',
          })}`,
        },
      };
    }
  );

  return {
    groupedRows,
    groupedTokens: groupedTokens.flatMap(({ asset, debt }) => [
      asset.balance.tokenId,
      debt.balance.tokenId,
    ]),
  };
}