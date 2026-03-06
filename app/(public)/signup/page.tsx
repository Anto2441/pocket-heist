"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateCodename } from "@/lib/utils/generateCodename";
import AuthForm from "@/components/AuthForm";

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(email: string, password: string) {
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const codename = generateCodename();
      await updateProfile(user, { displayName: codename });
      await setDoc(doc(db, "users", user.uid), { id: user.uid, codename });
      router.push("/heists");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      setError(mapFirebaseError(code));
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <AuthForm
          title="Signup for an Account"
          headingLevel="h2"
          buttonLabel="Sign Up"
          linkText="Already have an account? Log in"
          linkHref="/login"
          onSubmit={handleSignup}
          error={error}
        />
      </div>
    </div>
  );
}
