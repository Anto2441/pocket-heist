import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within AuthProvider");
  }
  return context;
}
