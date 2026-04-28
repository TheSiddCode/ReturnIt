import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { register } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import styles from './auth.module.css';

const CITIES = ['Indore', 'Bhopal', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Other'];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', city: 'Indore' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length < 10) return toast.error('Enter valid 10-digit phone number');
    setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data.user, data.token);
      toast.success('Account created! Welcome to ReturnIt 🎉'); // ✅ updated
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ UPDATED TITLE */}
      <Head>
        <title>Create Account — ReturnIt</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.aurora}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>

        <div className={styles.card}>
          {/* ✅ UPDATED LOGO */}
          <Link href="/" className={styles.logo}>
            ⬡ ReturnIt
          </Link>

          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.sub}>Free forever for up to 3 items</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Full name</label>
              <input
                placeholder="Rahul Sharma"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Phone number</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>City</label>
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                minLength={8}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Create free account'}
            </button>
          </form>

          <p className={styles.switch}>
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}