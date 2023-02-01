import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-cn">
      <link rel="icon" type="image/png" href="/favicon.png"></link>
      <meta name="description" content="Chart Editor for Astaeus" />
      <meta name="author" content="Vestar Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
