import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from './index.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>ReturnIt — Smart Lost & Found Network</title>
        <meta name="description" content="Never lose your valuables again. QR-powered lost & found for India." />
      </Head>

      <Navbar />

      <main className={styles.main}>
        {/* Aurora background */}
        <div className={styles.aurora}>
          <div className={styles.auroraBlob1} />
          <div className={styles.auroraBlob2} />
          <div className={styles.auroraBlob3} />
        </div>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Now live in Indore & Bhopal
            </div>

            <h1 className={styles.heroTitle}>
              Lost something?<br />
              <span className={styles.gradient}>Get it back.</span>
            </h1>

            <p className={styles.heroSub}>
              Stick a smart QR tag on your valuables. If lost,
              any stranger can scan and notify you instantly —
              no app needed, fully anonymous.
            </p>

            <div className={styles.heroCta}>
              <Link href="/register" className={styles.btnBig}>
                Start for free
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/register" className={styles.btnBigGhost}>
                See how it works
              </Link>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}><span className={styles.statNum}>2,400+</span><span className={styles.statLabel}>Items registered</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>94%</span><span className={styles.statLabel}>Return rate</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>₹0</span><span className={styles.statLabel}>To get started</span></div>
            </div>
          </div>

          {/* Hero visual */}
          <div className={styles.heroVisual}>
            <div className={styles.phone}>
              <div className={styles.phoneScreen}>
                <div className={styles.scanAnimation}>
                  <div className={styles.qrMock}>
                    <div className={styles.qrGrid}>
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div key={i} className={styles.qrCell}
                          style={{ background: Math.random() > 0.4 ? 'var(--accent2)' : 'transparent' }} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.scanLine} />
                </div>
                <div className={styles.phoneNotif}>
                  <span className={styles.notifIcon}>🏷️</span>
                  <div>
                    <p className={styles.notifTitle}>Item Found!</p>
                    <p className={styles.notifSub}>Your wallet near DB Mall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={styles.howSection}>
          <div className="container">
            <p className={styles.sectionLabel}>How it works</p>
            <h2 className={styles.sectionTitle}>Four steps to recovery</h2>

            <div className={styles.steps}>
              {[
                { num: '01', icon: '📱', title: 'Register your item', desc: 'Add any valuable in the app and get a unique QR code instantly.' },
                { num: '02', icon: '🏷️', title: 'Stick the tag', desc: 'Print or order our premium sticker. Attach it to your item.' },
                { num: '03', icon: '🔍', title: 'Finder scans it', desc: 'Anyone with a smartphone can scan — no app download needed.' },
                { num: '04', icon: '🎉', title: 'Get it back', desc: 'You get an instant WhatsApp alert with location. Offer a reward.' },
              ].map((step, i) => (
                <div key={i} className={styles.step}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.featSection}>
          <div className="container">
            <p className={styles.sectionLabel}>Why TagBack</p>
            <h2 className={styles.sectionTitle}>Built for India</h2>

            <div className={styles.featGrid}>
              {[
                { icon: '🔐', color: '#a78bfa', title: 'Complete privacy', desc: "Your phone number is never shown to the finder. All communication is anonymous and secure." },
                { icon: '⚡', color: '#34d399', title: 'Instant WhatsApp alert', desc: "Get notified on WhatsApp the moment your QR is scanned — wherever you are." },
                { icon: '💰', color: '#fbbf24', title: 'Reward system', desc: "Offer ₹100–₹1000 as a reward. Incentivised finders return items 4x faster." },
                { icon: '📍', color: '#fb7185', title: 'Location capture', desc: "Scan automatically records GPS location. Know exactly where your item was found." },
                { icon: '⭐', color: '#60a5fa', title: 'Trust scores', desc: "Finders build reputation. High-trust users get priority notifications and badges." },
                { icon: '🏙️', color: '#2dd4bf', title: 'City heatmap', desc: "See hotspots where items are lost most in your city. Plan accordingly." },
              ].map((f, i) => (
                <div key={i} className={styles.featCard}>
                  <div className={styles.featIcon} style={{ '--feat-color': f.color }}>{f.icon}</div>
                  <h3 className={styles.featTitle}>{f.title}</h3>
                  <p className={styles.featDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Start protecting your valuables today</h2>
            <p className={styles.ctaSub}>Free forever for 3 items. Premium from ₹199/year.</p>
            <Link href="/register" className={styles.btnBig}>
              Create free account →
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>© 2024 ReturnIt. Made with ♥ in Indore, India.</p>
        </footer>
      </main>
    </>
  );
}
