import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#ffffff',
        'bg-elevated': '#f5f5f7',
        surface: '#f0f0f2',
        'surface-hover': '#e8e8ed',
        ink: '#1d1d1f',
        'ink-muted': '#6e6e73',
        'ink-subtle': '#86868b',
        accent: '#0071e3',
        'accent-soft': 'rgba(0, 113, 227, 0.06)',
        'accent-glow': 'rgba(0, 113, 227, 0.15)',
        border: '#d2d2d7',
        'border-light': '#c7c7cc',
        danger: '#ff3b30',
        'danger-soft': 'rgba(255, 59, 48, 0.08)',
        success: '#28a745',
        'success-soft': 'rgba(40, 167, 69, 0.08)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        card: '20px',
        pill: '980px',
        input: '12px',
      },
      spacing: {
        'nav-height': '48px',
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'title-lg': ['32px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'title': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'title-sm': ['21px', { lineHeight: '1.38', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.47', letterSpacing: '-0.022em', fontWeight: '400' }],
        'body-sm': ['15px', { lineHeight: '1.5', letterSpacing: '-0.016em', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.4', letterSpacing: '-0.016em', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'micro': ['11px', { lineHeight: '1', letterSpacing: '0.04em', fontWeight: '600' }],
      },
      boxShadow: {
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'modal': '0 24px 80px rgba(0, 0, 0, 0.15)',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
