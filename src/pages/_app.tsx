import '@styles/globals.css';
import '@styles/icons/all.min.css';

import type { AppProps } from 'next/app';
import NoSSR from '@/components/no-ssr/no-ssr';
import { MDX } from '@/components/markdow/markdown';
import { App as AntdApp } from 'antd';

export default function App({ Component, pageProps, router }: AppProps) {
  const type = Component.name === 'MDXContent' ? 'mdx' : 'tsx';
  const href = router.basePath + router.asPath;

  return <NoSSR> {/* 关闭ssr */}
    <AntdApp>
      {type === 'mdx' &&
        <MDX style={{ minHeight: '100vh' }}>
          <Component {...{ href, ...pageProps }} />
        </MDX>
      }
      {type === 'tsx' && <Component {...{ href, ...pageProps }} />}
    </AntdApp>
  </NoSSR>;
}
