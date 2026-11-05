import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";
import type { NextPage } from "next";
import { type AppProps } from "next/app";
import { Schibsted_Grotesk } from "next/font/google";
import type { ReactElement, ReactNode } from "react";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
});

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // Force Clerk client to route Frontend API/UI through the app proxy (/__clerk),
    // otherwise on *.vercel.app it falls back to the unusable clerk.<domain> host.
    <ClerkProvider proxyUrl="/__clerk">
      <Head>
        <link rel="icon" href="/simple-pos-mark.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/simple-pos-mark.svg" />
        <link rel="apple-touch-icon" href="/simple-pos-mark.svg" />
        <meta name="theme-color" content="#171917" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className={`${schibsted.className} ${schibsted.variable}`}>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
