import { useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Head from "next/head";
import Link from "next/link";

import { SimplePosMark } from "@/components/brand/SimplePosMark";
import {
  FaqList,
  FeatureRail,
  PosHeroPreview,
  Reveal,
  StackOrbit,
} from "@/components/landing/AnimatedLanding";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const reduced = useReducedMotion();
  const appHref = isSignedIn ? "/dashboard" : "/sign-in";
  const appLabel = isLoaded && isSignedIn ? "Open app" : "Sign in";

  return (
    <>
      <Head>
        <title>KasirPos — Point of sale, without the noise</title>
        <meta
          name="description"
          content="A portfolio point-of-sale application for ordering, catalog management, QRIS payments, and sales tracking."
        />
      </Head>
      <div className="landing-page bg-background text-foreground min-h-svh overflow-hidden">
        <header className="border-border/70 bg-background/90 sticky top-0 z-50 border-b backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-360 items-center justify-between px-5 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold tracking-[-0.03em]"
            >
              <SimplePosMark className="text-foreground" />
              Kasir POS
            </Link>
            <nav
              className="hidden items-center gap-8 text-sm font-medium md:flex"
              aria-label="Primary navigation"
            >
              <a
                href="#product"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Product
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#stack"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Stack
              </a>
              <a
                href="#faq"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href={appHref}
                className="bg-foreground text-background inline-flex h-10 items-center gap-2 rounded-sm px-4 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                {appLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </header>

        <main className="landing-grid">
          <section className="grid-section relative mx-auto min-h-[calc(100svh-5rem)] max-w-360 px-4 py-16 sm:px-2 lg:pt-20">
            <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 lg:gap-14 px-4 lg:px-16">
              <div className="max-w-xl">
                <motion.h1
                  initial={reduced ? false : { opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[clamp(3.4rem,7vw,7rem)] leading-[.88] font-extrabold tracking-[-.065em] text-balance"
                >
                  Sell clearly.
                  <br />
                  Move quickly.
                </motion.h1>
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="text-muted-foreground mt-8 max-w-[45ch] text-lg leading-relaxed sm:text-xl"
                >
                  A focused point-of-sale workspace for taking orders, managing
                  a catalog, accepting QRIS payments, and reading the day.
                </motion.p>
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.27 }}
                  className="mt-9 flex flex-wrap items-center gap-5"
                >
                  <Link
                    href={appHref}
                    className="bg-primary text-primary-foreground inline-flex h-12 items-center gap-2 rounded-sm px-5 font-semibold transition-transform hover:-translate-y-1"
                  >
                    {appLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href="#product"
                    className="font-semibold underline decoration-2 underline-offset-8"
                  >
                    See the product
                  </a>
                </motion.div>
              </div>
              <PosHeroPreview />
            </div>
          </section>

          <section
            id="product"
            className="grid-section bg-foreground text-background px-5 py-24 sm:px-8 lg:py-36 mt-24"
          >
            <div className="mx-auto grid max-w-[1376px] gap-12 lg:grid-cols-[.72fr_1.28fr] lg:px-16 px-4">
              <Reveal>
                <h2 className="text-4xl leading-none font-extrabold tracking-[-.05em] sm:text-6xl">
                  The counter,
                  <br />
                  kept in order
                </h2>
              </Reveal>
              <div className="grid gap-10 sm:grid-cols-2">
                <Reveal delay={0.08}>
                  <p className="text-background/75 text-xl leading-relaxed">
                    The menu, categories, search, and cart stay in one working
                    view. Fewer detours mean faster service.
                  </p>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="text-background/75 text-xl leading-relaxed">
                    The same catalog powers product management, checkout, and
                    sales history, connecting every item to its payment.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="grid-section px-5 py-24 sm:px-8 lg:py-36"
          >
            <div className="mx-auto max-w-[1376px] lg:px-16 px-4">
              <Reveal className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <h2 className="text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">
                  Built around the sale
                </h2>
                <p className="text-muted-foreground max-w-md text-lg">
                  Four connected parts of the same daily workflow, from the
                  first tap to the final status.
                </p>
              </Reveal>
              <FeatureRail />
            </div>
          </section>

          <section
            id="stack"
            className="bg-[#171917] px-5 py-24 text-[#f4f1e8] sm:px-8 lg:py-32"
          >
            <div className="mx-auto grid max-w-[1376px] gap-12 lg:grid-cols-[.78fr_1.22fr] lg:px-16 px-4">
              <Reveal>
                <h2 className="text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">
                  A working
                  <br />
                  full-stack build
                </h2>
                <p className="mt-7 max-w-md text-lg leading-relaxed text-[#f4f1e8]/62">
                  Authenticated operations, typed APIs, relational data, media
                  storage, and payment integration.
                </p>
              </Reveal>
              <StackOrbit />
            </div>
          </section>

          <section
            id="faq"
            className="grid-section px-5 py-24 sm:px-8 lg:py-36"
          >
            <div className="mx-auto grid max-w-[1376px] gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-start lg:px-16 px:4">
              <Reveal>
                <h2 className="text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">
                  Questions,
                  <br />
                  answered
                </h2>
                <p className="text-muted-foreground mt-6 max-w-sm text-lg leading-relaxed">
                  See how the portfolio build works, then open the application
                  to explore it directly.
                </p>
                <Link
                  href={appHref}
                  className="bg-foreground text-background mt-8 inline-flex h-12 items-center gap-2 rounded-sm px-5 font-semibold"
                >
                  {appLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Reveal>
              <Reveal
                delay={0.1}
                className="bg-card ring-border rounded-2xl p-3 ring-1 sm:p-5"
              >
                <FaqList />
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="grid-section bg-foreground text-background px-5 py-12 sm:px-8">
          <div className="mx-auto flex max-w-[1376px] flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-4xl font-extrabold tracking-[-.05em]">
                Simple POS
              </p>
              <p className="text-background/60 mt-3">
                Designed and built as a portfolio project.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#product">Product</a>
              <a href="#features">Features</a>
              <a href="#stack">Stack</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
