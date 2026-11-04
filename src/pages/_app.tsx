import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider>
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
