import "../styles/global.sass"
import type { AppProps } from "next/app"
import Head from "next/head"
import Layout from "../components/layout"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>BB NextJS Sales Example</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
