import { useContext } from 'react';
import { Box, useTheme } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import {
  Faq,
  FaqHeader,
  MultiDisplayChart,
  AreaChart,
  ChartContainer,
  TotalBox,
} from '@notional-finance/mui';
import { useLendVariableFaq } from '../hooks';
import { LendVariableContext } from '../../lend-variable/lend-variable';
import {
  TradeActionSummary,
  useVariableTotals,
  useInterestRateUtilizationChart,
} from '@notional-finance/trade';
import { useTokenHistory } from '@notional-finance/notionable-hooks';

export const LendVariableTradeSummary = () => {
  const theme = useTheme();
  const context = useContext(LendVariableContext);
  const { state } = context;
  const { collateral, deposit } = state;
  const { faqs, faqHeaderLinks } = useLendVariableFaq(
    state.selectedDepositToken
  );
  const totalsData = useVariableTotals(state);
  const { apyData, tvlData } = useTokenHistory(collateral);
  const {
    areaChartData,
    chartToolTipData,
    areaChartStyles,
    chartHeaderData,
    chartInfoBoxData,
    borrowUtilization,
  } = useInterestRateUtilizationChart(deposit?.currencyId, 'lend');

  return (
    <TradeActionSummary state={state}>
      <MultiDisplayChart
        chartComponents={[
          {
            id: 'apy-area-chart',
            title: 'APY',
            Component: (
              <ChartContainer>
                <AreaChart
                  showCartesianGrid
                  xAxisTickFormat="date"
                  areaChartData={apyData}
                  areaLineType="linear"
                />
              </ChartContainer>
            ),
            // chartHeaderData: {
            //   textHeader: (
            //     <Box
            //       sx={{
            //         background: theme.palette.background.default,
            //         border: theme.shape.borderStandard,
            //         borderRadius: theme.shape.borderRadius(),
            //         padding: theme.spacing(0.5, 1),
            //       }}
            //     >
            //       <FormattedMessage defaultMessage={'90 Day'} />
            //     </Box>
            //   ),
            // },
          },
          {
            id: 'tvl-area-chart',
            title: 'TVL',
            Component: (
              <ChartContainer>
                <AreaChart
                  showCartesianGrid
                  xAxisTickFormat="date"
                  areaChartData={tvlData}
                  areaLineType="linear"
                />
              </ChartContainer>
            ),
            // chartHeaderData: {
            //   textHeader: (
            //     <Box
            //       sx={{
            //         background: theme.palette.background.default,
            //         border: theme.shape.borderStandard,
            //         borderRadius: theme.shape.borderRadius(),
            //         padding: theme.spacing(0.5, 1),
            //       }}
            //     >
            //       <FormattedMessage defaultMessage={'90 Day'} />
            //     </Box>
            //   ),
            // },
          },
        ]}
      />
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
      {areaChartData.length > 0 && (
        <MultiDisplayChart
          chartComponents={[
            {
              id: 'area-chart',
              title: 'Lend Rate Utilization',
              Component: (
                <ChartContainer>
                  <AreaChart
                    showCartesianGrid
                    areaLineType="linear"
                    xAxisTickFormat="percent"
                    areaChartData={areaChartData}
                    areaChartStyles={areaChartStyles}
                    chartToolTipData={chartToolTipData}
                    referenceLineValue={borrowUtilization}
                  />
                </ChartContainer>
              ),
              chartHeaderData: chartHeaderData,
              chartInfoBoxData: chartInfoBoxData,
              bottomLabel: <FormattedMessage defaultMessage={'Utilization'} />,
            },
          ]}
        />
      )}
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
