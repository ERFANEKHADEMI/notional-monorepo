import { useCallback, useContext } from 'react';
import { DepositInput, TransactionSidebar } from '@notional-finance/trade';
import { useHistory } from 'react-router-dom';
import { useCurrencyInputRef } from '@notional-finance/mui';
import { defineMessage } from 'react-intl';
import { LiquidityContext } from '../liquidity';
import { PRODUCTS } from '@notional-finance/util';
import { useLeveragedNTokenPositions } from '../liquidity-leveraged/hooks';

export const LiquidityVariableSidebar = () => {
  const history = useHistory();
  const context = useContext(LiquidityContext);
  const {
    state: { selectedDepositToken },
  } = context;
  const { currencyInputRef } = useCurrencyInputRef();
  const { depositTokensWithPositions } =
    useLeveragedNTokenPositions(selectedDepositToken);

  const handleLeverUpToggle = useCallback(() => {
    history.push(
      `/${PRODUCTS.LIQUIDITY_LEVERAGED}/${
        depositTokensWithPositions.includes(selectedDepositToken || '')
          ? 'IncreaseLeveragedNToken'
          : 'CreateLeveragedNToken'
      }/${selectedDepositToken}`
    );
  }, [history, selectedDepositToken, depositTokensWithPositions]);

  return (
    <TransactionSidebar
      context={context}
      showDrawer
      handleLeverUpToggle={handleLeverUpToggle}
    >
      <DepositInput
        ref={currencyInputRef}
        inputRef={currencyInputRef}
        context={context}
        newRoute={(newToken) => `/${PRODUCTS.LIQUIDITY_VARIABLE}/${newToken}`}
        inputLabel={defineMessage({
          defaultMessage: '1. How much liquidity do you want to provide?',
          description: 'input label',
        })}
      />
    </TransactionSidebar>
  );
};

export default LiquidityVariableSidebar;