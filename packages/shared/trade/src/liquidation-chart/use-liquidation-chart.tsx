import { useTheme } from '@mui/material';
import { Registry, TokenBalance } from '@notional-finance/core-entities';
import { formatTokenType, getDateString } from '@notional-finance/helpers';
import { ChartToolTipDataProps, CountUp } from '@notional-finance/mui';
import {
  TradeState,
  VaultTradeState,
  isVaultTrade,
} from '@notional-finance/notionable';
import { useAssetPriceHistory } from '@notional-finance/notionable-hooks';
import { RATE_PRECISION } from '@notional-finance/util';
import { FormattedMessage } from 'react-intl';
import { AxisDomain } from 'recharts/types/util/types';

export function useLiquidationChart(state: TradeState | VaultTradeState) {
  const theme = useTheme();
  const { collateral, postAccountRisk, deposit, debt, tradeType } = state;
  const token =
    tradeType === 'LeveragedLend' && collateral?.tokenType === 'PrimeCash'
      ? debt
      : collateral;

  const liquidationPrice = postAccountRisk
    ? postAccountRisk.liquidationPrice.find(
        ({ asset }) => asset.id === token?.id
      )?.threshold
    : undefined;
  const areaChartData = useAssetPriceHistory(token).map(
    ({ timestamp, assetPrice }) => ({
      timestamp,
      // Non vault trades have prices shown at a discount
      area: isVaultTrade(tradeType) ? assetPrice : 1 / assetPrice,
      line: liquidationPrice?.toFloat(),
    })
  );

  let yAxisDomain: AxisDomain = ['auto', 'auto'];
  if (token?.tokenType === 'nToken') {
    const { nTokenMaxDrawdown } =
      Registry.getConfigurationRegistry().getNTokenLeverageFactors(token);
    yAxisDomain = [
      nTokenMaxDrawdown / RATE_PRECISION,
      (2 * RATE_PRECISION - nTokenMaxDrawdown) / RATE_PRECISION,
    ];
  } else if (token?.tokenType === 'fCash') {
    // This range technically only applies to lending fCash but works as a boundary on the
    // fCash price anyway
    const { lowestDiscountFactor } =
      Registry.getConfigurationRegistry().getMinLendRiskAdjustedDiscountFactor(
        token
      );
    yAxisDomain = [lowestDiscountFactor / RATE_PRECISION, 1];
  }

  const currentPrice =
    deposit && token
      ? isVaultTrade(tradeType)
        ? // Vault share prices are shown at a premium
          TokenBalance.unit(token).toToken(deposit)
        : // Non vault leveraged trades are shown at a discount
          TokenBalance.unit(deposit).toToken(token)
      : undefined;
  const pricePair = token
    ? `${formatTokenType(token).title}/${deposit?.symbol}`
    : '';

  const chartToolTipData: ChartToolTipDataProps = {
    timestamp: {
      lineColor: 'transparent',
      lineType: 'none',
      formatTitle: (timestamp) => (
        <FormattedMessage
          defaultMessage={'{date}'}
          values={{ date: getDateString(timestamp) }}
        />
      ),
    },
    area: {
      lineColor: theme.palette.charts.main,
      lineType: 'solid',
      formatTitle: (area) => (
        <FormattedMessage
          defaultMessage={'{price} {pricePair} Price'}
          values={{
            pricePair,
            price: <span>{area?.toFixed(3) || '-'}</span>,
          }}
        />
      ),
    },
    line: {
      lineColor: theme.palette.error.main,
      lineType: 'dashed',
      formatTitle: (line) =>
        line ? (
          <FormattedMessage
            defaultMessage={'{price} Liquidation Price'}
            values={{
              price: <span>{line?.toFixed(3) || '-'}</span>,
            }}
          />
        ) : (
          ''
        ),
    },
  };

  const areaChartLegendData = {
    textHeader: (
      <FormattedMessage
        defaultMessage={'{pricePair} Price'}
        values={{ pricePair }}
      />
    ),
    legendOne: {
      label: pricePair || 'Price',
      value: currentPrice ? (
        <CountUp value={currentPrice.toFloat()} decimals={3} />
      ) : undefined,
      lineColor: theme.palette.charts.main,
      lineType: 'solid',
    },
    legendTwo: {
      label: <FormattedMessage defaultMessage={'Liquidation Price'} />,
      value: liquidationPrice ? (
        <CountUp value={liquidationPrice.toFloat()} decimals={3} />
      ) : undefined,
      lineColor: theme.palette.error.main,
      lineType: 'dashed',
    },
  };

  return {
    areaChartData,
    areaChartLegendData,
    chartToolTipData,
    yAxisDomain,
  };
}