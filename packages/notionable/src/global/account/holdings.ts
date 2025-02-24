import {
  Network,
  RATE_PRECISION,
  SECONDS_IN_DAY,
  TABLE_WARNINGS,
  convertToSignedfCashId,
  getNowSeconds,
  leveragedYield,
} from '@notional-finance/util';
import { AccruedIncentives } from './incentives';
import {
  AccountDefinition,
  FiatKeys,
  Registry,
  TokenBalance,
} from '@notional-finance/core-entities';
import { VaultAccountRiskProfile } from '@notional-finance/risk-engine';
import { CalculatedPriceChanges } from '../global-state';

export type PortfolioHolding = ReturnType<typeof calculateHoldings>[number];
export type GroupedHolding = ReturnType<
  typeof calculateGroupedHoldings
>[number];
export type VaultHolding = ReturnType<typeof calculateVaultHoldings>[number];
export type CurrentFactors = ReturnType<typeof calculateAccountCurrentFactors>;

function isHighUtilization(
  balance: TokenBalance,
  priceChanges: CalculatedPriceChanges | undefined,
  positionEstablished = getNowSeconds(),
  threshold = -0.005
) {
  const token = balance.token;
  if (balance.hasMatured) return undefined;

  if (
    token.tokenType === 'nToken' ||
    // Only show this for positive fCash
    (token.tokenType === 'fCash' && balance.isPositive())
  ) {
    const oneDay = priceChanges?.oneDay.find((p) => p.asset.id === token.id);
    const threeDay = priceChanges?.threeDay.find(
      (p) => p.asset.id === token.id
    );

    if (
      (oneDay?.underlyingChange !== undefined &&
        oneDay.underlyingChange < threshold &&
        positionEstablished < getNowSeconds() - SECONDS_IN_DAY) ||
      (threeDay?.underlyingChange !== undefined &&
        threeDay.underlyingChange < threshold &&
        positionEstablished < getNowSeconds() - 3 * SECONDS_IN_DAY)
    ) {
      return token.tokenType === 'fCash'
        ? TABLE_WARNINGS.HIGH_UTILIZATION_FCASH
        : TABLE_WARNINGS.HIGH_UTILIZATION_NTOKEN;
    }
  }

  return undefined;
}

/**
 * Exposes all the relevant information for account holdings in the normal portfolio,
 * excludes Vault, Underlying and NOTE balances
 */
export function calculateHoldings(
  account: AccountDefinition,
  accruedIncentives: AccruedIncentives[],
  priceChanges: CalculatedPriceChanges | undefined
) {
  const balances = account.balances
    .filter(
      (b) =>
        !b.isZero() &&
        !b.isVaultToken &&
        b.token.tokenType !== 'Underlying' &&
        b.token.tokenType !== 'NOTE'
    )
    .sort((a, b) => a.currencyId - b.currencyId);

  const nonLeveragedYields = Registry.getYieldRegistry().getNonLeveragedYields(
    account.network
  );

  const holdings = balances.map((balance) => {
    const statement = account.balanceStatement?.find(
      (s) =>
        s.token.id ===
        // Balance statements use signed fCash ids
        convertToSignedfCashId(balance.tokenId, balance.isNegative())
    );

    // Convert the matured fcash token to pcash or pdebt token id
    const maturedTokenId = balance.hasMatured
      ? balance.isPositive()
        ? balance.toPrimeCash().tokenId
        : balance.toPrimeDebt().tokenId
      : balance.token.id;

    const manageTokenId = balance.hasMatured
      ? balance.isPositive()
        ? // This is the opposite of `maturedTokenId`
          balance.toPrimeDebt().tokenId
        : balance.toPrimeCash().tokenId
      : balance.token.id;

    const marketYield = nonLeveragedYields.find(
      ({ token }) => token.id === maturedTokenId
    );

    // Returns accrued incentives and adjusted claimed incentives as an array
    const _incentiveEarnings: TokenBalance[] =
      balance.tokenType === 'nToken'
        ? statement?.incentives
            .map(({ adjustedClaimed }) => adjustedClaimed)
            .concat(
              accruedIncentives?.find(
                ({ currencyId }) => balance.currencyId === currencyId
              )?.incentives || []
            ) || []
        : [];

    // Reduces the array above to one entry per incentive token
    const perIncentiveEarnings = Array.from(
      _incentiveEarnings
        .reduce((m, b) => {
          const match = m.get(b.tokenId);
          if (match) {
            m.set(match.tokenId, match.add(b));
          } else {
            m.set(b.tokenId, b);
          }
          return m;
        }, new Map<string, TokenBalance>())
        .values()
    );
    const totalIncentiveEarnings = perIncentiveEarnings.reduce(
      (s, i) => s.add(i.toFiat('USD')),
      TokenBalance.fromSymbol(0, 'USD', Network.all)
    );

    const totalEarningsWithIncentives = statement?.totalProfitAndLoss
      .toFiat('USD')
      .add(totalIncentiveEarnings);

    const positionEstablished = account?.historicalBalances
      ?.reverse()
      .find(
        (h) => h.balance.tokenId === balance.tokenId && !balance.isZero()
      )?.timestamp;

    return {
      balance,
      statement,
      marketYield,
      manageTokenId,
      maturedTokenId,
      perIncentiveEarnings,
      totalIncentiveEarnings,
      totalEarningsWithIncentives,
      marketProfitLoss: totalEarningsWithIncentives?.sub(
        statement?.totalInterestAccrual.toFiat('USD') ||
          TokenBalance.fromSymbol(0, 'USD', Network.all)
      ),
      hasMatured: balance.hasMatured,
      isHighUtilization: isHighUtilization(
        balance,
        priceChanges,
        positionEstablished
      ),
      hasNToken: !!nonLeveragedYields.find(
        (y) =>
          y.token.tokenType === 'nToken' &&
          y.token.currencyId === balance.currencyId
      ),
    };
  });

  return holdings;
}

