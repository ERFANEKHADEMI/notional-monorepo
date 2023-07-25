import { TokenBalance } from "@notional-finance/core-entities";
import { formatNumberAsPercent } from './number-helpers'

// ===== NOTE: All of these helpers are to be used with the MultiValueCell
export const formatCryptoWithFiat = (tbn?: TokenBalance | null) => {
  return !tbn || tbn.isZero()
    ? '-'
    : {
        data: [
          tbn.toDisplayStringWithSymbol(3),
          tbn.toFiat('USD').toDisplayStringWithSymbol(3),
        ],
        isNegative: tbn.isNegative(),
      };
};

export const formatValueWithFiat = (tbn?: TokenBalance, isDebt?: boolean) => {
  return !tbn || tbn.isZero()
    ? '-'
    : {
        data: [
          isDebt || (tbn.isNegative() && !tbn.toDisplayString().includes('-'))
            ? `-${tbn.toDisplayString()}`
            : tbn.toDisplayString(),
          tbn.toFiat('USD').toDisplayStringWithSymbol(0),
        ],
        isNegative: isDebt || tbn.isNegative(),
      };
};

export const formatTokenAmount = (tbn?: TokenBalance, impliedFixedRate?: any) => {
  return !tbn || tbn.isZero()
    ? '-'
    : {
        data: [
          tbn.toDisplayString(3, true),
          impliedFixedRate ? `${formatNumberAsPercent(impliedFixedRate)} Fixed` : ''
        ],
        isNegative: tbn.isNegative(),
      };
};
