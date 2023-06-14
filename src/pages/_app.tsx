import '@styles/globals.css';
import '@styles/icons/all.min.css';

import type { AppProps } from 'next/app';
import { MDX } from '@/components/markdow/markdown';
import { App as AntdApp } from 'antd';
import { useEffect, useState } from 'react';
import AppContext, { IAppContext, defaultAppContext } from '@/context/app';


export default function App({ Component, pageProps, router }: AppProps) {
  const type = Component.name === 'MDXContent' ? 'mdx' : 'tsx';
  const href = router.basePath + router.asPath;

  const [appContext, setAppContext] = useState<IAppContext>(defaultAppContext);

  useEffect(() => {
    setAppContext(prev => {
      prev.setAppContext = setAppContext;
      return prev;
    });
  }, []);

  return <AppContext.Provider value={appContext}>
    <AntdApp>
      {type === 'mdx' &&
        <MDX style={{ minHeight: '100vh' }}>
          <Component {...{ href, ...pageProps }} />
        </MDX>
      }
      {type === 'tsx' && <Component {...{ href, ...pageProps }} />}
    </AntdApp>
  </AppContext.Provider>;
}
