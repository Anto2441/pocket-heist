"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "@/hooks/useUser";
import { db } from "@/lib/firebase";
import {
  CreateHeistInput,
  heistConverter,
  COLLECTIONS,
} from "@/types/firestore";
import styles from "@/components/AuthForm/AuthForm.module.css";

interface Agent {
  id: string;
  codename: string;
}

export default function CreateHeistPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToCodename, setAssignedToCodename] = useState("");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDocs(collection(db, "users")).then((snapshot) => {
      const agentList: Agent[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        codename: doc.data().codename as string,
      }));
      setAgents(agentList);
    });
  }, []);

  function handleAssignedToChange(uid: string) {
    setAssignedTo(uid);
    const agent = agents.find((a) => a.id === uid);
    setAssignedToCodename(agent?.codename ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: CreateHeistInput = {
        createdAt: serverTimestamp(),
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        title,
        description,
        createdBy: user!.uid,
        createdByCodename: user!.displayName ?? "",
        assignedTo,
        assignedToCodename,
        finalStatus: null,
      };

      await addDoc(
        collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter),
        payload,
      );

      router.push("/heists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="bg-lighter text-heading px-3 py-2 rounded-md border border-body/20 w-full resize-none"
          />

          <label htmlFor="assignedTo">Assign To</label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => handleAssignedToChange(e.target.value)}
            required
            className="bg-lighter text-heading px-3 py-2 rounded-md border border-body/20 w-full"
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.codename}
              </option>
            ))}
          </select>

          {error && (
            <p role="alert" className="text-error text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating…" : "Create Heist"}
          </button>

          <Link href="/heists" className={styles.switchLink}>
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}
