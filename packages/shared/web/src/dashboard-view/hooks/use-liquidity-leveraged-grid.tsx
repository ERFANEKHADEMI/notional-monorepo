import { useState } from 'react';
import { defineMessage } from 'react-intl';
import { Network, PRODUCTS } from '@notional-finance/util';
// import { useAllMarkets, useFiat } from '@notional-finance/notionable-hooks';
import { useFiat } from '@notional-finance/notionable-hooks';
import { formatNumberAsAbbr } from '@notional-finance/helpers';
import { getTotalIncentiveApy, getTotalIncentiveSymbol } from './utils';
import { DashboardGridProps, DashboardDataProps } from '@notional-finance/mui';
import { useHistory } from 'react-router';
import {
  useLeveragedNTokenPositions,
  useMaxYield,
} from '@notional-finance/trade';

export const useLiquidityLeveragedGrid = (
  network: Network
): DashboardGridProps => {
  const history = useHistory();
  const baseCurrency = useFiat();
  const { nTokenPositions } = useLeveragedNTokenPositions(network);
  const [showNegativeYields, setShowNegativeYields] = useState(false);
  const [hasNegativeApy, setHasNegativeApy] = useState(false);
  const allMaxAPYs = useMaxYield(network);

  const allData = allMaxAPYs
    .map((y) => {
      const currentPosition = nTokenPositions?.find(
        (n) => n.asset.balance.underlying.symbol === y.underlying.symbol
      );

      return {
        ...y,
        symbol: y.underlying.symbol,
        title: y.underlying.symbol,
        subTitle: `Liquidity: ${
          y.tvl
            ? formatNumberAsAbbr(
                y.tvl.toFiat(baseCurrency).toFloat(),
                0,
                baseCurrency
              )
            : 0
        }`,
        hasPosition: currentPosition ? true : false,
        tvlNum: y.tvl ? y.tvl.toFiat(baseCurrency).toFloat() : 0,
        apySubTitle: currentPosition
          ? defineMessage({
              defaultMessage: `Current APY`,
              description: 'subtitle',
            })
          : defineMessage({
              defaultMessage: `AS HIGH AS`,
              description: 'subtitle',
            }),
        bottomValue: ``,
        incentiveValue: currentPosition
          ? getTotalIncentiveApy(
              currentPosition?.asset.marketYield?.noteIncentives?.incentiveAPY,
              currentPosition?.asset.marketYield?.secondaryIncentives
                ?.incentiveAPY
            )
          : getTotalIncentiveApy(
              y?.noteIncentives?.incentiveAPY,
              y?.secondaryIncentives?.incentiveAPY
            ),
        incentiveSymbols: currentPosition
          ? getTotalIncentiveSymbol(
              currentPosition?.asset.marketYield?.secondaryIncentives?.symbol,
              currentPosition?.asset.marketYield?.noteIncentives?.symbol
            )
          : getTotalIncentiveSymbol(
              y?.secondaryIncentives?.symbol,
              y?.noteIncentives?.symbol
            ),
        apy:
          currentPosition && currentPosition.totalLeveragedApy
            ? currentPosition.totalLeveragedApy
            : allMaxAPYs.find((m) => m.token.currencyId === y.token.currencyId)
                ?.totalAPY || 0,
        routeCallback: () =>
          history.push(
            currentPosition
              ? `/${PRODUCTS.LIQUIDITY_LEVERAGED}/${network}/IncreaseLeveragedNToken/${y.underlying.symbol}`
              : `/${PRODUCTS.LIQUIDITY_LEVERAGED}/${network}/CreateLeveragedNToken/${y.underlying.symbol}?borrowOption=${y?.leveraged?.debtToken?.id}`
          ),
      };
    })
    .sort((a, b) => b.tvlNum - a.tvlNum);

  const defaultLeveragedLiquidityData = allData.filter(
    ({ hasPosition }) => !hasPosition
  );
  const userPositions = allData.filter(({ hasPosition }) => hasPosition);

  const negativeApyCheck = (data: DashboardDataProps[]) => {
    if (!showNegativeYields) {
      return data.filter(({ apy }) => {
        if (apy < 0 && !hasNegativeApy) {
          setHasNegativeApy(true);
        }
        return apy > 0;
      });
    } else {
      return data;
    }
  };

  const gridData = [
    {
      sectionTitle: userPositions.length > 0 ? 'opportunities' : '',
      data: negativeApyCheck(defaultLeveragedLiquidityData),
      hasLeveragedPosition: false,
    },
  ];

  if (userPositions.length > 0) {
    gridData.unshift({
      sectionTitle:
        userPositions.length === 1 ? 'Your position' : 'Your positions',
      data: userPositions,
      hasLeveragedPosition: true,
    });
  }

  const levLiquidityData = allData && allData.length > 0 ? gridData : [];

  return {
    gridData: levLiquidityData,
    setShowNegativeYields: hasNegativeApy ? setShowNegativeYields : undefined,
    showNegativeYields: hasNegativeApy ? showNegativeYields : undefined,
  };
};

export default useLiquidityLeveragedGrid;