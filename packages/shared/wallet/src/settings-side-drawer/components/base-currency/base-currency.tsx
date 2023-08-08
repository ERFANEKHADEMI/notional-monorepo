import { useCallback } from 'react';
import { useTheme, Box, styled } from '@mui/material';
import { LabelValue, SideDrawerActiveButton } from '@notional-finance/mui';
import {
  useFiat,
  useNotionalContext,
} from '@notional-finance/notionable-hooks';

import {
  setInLocalStorage,
  getFromLocalStorage,
} from '@notional-finance/helpers';
import { FormattedMessage } from 'react-intl';
import { useBaseCurrency } from './use-base-currency';
import { FiatKeys } from '@notional-finance/core-entities';

export const BaseCurrencyButton = () => {
  const theme = useTheme();
  const { selectedCurrency } = useBaseCurrency();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          paddingRight: theme.spacing(1),
          display: 'flex',
          alignItems: 'center',
          '.base-currency-icon': {
            height: theme.spacing(2.5),
            width: theme.spacing(2.5),
          },
        }}
      >
        {selectedCurrency?.Icon && selectedCurrency.Icon}
      </Box>

      {selectedCurrency?.label}
    </Box>
  );
};

export const BaseCurrency = () => {
  const { updateNotional } = useNotionalContext();
  const { allCurrencies } = useBaseCurrency();
  const baseCurrency = useFiat();
  const userSettings = getFromLocalStorage('userSettings');
  const defaultKey = userSettings?.baseCurrency || baseCurrency;

  const handleConnect = useCallback(
    (key: string) => {
      const selectedCurrency = key as FiatKeys;
      updateNotional({ baseCurrency: selectedCurrency });
      setInLocalStorage('userSettings', { ...userSettings, baseCurrency: key });
    },
    [userSettings, updateNotional]
  );

  return (
    <WalletSelectorContainer>
      <Title>
        <FormattedMessage defaultMessage="Base Currency" />
      </Title>
      {allCurrencies.map(({ label, Icon, key }, index) => (
        <SideDrawerActiveButton
          label={label}
          Icon={Icon}
          dataKey={key}
          key={index}
          callback={handleConnect}
          selectedKey={defaultKey}
        />
      ))}
    </WalletSelectorContainer>
  );
};

const Title = styled(LabelValue)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(2.5)};
  font-weight: 700;
  color: ${theme.palette.borders.accentDefault};
  text-transform: uppercase;
  `
);

const WalletSelectorContainer = styled(Box)(
  ({ theme }) => `
  margin: 0px;
  font-weight: 700;
  color: ${theme.palette.primary.dark};
  background: ${theme.palette.background.paper};
  marginBottom: ${theme.spacing(8)},
  `
);

export default BaseCurrency;