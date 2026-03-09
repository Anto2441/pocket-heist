"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Spinner from "@/components/Spinner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/heists");
    }
  }, [loading, user, router]);

  if (loading || user) return <Spinner />;

  return <main className="public">{children}</main>;
}