/**
 * Calculates grouped tokens which are paired asset / debt portfolio holdings in the same currency
 */
export function calculateGroupedHoldings(
  account: AccountDefinition,
  holdings: PortfolioHolding[]
) {
  const balances =
    account?.balances.filter(
      (b) =>
        !b.isZero() &&
        !b.isVaultToken &&
        b.token.tokenType !== 'Underlying' &&
        b.token.tokenType !== 'NOTE'
    ) || [];
  const assets = balances.filter((b) => b.isPositive());
  const debts = balances.filter((b) => b.isNegative());

  return assets.reduce(
    (l, asset) => {
      const matchingDebts = debts.filter(
        (b) => b.currencyId === asset.currencyId
      );
      const matchingAssets = assets.filter(
        (b) => b.currencyId === asset.currencyId && asset.tokenType === 'nToken'
      );

      // Only creates a grouped holding if there is exactly one matching asset and debt
      if (matchingDebts.length === 1 && matchingAssets.length === 1) {
        const asset = matchingAssets[0];
        const debt = matchingDebts[0];
        const presentValue = asset.toUnderlying().add(debt.toUnderlying());
        const leverageRatio =
          debt.toUnderlying().neg().ratioWith(presentValue).toNumber() /
          RATE_PRECISION;

        // NOTE: enforce a minimum leverage ratio on these to ensure that dust balances
        // don't create leveraged positions
        if (leverageRatio > 0.05) {
          const debtHoldings = holdings.find(
            ({ balance }) => balance.tokenId === debt.tokenId
          );

          const assetHoldings = holdings.find(
            ({ balance }) => balance.tokenId === asset.tokenId
          ) as typeof holdings[number];

          const borrowApyData =
            debtHoldings?.marketYield?.token.tokenType === 'PrimeDebt'
              ? debtHoldings.marketYield.totalAPY
              : // Need to check for undefined here if the debtHoldings is undefined
                debtHoldings?.statement?.impliedFixedRate;
          const zeroUnderlying = TokenBalance.zero(asset.underlying);

          const totalEarnings = (
            assetHoldings.statement?.totalProfitAndLoss || zeroUnderlying
          ).add(debtHoldings?.statement?.totalProfitAndLoss || zeroUnderlying);
          const totalInterestAccrual = (
            assetHoldings.statement?.totalInterestAccrual || zeroUnderlying
          ).add(
            debtHoldings?.statement?.totalInterestAccrual || zeroUnderlying
          );
          const totalILAndFees = (
            assetHoldings.statement?.totalILAndFees || zeroUnderlying
          ).add(debtHoldings?.statement?.totalILAndFees || zeroUnderlying);
          const marketProfitLoss = totalEarnings.sub(totalInterestAccrual);

          l.push({
            asset: assetHoldings,
            debt: debtHoldings as PortfolioHolding,
            presentValue,
            leverageRatio,
            hasMatured: asset?.hasMatured || debt?.hasMatured ? true : false,
            borrowAPY: borrowApyData,
            totalInterestAccrual,
            totalILAndFees,
            marketProfitLoss,
            totalEarnings,
            totalLeveragedApy: leveragedYield(
              assetHoldings.marketYield?.totalAPY,
              borrowApyData,
              leverageRatio
            ),
          });
        }
      }

      return l;
    },
    [] as {
      asset: PortfolioHolding;
      debt: PortfolioHolding;
      presentValue: TokenBalance;
      totalInterestAccrual: TokenBalance;
      marketProfitLoss: TokenBalance;
      totalILAndFees: TokenBalance;
      totalEarnings: TokenBalance;
      leverageRatio: number;
      hasMatured: boolean;
      borrowAPY: number | undefined;
      totalLeveragedApy: number | undefined;
    }[]
  );
}

