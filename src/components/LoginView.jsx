import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Cpu, Users, ArrowRight } from 'lucide-react';

export default function LoginView() {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast('Welcome to MatteLab!', 'success');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast(err.message || 'Failed to sign in with Google.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-background-glow"></div>
      
      <div className="login-card-wrapper">
        <div className="login-glass-card">
          {/* Brand header */}
          <div className="login-brand-header">
            <div className="brand-logo-mark">
              <span className="logo-letter">M</span>
            </div>
            <div className="brand-badge-pill">
              <Sparkles size={12} className="text-accent" />
              <span>INNOVATION & MAKERSPACE</span>
            </div>
            <h1 className="login-brand-title">MatteLab</h1>
            <p className="login-brand-subtitle">College Of Engineering Trikaripur</p>
          </div>

          <div className="login-divider"></div>

          <div className="login-body">
            <p className="login-pitch">
              Your central workspace for workshops, hackathons, lab resources, and tech community projects.
            </p>

            <div className="login-features-grid">
              <div className="feature-item">
                <div className="feature-icon"><Cpu size={16} /></div>
                <div>
                  <h4>Hands-on Workshops</h4>
                  <p>IoT, Web, AI & Robotics bootcamps</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Users size={16} /></div>
                <div>
                  <h4>Community Driven</h4>
                  <p>TinkerHub · IEDC · Makers Guild</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="googleLoginBtn"
              className="google-signin-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-sm"></div>
              ) : (
                <svg className="google-svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span className="signin-text">
                {loading ? 'Authenticating...' : 'Continue with College Google Account'}
              </span>
              {!loading && <ArrowRight size={16} className="btn-arrow" />}
            </button>
          </div>

          <div className="login-footer-meta">
            <p>© {new Date().getFullYear()} MatteLab • College Of Engineering, Trikaripur</p>
            <p className="login-affiliates">Powered by TinkerHub & IEDC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
