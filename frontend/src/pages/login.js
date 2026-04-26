import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { login } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import styles from './auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login — TagBack</title></Head>
      <div className={styles.page}>
        <div className={styles.aurora}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>

        <div className={styles.card}>
          <Link href="/" className={styles.logo}>⬡ TagBack</Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to manage your tagged items</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Sign in'}
            </button>
          </form>

          <p className={styles.switch}>
            Don't have an account? <Link href="/register">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  );
}
