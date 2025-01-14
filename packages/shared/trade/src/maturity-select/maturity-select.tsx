import { Maturities } from './components/maturities';
import { MessageDescriptor } from 'react-intl';
import { useMaturitySelect } from './use-maturity-select';
import { BaseTradeContext } from '@notional-finance/notionable-hooks';

interface MaturitySelectProps {
  context: BaseTradeContext;
  category: 'Collateral' | 'Debt';
  inputLabel?: MessageDescriptor;
}

export function MaturitySelect({
  context,
  category,
  inputLabel,
}: MaturitySelectProps) {
  const { maturityData, selectedfCashId, onSelect, defaultfCashId } =
    useMaturitySelect(category, context);

  return (
    <Maturities
      maturityData={maturityData}
      selectedfCashId={selectedfCashId}
      defaultfCashId={defaultfCashId || ''}
      onSelect={onSelect}
      inputLabel={inputLabel}
    />
  );
}
