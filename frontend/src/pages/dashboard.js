import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { getItems, deleteItem } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import styles from './dashboard.module.css';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getItems()
        .then(({ data }) => setItems(data.items))
        .catch(() => toast.error('Failed to load items'))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this item and its QR code?')) return;
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const stats = {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    found: items.filter(i => i.status === 'found').length,
    returned: items.filter(i => i.status === 'returned').length,
    totalScans: items.reduce((sum, i) => sum + (i.scanHistory?.length || 0), 0),
  };

  if (loading || fetching) {
    return (
      <div className={styles.loadWrap}>
        <div className={styles.loader} />
      </div>
    );
  }

  return (
    <>
      <Head><title>Dashboard — TagBack</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.aurora}>
          <div className={styles.blob} />
        </div>

        <div className={styles.inner}>
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.greeting}>
                Hey, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className={styles.greetSub}>Here are all your tagged items</p>
            </div>
            <Link href="/items/new" className={styles.btnNew}>
              <span>+</span> Register Item
            </Link>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {[
              { label: 'Total items', value: stats.total, color: '#a78bfa' },
              { label: 'Active', value: stats.active, color: '#34d399' },
              { label: 'Found', value: stats.found, color: '#fbbf24' },
              { label: 'Returned', value: stats.returned, color: '#60a5fa' },
              { label: 'Total scans', value: stats.totalScans, color: '#fb7185' },
            ].map((s, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statVal} style={{ color: s.color }}>{s.value}</div>
                <div className={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Trust score */}
          <div className={styles.trustBanner}>
            <div className={styles.trustLeft}>
              <span className={styles.trustIcon}>⭐</span>
              <div>
                <p className={styles.trustTitle}>Trust Score: {user?.trustScore || 0}</p>
                <p className={styles.trustSub}>Return more items to increase your score and unlock badges</p>
              </div>
            </div>
            <div className={styles.trustBar}>
              <div className={styles.trustFill} style={{ width: `${Math.min((user?.trustScore || 0), 100)}%` }} />
            </div>
          </div>

          {/* Items grid */}
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🏷️</div>
              <h2>No items yet</h2>
              <p>Register your first item and get a QR tag to protect it</p>
              <Link href="/items/new" className={styles.btnNew}>Register your first item</Link>
            </div>
          ) : (
            <div className={styles.grid}>
              {items.map(item => (
                <ItemCard key={item._id} item={item} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
