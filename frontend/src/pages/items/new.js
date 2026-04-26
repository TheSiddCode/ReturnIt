import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { createItem } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import styles from './new.module.css';

const CATEGORIES = [
  { id: 'wallet', label: 'Wallet', icon: '👛' },
  { id: 'keys', label: 'Keys', icon: '🗝️' },
  { id: 'bag', label: 'Bag', icon: '🎒' },
  { id: 'laptop', label: 'Laptop', icon: '💻' },
  { id: 'phone', label: 'Phone', icon: '📱' },
  { id: 'watch', label: 'Watch', icon: '⌚' },
  { id: 'other', label: 'Other', icon: '📦' },
];

const COLORS = ['#7c6fcd', '#2dd4bf', '#fb7185', '#fbbf24', '#34d399', '#60a5fa', '#f472b6'];

export default function NewItem() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', description: '', category: 'wallet', rewardAmount: 0, color: '#7c6fcd'
  });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (!user) { router.push('/login'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Item name is required');
    setSubmitting(true);
    try {
      const { data } = await createItem(form);
      toast.success('Item registered! Your QR code is ready 🎉');
      router.push(`/items/${data.item._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Register Item — TagBack</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.blob} />

        <div className={styles.inner}>
          <div className={styles.header}>
            <button onClick={() => router.back()} className={styles.back}>← Back</button>
            <h1 className={styles.title}>Register new item</h1>
            <p className={styles.sub}>Add your valuable and get a QR code to protect it</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Category picker */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Category</label>
              <div className={styles.catGrid}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${styles.catBtn} ${form.category === cat.id ? styles.catActive : ''}`}
                    onClick={() => setForm({ ...form, category: cat.id })}
                  >
                    <span className={styles.catIcon}>{cat.icon}</span>
                    <span className={styles.catLabel}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item name */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Item name</label>
              <input
                placeholder="e.g. My black leather wallet"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Description (optional)</label>
              <textarea
                placeholder="Any identifying details — color, brand, contents..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Reward */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Reward amount (₹)</label>
              <input
                type="number"
                min={0}
                max={10000}
                placeholder="0 = no reward offered"
                value={form.rewardAmount}
                onChange={e => setForm({ ...form, rewardAmount: Number(e.target.value) })}
              />
              <p className={styles.hint}>💡 Items with rewards are returned 4x faster</p>
            </div>

            {/* Color tag */}
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Tag color</label>
              <div className={styles.colorRow}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.colorDot} ${form.color === c ? styles.colorActive : ''}`}
                    style={{ background: c }}
                    onClick={() => setForm({ ...form, color: c })}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className={styles.preview} style={{ '--item-color': form.color }}>
              <div className={styles.previewLeft}>
                <div className={styles.previewIcon}>
                  {CATEGORIES.find(c => c.id === form.category)?.icon || '📦'}
                </div>
                <div>
                  <p className={styles.previewName}>{form.name || 'Your item name'}</p>
                  <p className={styles.previewDesc}>{form.description || 'Item description'}</p>
                </div>
              </div>
              {form.rewardAmount > 0 && (
                <span className={styles.previewReward}>₹{form.rewardAmount} reward</span>
              )}
            </div>

            <button type="submit" className={styles.btnSubmit} disabled={submitting}>
              {submitting
                ? <><span className={styles.spinner} /> Generating QR...</>
                : 'Register & Generate QR Code ⬡'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
