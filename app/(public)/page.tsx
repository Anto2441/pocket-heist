// this page should be used only as a splash page to decide where a user should be navigated to
// when logged in --> to /heists
// when not logged in --> to /login

import { Clock8 } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.splash}>
      <div className={styles.bg} />
      <div className={styles.grid} />
      <div className={styles.scanlines} />

      <div className={styles.content}>
        <div className={styles.badge}>Mission briefing</div>

        <h1 className={styles.title}>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>

        <p className={styles.tagline}>Tiny missions. Big office mischief.</p>

        <div className={styles.divider} />

        <p className={styles.description}>
          Welcome to Pocket Heist — the game where your office becomes the
          ultimate playground. Pull off sneaky micro-missions, outsmart your
          colleagues, and climb the leaderboard one mischievous task at a time.
          No heist is too small. No office is safe.
        </p>

        <div className={styles.actions}>
          <Link href="/signup" className={styles.registerBtn}>
            Start your first mission
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Already an agent? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
