import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { getScanInfo, reportFound, sendFinderMessage, getFinderMessages } from '../../lib/api';
import styles from './scan.module.css';

const CATEGORY_ICONS = {
  wallet: '👛', keys: '🗝️', bag: '🎒',
  laptop: '💻', phone: '📱', watch: '⌚', other: '📦'
};

export default function ScanPage() {
  const router = useRouter();
  const { code } = router.query;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('info'); // info | report | chat | done
  const [form, setForm] = useState({ finderMessage: '', finderContact: '' });
  const [submitting, setSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [itemId, setItemId] = useState(null);
  const [sessionId] = useState(() => 'finder_' + Math.random().toString(36).slice(2));
  const [location, setLocation] = useState({ lat: null, lng: null, address: '' });

  useEffect(() => {
    if (!code) return;
    getScanInfo(code)
      .then(({ data }) => {
        setItem(data.item);
        setItemId(data.item._id);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));

    // Try to get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation(l => ({ ...l, lat: pos.coords.latitude, lng: pos.coords.longitude })),
        () => {}
      );
    }
  }, [code]);

  // Poll messages once in chat step
  useEffect(() => {
    if (step !== 'chat' || !itemId) return;
    const fetchMsgs = () =>
      getFinderMessages(itemId)
        .then(({ data }) => setMessages(data.messages))
        .catch(() => {});
    fetchMsgs();
    const interval = setInterval(fetchMsgs, 5000);
    return () => clearInterval(interval);
  }, [step, itemId]);

  const handleReport = async (e) => {
    e.preventDefault();
    if (!form.finderMessage.trim()) return toast.error('Please write a message');
    setSubmitting(true);
    try {
      await reportFound(code, {
        finderMessage: form.finderMessage,
        finderContact: form.finderContact,
        lat: location.lat,
        lng: location.lng,
        address: location.address || 'Location not provided',
      });
      toast.success('Owner has been notified via WhatsApp!');
      setStep('chat');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to notify owner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      await sendFinderMessage(itemId, msgText, sessionId);
      setMsgText('');
      const { data } = await getFinderMessages(itemId);
      setMessages(data.messages);
    } catch {
      toast.error('Failed to send message');
    }
  };

  if (loading) return (
    <div className={styles.loadPage}>
      <div className={styles.loadSpinner} />
      <p>Loading item info...</p>
    </div>
  );

  if (!item) return (
    <div className={styles.errorPage}>
      <div className={styles.errorIcon}>❌</div>
      <h1>Item not found</h1>
      <p>This QR code is not registered or has been deactivated.</p>
      <a href="https://tagback.in" className={styles.btnHome}>Learn about TagBack</a>
    </div>
  );

  return (
    <>
      <Head>
        <title>Found: {item.name} — TagBack</title>
        <meta name="description" content={`Help return this lost item: ${item.name}`} />
      </Head>

      <div className={styles.page}>
        {/* Background */}
        <div className={styles.bg}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>

        <div className={styles.card}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoSmall}>⬡ TagBack</div>
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              Active item
            </div>
          </div>

          {/* Item info */}
          <div className={styles.itemHero} style={{ '--item-color': item.color || '#7c6fcd' }}>
            <div className={styles.itemIcon}>
              {CATEGORY_ICONS[item.category] || '📦'}
            </div>
            <div className={styles.itemInfo}>
              <h1 className={styles.itemName}>{item.name}</h1>
              {item.description && <p className={styles.itemDesc}>{item.description}</p>}
              <p className={styles.itemOwner}>Owned by <strong>{item.ownerName}</strong> from {item.ownerCity}</p>
            </div>
          </div>

          {/* Reward badge */}
          {item.rewardAmount > 0 && (
            <div className={styles.rewardBadge}>
              <span className={styles.rewardIcon}>🎁</span>
              <div>
                <p className={styles.rewardTitle}>₹{item.rewardAmount} reward offered</p>
                <p className={styles.rewardSub}>The owner is offering a cash reward for returning this item</p>
              </div>
            </div>
          )}

          {/* Privacy notice */}
          <div className={styles.privacyNotice}>
            <span>🔐</span>
            <p>Your contact details are <strong>never shared</strong> with the owner. All communication is anonymous.</p>
          </div>

          {/* Step: Report form */}
          {step === 'info' && (
            <div className={styles.stepSection}>
              <h2 className={styles.stepTitle}>You found this item!</h2>
              <p className={styles.stepSub}>Send a quick message to the owner — they'll be notified instantly on WhatsApp.</p>

              <form onSubmit={handleReport} className={styles.form}>
                <div className={styles.field}>
                  <label>Where did you find it?</label>
                  <textarea
                    placeholder='e.g. "Found near the entrance of DB Mall, Indore"'
                    rows={3}
                    value={form.finderMessage}
                    onChange={e => setForm({ ...form, finderMessage: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label>Your contact (optional — stays private)</label>
                  <input
                    placeholder="Phone or email — only shown to owner if you choose"
                    value={form.finderContact}
                    onChange={e => setForm({ ...form, finderContact: e.target.value })}
                  />
                </div>

                <div className={styles.locationRow}>
                  {location.lat ? (
                    <span className={styles.locationGood}>📍 Location captured automatically</span>
                  ) : (
                    <span className={styles.locationMiss}>📍 Location not available</span>
                  )}
                </div>

                <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                  {submitting
                    ? <span className={styles.spinner} />
                    : '📨 Notify the owner now'}
                </button>
              </form>
            </div>
          )}

          {/* Step: Chat with owner */}
          {step === 'chat' && (
            <div className={styles.stepSection}>
              <div className={styles.successBanner}>
                <span>✅</span>
                <div>
                  <p className={styles.successTitle}>Owner notified!</p>
                  <p className={styles.successSub}>They'll contact you soon. You can chat below.</p>
                </div>
              </div>

              <div className={styles.chatBox}>
                <div className={styles.chatMessages}>
                  {messages.length === 0 ? (
                    <div className={styles.chatEmpty}>
                      <p>💬 Waiting for the owner to reply...</p>
                      <p className={styles.chatEmptyHint}>Keep this page open. Messages appear here automatically.</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`${styles.msg} ${msg.sender === 'finder' ? styles.msgMe : styles.msgThem}`}>
                        <span className={styles.msgLabel}>{msg.sender === 'finder' ? 'You' : 'Owner'}</span>
                        <p className={styles.msgText}>{msg.text}</p>
                        <span className={styles.msgTime}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <form className={styles.chatForm} onSubmit={handleSendMessage}>
                  <input
                    placeholder="Type a message..."
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                  />
                  <button type="submit" className={styles.btnSend}>Send</button>
                </form>
              </div>
            </div>
          )}

          <p className={styles.poweredBy}>Powered by <a href="/">TagBack</a> — Smart Lost & Found for India</p>
        </div>
      </div>
    </>
  );
}
