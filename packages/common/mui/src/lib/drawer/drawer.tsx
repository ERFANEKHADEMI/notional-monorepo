import React from 'react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { NotionalTheme } from '@notional-finance/styles';

export interface DrawerProps {
  children: React.ReactNode;
  size: 'large' | 'small';
}

const StyledDrawer = styled(Paper)(
  ({ theme }) => `
  height: 100%;
  background-color: ${theme.palette.background.paper};
  ${theme.breakpoints.down('md')} {
    display: flex;
    justify-content: center;
    width: 100%;

    &.MuiDrawer-paper, .MuiDrawer-paperAnchorRight, .MuiDrawer-docked {
      width: 100%;
      margin: 0 auto;
      position: static;

      border: ${theme.shape.borderStandard};
      border-radius: ${theme.shape.borderRadius()};
    }
  }
`
);

const SidebarContainer = styled('div')(
  ({ theme }) => `
  height: 100%;
  background-color: ${theme.palette.background.paper};
`
);

export function Drawer({ children, size }: DrawerProps) {
  const width = size === 'large' ? '543px' : '400px';
  const theme = useTheme() as NotionalTheme;

  return (
    <StyledDrawer
      sx={{
        width,
        padding: {
          xs: '30px 10px',
          sm: '30px 10px',
          md: '48px',
          lg: '48px',
          xl: '48px',
        },
      }}
    >
      <SidebarContainer theme={theme}>{children}</SidebarContainer>
    </StyledDrawer>
  );
}

export default Drawer;
