import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Head>
        <title>Sign Up - Simple POS</title>
        <meta name="description" content="Sign up for your Simple POS account" />
      </Head>
      <SignUp path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
