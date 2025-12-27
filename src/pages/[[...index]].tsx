import { SignIn, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

const FullscreenLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      <p className="text-muted-foreground text-sm">Redirecting...</p>
    </div>
  </div>
);

const RootRedirectPage = () => {
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
    if (!isLoaded || !isRootRoute) {
      return;
    }

    const target = isSignedIn ? "/dashboard" : "/sign-in";
    void router.replace(target);
  }, [isLoaded, isRootRoute, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignInRoute || !isSignedIn) {
      return;
    }

    void router.replace("/dashboard");
  }, [isLoaded, isSignInRoute, isSignedIn, router]);

  if (isRootRoute || !isLoaded) {
    return <FullscreenLoader />;
  }

  if (isSignInRoute && !isSignedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Head>
          <title>Sign In - Simple POS</title>
          <meta
            name="description"
            content="Sign in to your Simple POS account"
          />
        </Head>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    );
  }

  return <FullscreenLoader />;
};

export default RootRedirectPage;
