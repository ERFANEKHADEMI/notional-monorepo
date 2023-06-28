import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ExitEarlyFaq, RiskFaq } from '../components';

interface FaqProps {
  question: ReactNode;
  answer?: ReactNode;
  componentAnswer?: ReactNode;
}

export const useLendFixedFaq = () => {
  // TODO: ADD LINKS
  const faqHeaderLinks = [
    {
      href: '',
      text: <FormattedMessage defaultMessage={'Fixed Lending Documentation'} />,
    },
    {
      href: '',
      text: <FormattedMessage defaultMessage={'Notional Contract'} />,
    },
  ];
  const faqs: FaqProps[] = [
    {
      question: (
        <FormattedMessage
          defaultMessage={'Where does the yield come from?'}
          description={'faq question'}
        />
      ),
      answer: (
        <FormattedMessage
          defaultMessage={`Yield on Notional comes from over-collateralized borrowing by advanced DeFi users who want to get leverage on DeFi yield strategies.`}
          description={'faq answer'}
        />
      ),
    },

    {
      question: (
        <FormattedMessage
          defaultMessage={'What happens at maturity?'}
          description={'faq question'}
        />
      ),
      answer: (
        <FormattedMessage
          defaultMessage={`At maturity your fixed rate loan will automatically switch over to earning interest at Notional’s variable lending rate. No action required from you at all! You can withdraw your capital, leave it earning the variable rate, or extend your loan to a new fixed rate at a new maturity. It’s up to you!`}
        />
      ),
    },
    {
      question: (
        <FormattedMessage
          defaultMessage={'Can I exit early?'}
          description={'faq question'}
        />
      ),
      answer: <ExitEarlyFaq />,
    },
    {
      question: (
        <FormattedMessage
          defaultMessage={'What are the risks?'}
          description={'faq question'}
        />
      ),

      componentAnswer: <RiskFaq />,
    },
  ];

  return { faqs, faqHeaderLinks };
};

export default useLendFixedFaq;