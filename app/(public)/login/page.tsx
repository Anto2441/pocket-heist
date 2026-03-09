"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthForm from "@/components/AuthForm";

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleLogin(email: string, password: string) {
    setError(null);
    setSuccess(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(mapFirebaseError(code));
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <AuthForm
          title="Log in to Your Account"
          headingLevel="h1"
          buttonLabel="Log In"
          linkText="Don't have an account? Sign up"
          linkHref="/signup"
          onSubmit={handleLogin}
          error={error}
          success={success ? "Login successful" : null}
        />
      </div>
    </div>
  );
}
