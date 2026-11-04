import { SignIn, useUser } from "@clerk/nextjs";
import { LandingPage } from "@/components/landing/LandingPage";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

const FullscreenLoader = () => (
  <div className="bg-background grid min-h-screen place-items-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
      <p className="text-muted-foreground text-sm">Opening your workspace…</p>
    </div>
  </div>
);

const RootPage = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const segments = useMemo(() => {
    const value = router.query.index;
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [router.query.index]);

  const isRootRoute = segments.length === 0;
  const isSignInRoute = segments[0] === "sign-in";

  useEffect(() => {
    if (isLoaded && isSignInRoute && isSignedIn)
      void router.replace("/dashboard");
  }, [isLoaded, isSignInRoute, isSignedIn, router]);

  if (isRootRoute) return <LandingPage />;
  if (!isLoaded) return <FullscreenLoader />;

  if (isSignInRoute && !isSignedIn) {
    return (
      <main className="bg-grid grid min-h-screen place-items-center px-4">
        <Head>
          <title>Sign in — Simple POS</title>
        </Head>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    );
  }

  return <FullscreenLoader />;
};

export default RootPage;
