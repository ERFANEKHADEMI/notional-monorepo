import { useAllMarkets } from '@notional-finance/notionable-hooks';
import {
  formatMaturity,
  formatNumberAsPercent,
} from '@notional-finance/helpers';
import { YieldData } from '@notional-finance/core-entities';
import {
  DataTableColumn,
  MultiValueIconCell,
  DisplayCell,
} from '@notional-finance/mui';
import { FormattedMessage } from 'react-intl';

export const useRatesTable = (selectedDepositToken: string | undefined) => {
  const {
    yields: { variableLend, fCashLend, fCashBorrow, variableBorrow },
  } = useAllMarkets();

  const getTokenData = (dataSet: YieldData[]) => {
    return dataSet.filter(
      (token) => token?.underlying?.symbol === selectedDepositToken
    );
  };

  const variableLendData = getTokenData(variableLend);
  const fixedLendData = getTokenData(fCashLend);
  const fixedBorrowData = getTokenData(fCashBorrow);
  const variableBorrowData = getTokenData(variableBorrow);

  const variableRatesData = [
    {
      maturity: {
        symbol: variableLendData[0]?.underlying?.symbol,
        label: 'Variable',
      },
      lend_apy: variableLendData[0]?.totalAPY || 0,
      borrow_apy: variableBorrowData[0]?.totalAPY || 0,
    },
  ];

  const fixedRatesData = fixedLendData.map(
    ({ underlying, token, totalAPY }, index) => {
      return {
        maturity: {
          symbol: underlying?.symbol,
          label: formatMaturity(token.maturity || 0),
          caption: 'Fixed Rate',
        },
        lend_apy: totalAPY || 0,
        borrow_apy: fixedBorrowData[index]?.totalAPY || 0,
      };
    }
  );

  const ratesColumns: DataTableColumn[] = [
    {
      Header: (
        <FormattedMessage
          defaultMessage="Maturity"
          description={'maturity header'}
        />
      ),
      Cell: MultiValueIconCell,
      accessor: 'maturity',
      textAlign: 'left',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Lend APY"
          description={'Lend APY header'}
        />
      ),
      Cell: DisplayCell,
      displayFormatter: formatNumberAsPercent,
      accessor: 'lend_apy',
      textAlign: 'right',
    },
    {
      Header: (
        <FormattedMessage
          defaultMessage="Borrow APY"
          description={'Borrow APY header'}
        />
      ),
      Cell: DisplayCell,
      displayFormatter: formatNumberAsPercent,
      accessor: 'borrow_apy',
      textAlign: 'right',
    },
  ];

  return { ratesColumns, ratesData: [...variableRatesData, ...fixedRatesData] };
};