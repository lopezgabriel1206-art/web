'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
type Theme = 'light' | 'dark';
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const saved = window.localStorage.getItem('chefelpi-theme');
    const initial:Theme = saved === 'light' || saved === 'dark' ? saved : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('chefelpi-theme', next);
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} title="Cambiar tema">{theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}</button>;
}
