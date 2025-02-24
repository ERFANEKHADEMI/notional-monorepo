import { Box, styled, useTheme } from '@mui/material';
import { PORTFOLIO_ACTIONS } from '@notional-finance/util';
import {
  ExternalLink,
  SideDrawerButton,
  H4,
  LabelValue,
} from '@notional-finance/mui';
import { FormattedMessage } from 'react-intl';
import { messages } from '../messages';
import { useAddToCalendar } from './use-add-to-calendar';
import { useQueryParams } from '@notional-finance/notionable-hooks';

export const AddToCalendar = () => {
  const theme = useTheme();
  const params = useQueryParams();
  const date = params.get('date');
  const calData = useAddToCalendar(date);

  return (
    <Box>
      <Title>
        <FormattedMessage
          {...messages[PORTFOLIO_ACTIONS.ADD_TO_CALENDAR]['heading']}
        />
      </Title>
      {calData.map(({ label, Icon, href }, index) => (
        <SideDrawerButton key={index}>
          <ExternalLink
            href={href}
            fitContent
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                height: '35px',
                width: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ height: '35px', width: '35px' }} />
            </Box>
            <H4
              sx={{
                flex: 1,
                color: theme.palette.common.black,
                whiteSpace: 'nowrap',
                marginLeft: '15px',
              }}
              fontWeight="regular"
            >
              {label}
            </H4>
          </ExternalLink>
        </SideDrawerButton>
      ))}
    </Box>
  );
};

const Title = styled(LabelValue)(
  ({ theme }) => `
  margin-bottom: ${theme.spacing(2.5)};
  font-weight: 700;
  color: ${theme.palette.typography.light};
  text-transform: uppercase;
  `
);
