import '@styles/globals.scss';
import '@styles/icons/all.min.css';

import type { AppProps } from 'next/app';
import { MDX } from '@/components/markdow/markdown';
import { App as AntdApp } from 'antd';
import { AppContext, defaultAppContext } from '@/context/app';
import { SetStateContextType, useSetStateContextValue } from '@/hooks/use-state-context';
import { UserConfigContext, defaultUserConfigContext } from '@/context/user-config';


export default function App({ Component, pageProps, router }: AppProps) {
  const type = Component.name === 'MDXContent' ? 'mdx' : 'tsx';
  const href = router.basePath + router.asPath;
  const appContextValue = useSetStateContextValue(defaultAppContext, {type: SetStateContextType.Set});
  const userConfigValue = useSetStateContextValue(defaultUserConfigContext, { type: SetStateContextType.LocalSet, filePath: 'config/user.json' });

  return <UserConfigContext.Provider value={userConfigValue}>
    <AppContext.Provider value={appContextValue}>
      <AntdApp>
        {type === 'mdx' &&
          <MDX style={{ minHeight: '100vh' }}>
            <Component {...{ href, ...pageProps }} />
          </MDX>
        }
        {type === 'tsx' && <Component {...{ href, ...pageProps }} />}
      </AntdApp>
    </AppContext.Provider>
  </UserConfigContext.Provider>;
}
