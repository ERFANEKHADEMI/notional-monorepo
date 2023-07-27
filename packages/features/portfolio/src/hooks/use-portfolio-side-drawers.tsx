import { PORTFOLIO_ACTIONS } from '@notional-finance/shared-config';
import {
  useSideDrawerState,
  RemindMe,
  GetNotified,
} from '@notional-finance/side-drawer';
import {
  AddToCalendar,
  ConvertAsset,
  DepositCollateral,
  RollDebt,
  Withdraw,
} from '../side-drawers';
import { ManageVault } from '@notional-finance/trade';

export const usePortfolioSideDrawers = () => {
  const { sideDrawerOpen, currentSideDrawerKey } = useSideDrawerState();

  const drawers = {
    [PORTFOLIO_ACTIONS.REMIND_ME]: RemindMe,
    [PORTFOLIO_ACTIONS.DEPOSIT]: DepositCollateral,
    [PORTFOLIO_ACTIONS.WITHDRAW]: Withdraw,
    [PORTFOLIO_ACTIONS.CONVERT_ASSET]: ConvertAsset,
    [PORTFOLIO_ACTIONS.ROLL_DEBT]: RollDebt,
    [PORTFOLIO_ACTIONS.GET_NOTIFIED]: GetNotified,
    // TODO: deleverage might need to change
    [PORTFOLIO_ACTIONS.ADD_TO_CALENDAR]: AddToCalendar,
    [PORTFOLIO_ACTIONS.MANAGE_VAULT]: ManageVault,
  };

  const SideDrawerComponent =
    currentSideDrawerKey && drawers[currentSideDrawerKey]
      ? drawers[currentSideDrawerKey]
      : null;

  const openDrawer = SideDrawerComponent && sideDrawerOpen ? true : false;

  return { SideDrawerComponent, openDrawer };
};

export default usePortfolioSideDrawers;
