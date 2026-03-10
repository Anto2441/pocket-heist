import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Heist, heistConverter, COLLECTIONS } from "@/types/firestore";
import { useUser } from "@/hooks/useUser";

export type HeistMode = "active" | "assigned" | "expired";

export function useHeists(mode: HeistMode): {
  heists: Heist[];
  loading: boolean;
} {
  const { user } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loadingInternal, setLoading] = useState(true);
  const loading = user ? loadingInternal : false;

  useEffect(() => {
    if (!user) {
      return;
    }

    const now = Timestamp.now();
    const collectionRef = collection(db, COLLECTIONS.HEISTS).withConverter(
      heistConverter,
    );

    let q;
    if (mode === "active") {
      q = query(
        collectionRef,
        where("assignedTo", "==", user.uid),
        where("deadline", ">", now),
      );
    } else if (mode === "assigned") {
      q = query(
        collectionRef,
        where("createdBy", "==", user.uid),
        where("deadline", ">", now),
      );
    } else {
      q = query(collectionRef, where("deadline", "<=", now));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHeists(snapshot.docs.map((doc) => doc.data() as Heist));
      setLoading(false);
    });

    return unsubscribe;
  }, [mode, user]);

  return { heists, loading };
}
