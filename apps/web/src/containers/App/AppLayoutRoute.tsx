import { useEffect } from 'react';
import { CompatRoute } from 'react-router-dom-v5-compat';
import { ThemeProvider } from '@mui/material/styles';
import {
  FeatureLoader,
  Footer,
  TrackingConsent,
} from '@notional-finance/shared-web';
import {
  Header,
  MetaTagManager,
  metaTagData,
} from '@notional-finance/shared-web';
import {
  NotionalContext,
  useGlobalContext,
} from '@notional-finance/notionable-hooks';
import { WalletSelector } from '@notional-finance/wallet';
import { Box, CssBaseline, styled } from '@mui/material';
import { useNotionalTheme } from '@notional-finance/styles';
import { useIntercom } from 'react-use-intercom';
import { META_TAG_CATEGORIES, RouteType } from '@notional-finance/util';
import { useWalletConnectedNetwork } from '@notional-finance/notionable-hooks';
import { usePageTrack } from '@notional-finance/helpers';
import { useLocation } from 'react-router';

const AppLayoutRoute = ({
  component: Component,
  path,
  routeType,
  landingLayout,
}: {
  component: React.ElementType;
  path: string;
  routeType: RouteType;
  landingLayout?: boolean;
}) => {
  const globalState = useGlobalContext();
  const {
    global: { themeVariant },
  } = globalState;

  const location = useLocation();
  const { boot } = useIntercom();
  const selectedNetwork = useWalletConnectedNetwork();
  const notionalTheme = useNotionalTheme(themeVariant);
  usePageTrack(routeType, selectedNetwork);

  const slicedPath = path
    .match(/\/[^/]+/)?.[0]
    ?.slice(1) as META_TAG_CATEGORIES;

  useEffect(() => {
    if (!landingLayout) {
      boot();
    }
  }, [landingLayout, boot]);

  return (
    <ThemeProvider theme={notionalTheme}>
      <CssBaseline />
      <NotionalContext.Provider value={globalState}>
        <FeatureLoader>
          <TrackingConsent />
          <CompatRoute
            path={path}
            key={location.hash}
            render={(matchProps: Record<string, unknown>) => (
              <Box>
                {metaTagData[slicedPath] && (
                  <MetaTagManager metaTagCategory={slicedPath} />
                )}
                <AppShell>
                  <Header>
                    <WalletSelector />
                  </Header>

                  <MainContent>
                    <Component {...matchProps} />
                  </MainContent>
                  <Footer />
                </AppShell>
              </Box>
            )}
          />
        </FeatureLoader>
      </NotionalContext.Provider>
    </ThemeProvider>
  );
};

const AppShell = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`;

const MainContent = styled('div')`
  padding-top: 67px;
  display: flex;
  flex-grow: 1;
  & > div {
    height: 100%;
    width: 100%;
  }
`;

export default AppLayoutRoute;
