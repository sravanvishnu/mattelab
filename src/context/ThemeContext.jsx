import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const explicit = localStorage.getItem('mattelab_theme_explicit');
      const stored = localStorage.getItem('mattelab_theme');
      // Only restore stored theme if explicitly chosen by user
      if (explicit === 'true' && (stored === 'dark' || stored === 'light')) {
        return stored;
      }
      // Default strictly to light mode (signature cream MatteLab canvas)
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light-theme');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light-theme');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('mattelab_theme', next);
        localStorage.setItem('mattelab_theme_explicit', 'true');
      } catch (e) {
        // ignore storage errors
      }
      return next;
    });
  };

  const setThemeExplicitly = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
      try {
        localStorage.setItem('mattelab_theme', newTheme);
        localStorage.setItem('mattelab_theme_explicit', 'true');
      } catch (e) {
        // ignore storage errors
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme: setThemeExplicitly }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      isDark: false,
      toggleTheme: () => {},
      setTheme: () => {}
    };
  }
  return context;
}
