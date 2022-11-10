import { Box, Grid, useTheme, styled } from '@mui/material';
import iconDisable from '@notional-finance/assets/icons/icon-disable-currency.svg';
import { useWallet } from '@notional-finance/notionable-hooks';
import { NotionalTheme } from '@notional-finance/styles';
import { TokenIcon, CheckmarkRoundIcon } from '@notional-finance/icons';
import { useTokenApproval } from '@notional-finance/trade';

interface CurrencyIconProps {
  symbol: string;
  disableOption?: boolean;
  allCurrencies?: boolean;
  enabled?: boolean;
}

interface StyledCompProps {
  theme: NotionalTheme;
  enabled?: boolean;
  walletConnected?: boolean;
}

export const CurrencyIcon = ({
  symbol,
  disableOption,
  allCurrencies,
  enabled,
}: CurrencyIconProps) => {
  const { walletConnected } = useWallet();
  const { enableToken } = useTokenApproval(symbol);
  const theme = useTheme() as NotionalTheme;
  const approved = !enabled;

  return (
    <CurrencyContainer
      onClick={() => enableToken({ symbol: symbol, approved: approved })}
      onKeyPress={() => enableToken({ symbol: symbol, approved: approved })}
      container
      item
      direction="row"
      xs={3}
      justifyContent="center"
    >
      {!allCurrencies && (
        <div>
          <TokenIcon symbol={symbol} size="large" />
        </div>
      )}
      {allCurrencies && (
        <div>
          <CheckmarkContainer
            enabled={enabled}
            theme={theme}
            walletConnected={walletConnected}
          >
            <CheckmarkRoundIcon
              foregroundColor={theme.palette.common.white}
              backgroundColor={theme.palette.primary.main}
              sx={{ height: '16px' }}
            />
          </CheckmarkContainer>
          <CurrencyImg
            enabled={enabled}
            theme={theme}
            walletConnected={walletConnected}
          >
            <TokenIcon symbol={symbol} size="large" />
          </CurrencyImg>
        </div>
      )}
      <CurrencyLabelContainer>
        <CurrencyLabel>{symbol}</CurrencyLabel>
        {symbol !== 'ETH' && disableOption ? (
          <span>
            <img width="76px" src={iconDisable} alt="disable currency" />
          </span>
        ) : (
          <Box sx={{ height: '30px' }} />
        )}
      </CurrencyLabelContainer>
    </CurrencyContainer>
  );
};

const CurrencyLabel = styled('div')(
  () => `
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
`
);

const CurrencyLabelContainer = styled('div')(
  () => `
  width: 100%;
`
);

const CheckmarkContainer = styled('div', {
  shouldForwardProp: (prop: string) =>
    prop !== 'enabled' && prop !== 'walletConnected',
})(
  ({ enabled, walletConnected }: StyledCompProps) => `
  position: relative;
  visibility: ${enabled && walletConnected ? 'visible' : 'hidden'};
  top: 16px;
  z-index: 2;
  left: -12px;
`
);

const CurrencyImg = styled('div', {
  shouldForwardProp: (prop: string) =>
    prop !== 'enabled' && prop !== 'theme' && prop !== 'walletConnected',
})(
  ({ theme, enabled, walletConnected }: StyledCompProps) => `
  z-index: 1;
  position: relative;
  width: 40px;
  height: 40px;
  img {
    position: absolute;
    top: -4.5px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 1;
    border-radius: 50%;
    border: 5px solid transparent;
    transition: border-color 0.4s ease;
    width: 40px;
    height: 40px;
  }

  &:hover {${
    !enabled &&
    walletConnected &&
    `
  img {
    border: 5px solid ${theme.palette.primary.main};
    box-shadow: 1px 2px 3px 0px #14296633;
  }
`
  }}

${
  enabled &&
  `img {
    border: 5px solid ${theme.palette.primary.main};
    box-shadow: 1px 2px 3px 0px #14296633;
  }`
}
`
);

const CurrencyContainer = styled(Grid)(
  () => `
  padding-bottom: 16px;
  height: 80px;
  text-align: center;
  cursor: pointer;
  outline: none;
  width: 80px;
  display: inline-grid;
  position: relative;
  span {
    bottom: 10px;
    z-index: 2;
    opacity: 0;
    transition: visibility 0.25s linear, opacity 0.25s linear;
  }
  &:hover {
    span {
        opacity: 1;
    }
 }
`
);

export default CurrencyIcon;
