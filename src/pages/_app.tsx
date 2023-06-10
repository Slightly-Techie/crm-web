import "@/app/globals.css";
import { Providers } from "@/app/providers";
import FONTS from "@/assets/fonts";
import Navbar from "@/components/layout/Navbar";
import type { AppProps } from "next/app";
import Head from "next/head";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"];
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: ComponentWithPageLayout) {
  return (
    <>
      <Head>
        <title>Slightly Techie Network</title>
        <meta name="title" content="Slightly Techie Network" />
        <meta name="description" content="Welcome to Slightly Techie Network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${FONTS.ttHoves.variable} ${FONTS.monalisa.variable}`}>
        <Providers>
          <main className="font-tt-hoves bg-st-bg dark:bg-black overflow-clip h-screen">
            <Navbar />
            <div className="overflow-y-scroll min-h-[720px] h-[calc(100vh-80px)]">
              <Component {...pageProps} />
            </div>
          </main>
        </Providers>
      </main>
    </>
  );
}
