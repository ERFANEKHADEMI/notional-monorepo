import { Registry } from '@notional-finance/core-entities';
import { TradeState } from '@notional-finance/notionable';
import { useAllMarkets } from '@notional-finance/notionable-hooks';
import { leveragedYield } from '@notional-finance/util';

export const useLeveragedNTokenAPY = (state: TradeState) => {
  const {
    collateralBalance,
    riskFactorLimit,
    debtOptions,
    debt,
    debtBalance,
    selectedDepositToken,
    selectedNetwork,
  } = state;
  const {
    yields: { liquidity },
    nonLeveragedYields,
  } = useAllMarkets(selectedNetwork);

  const nTokenAmount =
    collateralBalance?.tokenType === 'nToken' ? collateralBalance : undefined;
  const leverageRatio = riskFactorLimit?.limit as number | undefined;
  const selectedDebtOption = debtOptions?.find((t) => t.token.id === debt?.id);

  let liquidityYieldData = nTokenAmount
    ? Registry.getYieldRegistry().getSimulatedNTokenYield(
        nTokenAmount,
        // NOTE: inside here the debt balance and collateral balance do not "flip"
        // when withdrawing
        debtBalance?.token.tokenType === 'PrimeDebt'
          ? debtBalance.toPrimeDebt().neg()
          : debtBalance?.token.tokenType === 'PrimeCash'
          ? debtBalance.toPrimeDebt().neg()
          : undefined
      )
    : liquidity.find(
        ({ underlying }) => underlying.symbol === selectedDepositToken
      );

  if (leverageRatio) {
    // Need to do a copy here otherwise we end up updating the parent
    // object and get weird memory reference issues.
    liquidityYieldData = Object.assign({}, liquidityYieldData);
    const debtAPY =
      selectedDebtOption?.interestRate ||
      // This catches the case when the selected debt option is not defined
      nonLeveragedYields.find(({ token }) => token.id === debt?.id)?.totalAPY;

    if (debtAPY) {
      // If using leverage apply the debt APY to the interest apy
      liquidityYieldData.organicAPY = leveragedYield(
        (liquidityYieldData?.organicAPY || 0) + (liquidityYieldData?.feeAPY || 0),
        debtAPY,
        leverageRatio
      );
    }

    // If using leverage apply the leverage ratio to the incentive APY directly
    if (liquidityYieldData?.noteIncentives) {
      liquidityYieldData.noteIncentives = {
        symbol: 'NOTE',
        incentiveAPY:
          leveragedYield(
            liquidityYieldData.noteIncentives.incentiveAPY,
            0,
            leverageRatio
          ) || liquidityYieldData.noteIncentives.incentiveAPY,
      };
    }

    if (liquidityYieldData?.secondaryIncentives) {
      liquidityYieldData.secondaryIncentives = {
        symbol: liquidityYieldData.secondaryIncentives.symbol,
        incentiveAPY:
          leveragedYield(
            liquidityYieldData.secondaryIncentives.incentiveAPY,
            0,
            leverageRatio
          ) || liquidityYieldData.secondaryIncentives.incentiveAPY,
      };
    }
  }

  return liquidityYieldData;
};