/**
 * Calculates data to display for each vault holding
 */
export function calculateVaultHoldings(account: AccountDefinition) {
  const vaultProfiles = VaultAccountRiskProfile.getAllRiskProfiles(account);
  const balanceStatements = account.balanceStatement || [];
  const allYields = Registry.getYieldRegistry().getNonLeveragedYields(
    account.network
  );

  return vaultProfiles.map((v) => {
    const debtPnL = balanceStatements.find(
      (b) => b.token.id === v.vaultDebt.tokenId
    );
    const assetPnL = balanceStatements?.find(
      (b) => b.token.id === v.vaultShares.tokenId
    );
    const cashPnL = balanceStatements?.find(
      (b) => b.token.id === v.vaultCash.tokenId
    );

    const denom = v.denom(v.defaultSymbol);
    const zeroDenom = TokenBalance.zero(denom);
    const profit = (assetPnL?.totalProfitAndLoss || zeroDenom)
      .add(debtPnL?.totalProfitAndLoss || zeroDenom)
      .add(cashPnL?.totalProfitAndLoss || zeroDenom);
    const vaultYield = allYields.find(
      (y) => v.vaultShares.tokenId === y.token.id
    );
    const strategyAPY = vaultYield?.totalAPY || 0;
    const borrowAPY =
      debtPnL?.impliedFixedRate !== undefined
        ? debtPnL.impliedFixedRate
        : allYields.find(
            (d) => d.token.id === v.vaultDebt.unwrapVaultToken().tokenId
          )?.totalAPY || 0;

    const amountPaid = (assetPnL?.accumulatedCostRealized || zeroDenom)
      .add(debtPnL?.accumulatedCostRealized || zeroDenom)
      .add(cashPnL?.accumulatedCostRealized || zeroDenom);

    const leverageRatio = v.leverageRatio() || 0;
    const totalAPY = leveragedYield(strategyAPY, borrowAPY, leverageRatio);

    const totalInterestAccrual = (assetPnL?.totalInterestAccrual || zeroDenom)
      .add(debtPnL?.totalInterestAccrual || zeroDenom)
      .add(cashPnL?.totalInterestAccrual || zeroDenom);

    const totalILAndFees = (assetPnL?.totalILAndFees || zeroDenom)
      .add(debtPnL?.totalILAndFees || zeroDenom)
      .add(cashPnL?.totalILAndFees || zeroDenom);

    const marketProfitLoss = profit.sub(totalInterestAccrual);

    return {
      vault: v,
      liquidationPrices: v.getAllLiquidationPrices(),
      netWorth: v.netWorth(),
      healthFactor: v.healthFactor(),
      totalAPY,
      borrowAPY,
      amountPaid,
      strategyAPY,
      profit,
      denom,
      leverageRatio,
      vaultYield,
      marketProfitLoss,
      totalILAndFees,
      totalInterestAccrual,
      assetPnL,
      debtPnL,
    };
  });
}

export function calculateAccountCurrentFactors(
  holdings: ReturnType<typeof calculateHoldings>,
  vaults: ReturnType<typeof calculateVaultHoldings>,
  baseCurrency: FiatKeys
) {
  const fiatToken = Registry.getTokenRegistry().getTokenBySymbol(
    Network.all,
    baseCurrency
  );

  const { weightedYield, netWorth, debts, assets } = vaults.reduce(
    ({ weightedYield, netWorth, debts, assets }, { totalAPY, vault }) => {
      const { debts: d, assets: a, netWorth: _w } = vault.getAllRiskFactors();
      const w = _w.toFiat(baseCurrency).toFloat();
      return {
        weightedYield: weightedYield + (totalAPY || 0) * w,
        netWorth: netWorth.add(_w.toFiat(baseCurrency)),
        debts: debts.add(d.toFiat(baseCurrency)),
        assets: assets.add(a.toFiat(baseCurrency)),
      };
    },
    holdings.reduce(
      (
        { weightedYield, netWorth, assets, debts },
        { marketYield, balance }
      ) => {
        const w = balance.toFiat(baseCurrency);
        return {
          weightedYield:
            weightedYield + (marketYield?.totalAPY || 0) * w.toFloat(),
          netWorth: netWorth.add(w),
          debts: balance.isNegative() ? debts.add(w) : debts,
          assets: balance.isPositive() ? assets.add(w) : assets,
        };
      },
      {
        weightedYield: 0,
        netWorth: TokenBalance.zero(fiatToken),
        debts: TokenBalance.zero(fiatToken),
        assets: TokenBalance.zero(fiatToken),
      }
    )
  );

  return {
    currentAPY: !netWorth.isZero()
      ? weightedYield / netWorth.toFloat()
      : undefined,
    netWorth,
    debts,
    assets,
  };
}
