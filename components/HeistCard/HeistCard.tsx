import Link from "next/link";
import { Heist } from "@/types/firestore";
import { formatDeadline } from "@/lib/formatDeadline";
import styles from "./HeistCard.module.css";

interface HeistCardProps {
  heist: Heist;
}

export default function HeistCard({ heist }: HeistCardProps) {
  const deadline = formatDeadline(heist.deadline);

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <span
          className={`${styles.deadlineBadge} ${deadline.urgent ? styles.urgent : ""}`}
        >
          {deadline.label}
        </span>
      </div>

      {heist.description && (
        <p className={styles.description}>{heist.description}</p>
      )}

      <p className={styles.meta}>
        <span>🎭</span>
        <span>{heist.assignedToCodename}</span>
      </p>
    </article>
  );
}
