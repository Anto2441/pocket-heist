'use client';

import { Clock8 } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUser } from '@/hooks/useUser';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <div className={styles.actions}>
          {!loading && user && (
            <button className={styles.logoutButton} onClick={handleLogout}>
              Log Out
            </button>
          )}
          <Link href="/heists/create" className={styles.createButton}>
            Create Heist
          </Link>
        </div>
      </nav>
    </div>
  );
}
