import { Code2, Globe, Mail } from "lucide-react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.inner}>
        <p className={styles.brand}>
          &copy; 2026 Pocket Heist &mdash; Plan your tiny missions
        </p>
        <div className={styles.icons}>
          <Link href="#" aria-label="GitHub" className={styles.iconLink}>
            <Code2 size={18} />
          </Link>
          <Link href="#" aria-label="Twitter" className={styles.iconLink}>
            <Globe size={18} />
          </Link>
          <Link href="#" aria-label="LinkedIn" className={styles.iconLink}>
            <Mail size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
