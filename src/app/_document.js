import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/images/brandimage.jpeg" />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}