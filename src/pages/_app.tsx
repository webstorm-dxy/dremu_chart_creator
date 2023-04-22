import '@styles/globals.css';
import '@styles/icons/all.min.css';

import type { AppProps } from 'next/app';
import NoSSR from '@/components/no-ssr/no-ssr';
import { MDX } from '@/components/markdow/markdown';
import { App as AntdApp } from 'antd';
import { useEffect, useState } from 'react';
import AppContext, { IAppContext, defaultAppContext } from '@/context/app';
import getMacAddress from '@/scripts/utils/get-macaddress';


export default function App({ Component, pageProps, router }: AppProps) {
  const type = Component.name === 'MDXContent' ? 'mdx' : 'tsx';
  const href = router.basePath + router.asPath;

  const [appContext, setAppContext] = useState<IAppContext>(defaultAppContext);

  useEffect(() => {
    setAppContext(prev => {
      prev.setAppContext = setAppContext;
      return prev;
    });

    function getMac(count: number = 0) {
      getMacAddress()
        .then(res => setAppContext(prev => {
          prev.macAddress = res;
          return prev;
        }))
        .catch(err => {
          console.error(err);
          if (count < 3) return setTimeout(() => getMac(count + 1), 1000);
          setAppContext(prev => {
            prev.macAddress = null;
            return prev;
          });
        });
    }

    getMac();
  }, []);

  return <NoSSR> {/* 关闭ssr */}
    <AppContext.Provider value={appContext}>
      <AntdApp>
        {type === 'mdx' &&
          <MDX style={{ minHeight: '100vh' }}>
            <Component {...{ href, ...pageProps }} />
          </MDX>
        }
        {type === 'tsx' && <Component {...{ href, ...pageProps }} />}
      </AntdApp>
    </AppContext.Provider>
  </NoSSR>;
}
