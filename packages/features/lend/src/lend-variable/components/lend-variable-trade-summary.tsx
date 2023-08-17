import { useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Faq, FaqHeader, TotalBox } from '@notional-finance/mui';
import { useLendVariableFaq } from '../hooks';
import { LendVariableContext } from '../../lend-variable/lend-variable';
import { TradeActionSummary, useVariableTotals } from '@notional-finance/trade';

export const LendVariableTradeSummary = () => {
  const theme = useTheme();
  const context = useContext(LendVariableContext);
  const { state } = context;
  const { faqs, faqHeaderLinks } = useLendVariableFaq(
    state.selectedDepositToken
  );
  const totalsData = useVariableTotals(state);

  return (
    <TradeActionSummary state={state}>
      <Box
        sx={{
          display: 'flex',
          gap: theme.spacing(5),
          marginBottom: theme.spacing(3),
          marginTop: theme.spacing(3),
        }}
      >
        {totalsData.map(({ title, value }, index) => (
          <TotalBox title={title} value={value} key={index} />
        ))}
      </Box>
      <FaqHeader
        title={<FormattedMessage defaultMessage={'Variable Lend FAQ'} />}
        links={faqHeaderLinks}
      />
      {faqs.map(({ question, answer, componentAnswer }, index) => (
        <Faq
          key={index}
          question={question}
          answer={answer}
          componentAnswer={componentAnswer}
        />
      ))}
    </TradeActionSummary>
  );
};

export default LendVariableTradeSummary;