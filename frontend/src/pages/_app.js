import '../styles/globals.css';
import { AuthProvider } from '../lib/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e3f',
            color: '#f0f0ff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1e1e3f' } },
          error: { iconTheme: { primary: '#fb7185', secondary: '#1e1e3f' } },
        }}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
