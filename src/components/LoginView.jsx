import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Cpu, Users, Sparkles } from 'lucide-react';
import Header from './Header';
import MatteLabHero from './MatteLabHero';
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
    <div className="min-h-screen flex flex-col bg-[#FCF0DA] dark:bg-[#1C1917] text-[#4C4541] dark:text-[#FCF0DA] transition-colors duration-300">
      {/* Modern Floating Island Header with MatteLab Logo */}
      <Header
        brand="MATTELAB"
        subtitle="College of Engineering Trikaripur"
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

      {/* Redesigned Architectural Hero Section with header top clearance */}
      <div className="w-full flex-1 pt-[72px] sm:pt-[80px]">
        <MatteLabHero
          ctaText={loading ? "Authenticating..." : "Sign In to Propose"}
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
      </div>

      {/* College Sign-In Callout */}
      <section id="login-action-section" className="w-full py-16 px-6 bg-[#FCF0DA] dark:bg-[#1C1917] border-t-2 border-[#4C4541]/15 dark:border-white/10 flex justify-center transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#282421] rounded-[32px] p-8 sm:p-10 shadow-[6px_6px_0_#4C4541] dark:shadow-[6px_6px_0_rgba(242,196,106,0.35)] border-2 border-[#4C4541] dark:border-[rgba(242,196,106,0.35)] text-center text-[#4C4541] dark:text-[#FCF0DA] transition-colors">
          {/* Official MatteLab Brand Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#FCF0DA] dark:bg-[#1C1917] rounded-2xl px-5 py-3 border-2 border-[#4C4541] dark:border-[rgba(242,196,106,0.35)] shadow-[2px_2px_0_#4C4541] dark:shadow-[2px_2px_0_rgba(242,196,106,0.35)]">
              <img
                src={mattelabLogo}
                alt="MatteLab"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AEAC78]/25 border border-[#4C4541]/30 dark:border-[rgba(242,196,106,0.35)] text-[#4C4541] dark:text-[#FCF0DA] text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <span>[ AUTHENTICATION ] · CETKR MAKERSPACE</span>
          </div>

          <h3 className="font-condensed text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#4C4541] dark:text-[#FCF0DA]">
            Access MatteLab
          </h3>
          <p className="font-editorial italic text-xs sm:text-sm text-[#4C4541]/80 dark:text-[#FCF0DA]/80 mt-2">
            Sign in with your College of Engineering Trikaripur Google account to reserve 3D printers and register for workshops.
          </p>

          <button
            type="button"
            id="googleLoginBtn"
            className="mt-6 w-full py-4 px-5 rounded-full bg-[#4C4541] dark:bg-[#F2C46A] hover:bg-[#F2C46A] dark:hover:bg-[#e0b45c] text-[#FCF0DA] dark:text-[#4C4541] hover:text-[#4C4541] border-2 border-[#4C4541] dark:border-[#F2C46A] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0_#4C4541] dark:shadow-[3px_3px_0_rgba(242,196,106,0.4)] hover:shadow-[4px_4px_0_#4C4541] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-3 cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="google-svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            <span>{loading ? 'Authenticating...' : 'Continue with College Account'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="mt-5 text-[11px] font-mono text-[#4C4541]/70 dark:text-[#FCF0DA]/70">
            Powered by TinkerHub & IEDC · College of Engineering Trikaripur
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-[#4C4541] dark:bg-[#151312] border-t-2 border-[#4C4541] dark:border-white/10 text-center text-xs font-mono text-[#FCF0DA]/80">
        <p>© {new Date().getFullYear()} MatteLab · Innovation & Prototyping Laboratory · College of Engineering Trikaripur (CETKR)</p>
      </footer>
    </div>
  );
}
