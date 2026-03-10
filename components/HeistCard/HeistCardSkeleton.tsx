import styles from "./HeistCardSkeleton.module.css";

export default function HeistCardSkeleton() {
  return (
    <article className={styles.card} aria-hidden="true">
      <div className={styles.header}>
        <div className={styles.titleBar} />
        <div className={styles.badgeBar} />
      </div>
      <div className={styles.descGroup}>
        <div className={styles.descBar1} />
        <div className={styles.descBar2} />
      </div>
      <div className={styles.metaBar} />
    </article>
  );
}
