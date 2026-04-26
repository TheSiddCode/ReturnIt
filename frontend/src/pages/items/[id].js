import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { getMessages, sendOwnerMessage, markReturned } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import styles from './[id].module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/items/${params.id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return { notFound: true };
    const data = await res.json();
    return { props: { itemData: data.item } };
  } catch {
    return { notFound: true };
  }
}

const CAT_ICONS = { wallet:'👛', keys:'🗝️', bag:'🎒', laptop:'💻', phone:'📱', watch:'⌚', other:'📦' };
const STATUS_COLORS = { active:'#34d399', lost:'#fb7185', found:'#fbbf24', returned:'#a78bfa' };

export default function ItemDetail({ itemData }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState(itemData);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('qr');

  const scanUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/scan/${item?.uniqueCode}`;

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user && item) {
      getMessages(item._id)
        .then(({ data }) => setMessages(data.messages))
        .catch(() => {});
    }
  }, [user, item]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSending(true);
    try {
      const { data } = await sendOwnerMessage(item._id, msgText);
      setMessages(prev => [...prev, data.message]);
      setMsgText('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkReturned = async () => {
    if (!confirm('Mark this item as returned?')) return;
    try {
      await markReturned(item._id);
      setItem(prev => ({ ...prev, status: 'returned' }));
      toast.success('Item marked as returned! +5 trust score 🎉');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tagback-${item.name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !item) return <div className={styles.loading}><div className={styles.loader} /></div>;

  return (
    <>
      <Head><title>{item.name} — TagBack</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.blob} />
        <div className={styles.inner}>
          <button onClick={() => router.back()} className={styles.back}>← Back to dashboard</button>

          <div className={styles.topRow}>
            <div className={styles.itemInfo}>
              <span className={styles.itemIcon}>{CAT_ICONS[item.category]}</span>
              <div>
                <h1 className={styles.itemName}>{item.name}</h1>
                <p className={styles.itemDesc}>{item.description || 'No description'}</p>
              </div>
              <div className={styles.statusBadge} style={{ color: STATUS_COLORS[item.status], borderColor: STATUS_COLORS[item.status] + '40', background: STATUS_COLORS[item.status] + '10' }}>
                <span className={styles.statusDot} style={{ background: STATUS_COLORS[item.status] }} />
                {item.status}
              </div>
            </div>

            {item.status === 'found' && (
              <button onClick={handleMarkReturned} className={styles.btnReturned}>
                ✅ Mark as Returned
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {['qr', 'scans', 'chat'].map(t => (
              <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
                {t === 'qr' ? '⬡ QR Code' : t === 'scans' ? `📍 Scan History (${item.scanHistory?.length || 0})` : `💬 Chat (${messages.length})`}
              </button>
            ))}
          </div>

          {/* QR Tab */}
          {tab === 'qr' && (
            <div className={styles.qrSection}>
              <div className={styles.qrCard}>
                <div className={styles.qrWrap}>
                  <QRCodeSVG
                    id="qr-svg"
                    value={scanUrl}
                    size={220}
                    bgColor="transparent"
                    fgColor={item.color || '#a78bfa'}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className={styles.qrLabel}>{item.name}</p>
                <p className={styles.qrUrl}>{scanUrl}</p>
                <div className={styles.qrActions}>
                  <button onClick={downloadQR} className={styles.btnDownload}>⬇ Download QR</button>
                  <button onClick={() => { navigator.clipboard.writeText(scanUrl); toast.success('Link copied!'); }} className={styles.btnCopy}>
                    Copy link
                  </button>
                </div>
              </div>
              <div className={styles.qrTips}>
                <h3>How to use your QR code</h3>
                <div className={styles.tip}><span>1</span><p>Download the QR code as SVG</p></div>
                <div className={styles.tip}><span>2</span><p>Print it at home or a shop (any size works)</p></div>
                <div className={styles.tip}><span>3</span><p>Laminate it or use a sticker label</p></div>
                <div className={styles.tip}><span>4</span><p>Attach securely to your {item.category}</p></div>
                {item.rewardAmount > 0 && (
                  <div className={styles.rewardNote}>
                    💰 ₹{item.rewardAmount} reward is active for this item
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scan History Tab */}
          {tab === 'scans' && (
            <div className={styles.scansSection}>
              {item.scanHistory?.length === 0 ? (
                <div className={styles.empty}>
                  <p>📍 No scans yet — your QR hasn't been scanned</p>
                </div>
              ) : (
                <div className={styles.scanList}>
                  {[...item.scanHistory].reverse().map((scan, i) => (
                    <div key={i} className={styles.scanCard}>
                      <div className={styles.scanLeft}>
                        <div className={styles.scanNum}>#{item.scanHistory.length - i}</div>
                        <div>
                          <p className={styles.scanMsg}>"{scan.finderMessage}"</p>
                          <p className={styles.scanMeta}>
                            📍 {scan.location?.address || 'Location unknown'} &nbsp;·&nbsp;
                            {new Date(scan.scannedAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {tab === 'chat' && (
            <div className={styles.chatSection}>
              <div className={styles.chatMessages}>
                {messages.length === 0 ? (
                  <div className={styles.empty}><p>💬 No messages yet</p></div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`${styles.msg} ${msg.sender === 'owner' ? styles.msgOwner : styles.msgFinder}`}>
                      <span className={styles.msgSender}>{msg.sender === 'owner' ? 'You' : 'Finder'}</span>
                      <p className={styles.msgText}>{msg.text}</p>
                      <span className={styles.msgTime}>{new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className={styles.chatForm}>
                <input
                  placeholder="Type a message to the finder..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
                <button type="submit" className={styles.btnSend} disabled={sending}>
                  {sending ? '...' : 'Send →'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
