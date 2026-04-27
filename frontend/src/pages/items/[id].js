import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { getItems, getMessages, sendOwnerMessage, markReturned } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import Navbar from '../../components/Navbar';
import styles from './[id].module.css';

const CAT_ICONS = { wallet:'👛', keys:'🗝️', bag:'🎒', laptop:'💻', phone:'📱', watch:'⌚', other:'📦' };
const STATUS_COLORS = { active:'#34d399', lost:'#fb7185', found:'#fbbf24', returned:'#a78bfa' };

export default function ItemDetail() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [item, setItem] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('qr');

  const scanUrl = typeof window !== 'undefined' && item
    ? `${window.location.origin}/scan/${item.uniqueCode}`
    : '';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (!user || !id) return;
    // Fetch all items and find this one (uses auth token)
    getItems()
      .then(({ data }) => {
        const found = data.items.find(i => i._id === id);
        if (!found) { toast.error('Item not found'); router.push('/dashboard'); return; }
        setItem(found);
      })
      .catch(() => { toast.error('Failed to load item'); router.push('/dashboard'); })
      .finally(() => setPageLoading(false));
  }, [user, id]);

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

  if (loading || pageLoading) return (
    <div className={styles.loadWrap}><div className={styles.loader} /></div>
  );

  if (!item) return null;

  return (
    <>
      <Head><title>{item.name} — TagBack</title></Head>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.aurora}><div className={styles.blob} /></div>
        <div className={styles.inner}>
          <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>← Back to dashboard</button>

          <div className={styles.topRow}>
            <div className={styles.titleArea}>
              <div className={styles.itemIcon}>{CAT_ICONS[item.category] || '📦'}</div>
              <div>
                <h1 className={styles.itemName}>{item.name}</h1>
                <p className={styles.itemCategory}>{item.category}</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap' }}>
              <div className={styles.statusBadge} style={{ color: STATUS_COLORS[item.status], borderColor: STATUS_COLORS[item.status] + '40', background: STATUS_COLORS[item.status] + '10', border:'1px solid', padding:'5px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background: STATUS_COLORS[item.status], display:'inline-block' }} />
                {item.status}
              </div>
              {item.status === 'found' && (
                <button onClick={handleMarkReturned} className={styles.btnMarkReturned}>✅ Mark as Returned</button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'4px', marginBottom:'24px', borderBottom:'1px solid rgba(255,255,255,0.07)', paddingBottom:'0' }}>
            {[
              { key:'qr', label:'⬡ QR Code' },
              { key:'scans', label:`📍 Scan History (${item.scanHistory?.length || 0})` },
              { key:'chat', label:`💬 Chat (${messages.length})` }
            ].map(t => (
              <button key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding:'10px 18px', background:'none', border:'none',
                  borderBottom: tab === t.key ? '2px solid #a78bfa' : '2px solid transparent',
                  color: tab === t.key ? '#f0f0ff' : '#5a5a7a',
                  fontSize:'14px', fontWeight: tab === t.key ? 600 : 400,
                  cursor:'pointer', transition:'all 0.2s', marginBottom:'-1px'
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* QR Tab */}
          {tab === 'qr' && (
            <div className={styles.grid}>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Your QR Code</p>
                <div className={styles.qrWrap}>
                  <div style={{ background:'white', padding:'20px', borderRadius:'16px', display:'inline-block' }}>
                    <QRCodeSVG id="qr-svg" value={scanUrl || 'https://tagback.in'} size={180} bgColor="#ffffff" fgColor={item.color || '#7c6fcd'} level="H" includeMargin={false} />
                  </div>
                  <p className={styles.qrCode}>{item.uniqueCode}</p>
                  <p style={{ fontSize:'12px', color:'#5a5a7a', wordBreak:'break-all', textAlign:'center', maxWidth:'260px' }}>{scanUrl}</p>
                  <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                    <button onClick={downloadQR} className={styles.btnDownload}>⬇ Download SVG</button>
                    <button onClick={() => { navigator.clipboard.writeText(scanUrl); toast.success('Link copied!'); }} className={styles.btnDownload}>Copy link</button>
                  </div>
                </div>
              </div>
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Item Details</p>
                <div className={styles.detailsList}>
                  {[
                    { label:'Name', value: item.name },
                    { label:'Category', value: item.category },
                    { label:'Description', value: item.description || '—' },
                    { label:'Reward', value: item.rewardAmount > 0 ? `₹${item.rewardAmount}` : 'No reward set' },
                    { label:'Registered', value: new Date(item.createdAt).toLocaleDateString('en-IN') },
                  ].map(d => (
                    <div key={d.label} className={styles.detailItem}>
                      <span className={styles.detailLabel}>{d.label}</span>
                      <span className={styles.detailValue}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Scan History Tab */}
          {tab === 'scans' && (
            <div className={styles.section}>
              <p className={styles.sectionTitle}>Scan History</p>
              {!item.scanHistory?.length ? (
                <p className={styles.noScans}>📍 No scans yet — attach the QR to your item and wait for someone to find it</p>
              ) : (
                <div className={styles.scanList}>
                  {[...item.scanHistory].reverse().map((scan, i) => (
                    <div key={i} className={styles.scanItem}>
                      <div className={styles.scanMeta}>
                        <span>#{item.scanHistory.length - i}</span>
                        <span>{new Date(scan.scannedAt).toLocaleString('en-IN')}</span>
                      </div>
                      <p className={styles.scanMsg}>"{scan.finderMessage}"</p>
                      <p style={{ fontSize:'12px', color:'#5a5a7a', marginTop:'4px' }}>
                        📍 {scan.location?.address || 'Location unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {tab === 'chat' && (
            <div className={styles.section} style={{ gridColumn:'1/-1' }}>
              <p className={styles.sectionTitle}>Anonymous Chat with Finder</p>
              <div className={styles.chatBox}>
                <div className={styles.chatMessages}>
                  {messages.length === 0 ? (
                    <div className={styles.empty}>💬 No messages yet — they'll appear here when a finder contacts you</div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`${styles.msg} ${msg.sender === 'owner' ? styles.msgOwner : styles.msgFinder}`}>
                        <span className={styles.msgSender}>{msg.sender === 'owner' ? 'You' : 'Finder'}</span>
                        <p className={styles.msgText}>{msg.text}</p>
                        <span className={styles.msgTime}>{new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}</span>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className={styles.chatForm}>
                  <input placeholder="Type a message to the finder..." value={msgText} onChange={e => setMsgText(e.target.value)} />
                  <button type="submit" className={styles.btnSend} disabled={sending}>{sending ? '...' : 'Send →'}</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
