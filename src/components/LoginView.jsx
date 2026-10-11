import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Cpu, Users, Sparkles } from 'lucide-react';
import Header from './Header';
import GoonsHero from './GoonsHero';
import mattelabLogo from '../assets/mattelab.png';

export default function LoginView() {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('about');

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      showToast('Welcome to MatteLab Workspace!', 'success');
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
    <div className="min-h-screen flex flex-col bg-[#f7f4ee] text-slate-900">
      {/* Modern Floating Island Header with MatteLab Logo */}
      <Header
        brand="MATTELAB"
        subtitle="CET Makerspace"
        items={[
          { id: 'about', label: 'ABOUT' },
          { id: 'workshops', label: 'WORKSHOPS' },
          { id: 'makerspace', label: 'MAKERSPACE' },
          { id: 'community', label: 'COMMUNITY' }
        ]}
        activeItem={activeNav}
        onSelect={setActiveNav}
        ctaText="Sign In"
        onCtaClick={handleLogin}
        language="EN"
        onLanguageToggle={() => showToast('Language: English / Malayalam', 'info')}
        isOverlay={false}
      />

      {/* Hero with Terracotta 3D Geometric Sculpture */}
      <GoonsHero
        ctaText={loading ? "Authenticating..." : "Enter Workspace"}
        onCtaClick={handleLogin}
        onExploreEvents={() => {
          const el = document.getElementById('login-action-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onExploreResources={() => {
          const el = document.getElementById('login-action-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* College Sign-In Callout */}
      <section id="login-action-section" className="w-full py-16 px-6 bg-[#ebe6db] border-t border-slate-300/80 flex justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200/90 text-center">
          {/* Official MatteLab Brand Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#fbf9f5] rounded-2xl px-5 py-3 border border-[#c26e47]/30 shadow-sm">
              <img
                src={mattelabLogo}
                alt="MatteLab"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-950 tracking-tight">Access MatteLab</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Sign in with your College of Engineering Trikaripur Google account to reserve 3D printers and register for workshops.
          </p>

          <button
            type="button"
            id="googleLoginBtn"
            className="mt-6 w-full py-3.5 px-5 rounded-full bg-gradient-to-r from-[#c26e47] to-[#d97736] hover:from-[#b05f3b] hover:to-[#c6682b] text-white font-semibold text-sm shadow-md hover:shadow-lg shadow-[#c26e47]/30 transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="google-svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>{loading ? 'Authenticating...' : 'Continue with College Google Account'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="mt-5 text-[11px] text-slate-500">
            Powered by TinkerHub & IEDC · College of Engineering Trikaripur
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-[#ebe6db] border-t border-slate-300 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} MatteLab · Innovation & Prototyping Laboratory · CET</p>
      </footer>
    </div>
  );
}
