import Link from 'next/link';
import styles from './ItemCard.module.css';

const CATEGORY_ICONS = {
  wallet: '👛', keys: '🗝️', bag: '🎒',
  laptop: '💻', phone: '📱', watch: '⌚', other: '📦'
};

const STATUS_COLORS = {
  active: '#34d399', lost: '#fb7185',
  found: '#fbbf24', returned: '#a78bfa'
};

export default function ItemCard({ item, onDelete }) {
  const icon = CATEGORY_ICONS[item.category] || '📦';
  const statusColor = STATUS_COLORS[item.status] || '#9090b0';

  return (
    <div className={styles.card} style={{ '--accent-color': item.color || '#7c6fcd' }}>
      <div className={styles.top}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.info}>
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.desc}>{item.description || 'No description'}</p>
        </div>
        <div className={styles.status} style={{ color: statusColor }}>
          <span className={styles.dot} style={{ background: statusColor }} />
          {item.status}
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.category}>{item.category}</span>
        {item.rewardAmount > 0 && (
          <span className={styles.reward}>₹{item.rewardAmount} reward</span>
        )}
        <span className={styles.scans}>{item.scanHistory?.length || 0} scans</span>
      </div>

      <div className={styles.actions}>
        <Link href={`/items/${item._id}`} className={styles.btnView}>
          View QR & Details
        </Link>
        <button onClick={() => onDelete(item._id)} className={styles.btnDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
