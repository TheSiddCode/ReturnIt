import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>Return<span>It</span></span>
        </Link>

        <div className={styles.links}>
          {user ? (
            <>
              <Link href="/dashboard" className={router.pathname === '/dashboard' ? styles.active : ''}>
                Dashboard
              </Link>
              <Link href="/items/new" className={styles.btnPrimary}>
                + Register Item
              </Link>
              <button onClick={handleLogout} className={styles.btnGhost}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={router.pathname === '/login' ? styles.active : ''}>
                Login
              </Link>
              <Link href="/register" className={styles.btnPrimary}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/items/new" onClick={() => setMenuOpen(false)}>+ Register Item</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
