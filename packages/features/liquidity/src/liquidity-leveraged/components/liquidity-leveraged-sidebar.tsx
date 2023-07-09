import { useContext } from 'react';
import {
  TradeActionButton,
  DepositInput,
  Confirmation2,
} from '@notional-finance/trade';
import { useHistory } from 'react-router-dom';
import { ActionSidebar, useCurrencyInputRef } from '@notional-finance/mui';
import { defineMessage, FormattedMessage } from 'react-intl';
import { LiquidityContext } from '../liquidity-leveraged';

export const LiquidityLeveragedSidebar = () => {
  const history = useHistory();
  const {
    state: { canSubmit, populatedTransaction, confirm, selectedDepositToken },
    updateState,
  } = useContext(LiquidityContext);
  const { currencyInputRef } = useCurrencyInputRef();

  const handleLeverUpToggle = () => {
    history.push(`/liquidity-variable/${selectedDepositToken}`);
  };

  const handleSubmit = () => {
    updateState({ confirm: true });
  };

  return confirm && populatedTransaction ? (
    <Confirmation2
      heading={
        <FormattedMessage
          defaultMessage={'Leveraged Liquidity'}
          description="section heading"
        />
      }
      context={LiquidityContext}
    />
  ) : (
    <ActionSidebar
      heading={defineMessage({
        defaultMessage: 'Leveraged Liquidity',
        description: 'section heading',
      })}
      helptext={defineMessage({
        defaultMessage: 'TBD',
        description: 'helptext',
      })}
      hideTextOnMobile
      CustomActionButton={TradeActionButton}
      canSubmit={canSubmit}
      handleLeverUpToggle={handleLeverUpToggle}
      handleSubmit={handleSubmit}
      leveredUp={true}
    >
      <DepositInput
        ref={currencyInputRef}
        inputRef={currencyInputRef}
        context={LiquidityContext}
        newRoute={(newToken) => `/provide/${newToken}`}
        inputLabel={defineMessage({
          defaultMessage: '1. How much liquidity do you want to provide?',
          description: 'input label',
        })}
      />
      {/* <TradePropertiesGrid showBackground data={tradeProperties || {}} /> */}
    </ActionSidebar>
  );
};

export default LiquidityLeveragedSidebar;