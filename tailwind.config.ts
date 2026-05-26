import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1F1A1D',
        'on-primary': '#FDFBF4',
        background: '#FDFBF4',
        surface: '#FDFBF4',
        'surface-variant': '#E8E6DE',
        'surface-container': '#f0ede6',
        'on-surface': '#1F1A1D',
        'on-surface-variant': '#4A4548',
        marigold: '#F5C94C',
        charcoal: '#1F1A1D',
        ivory: '#FDFBF4',
        'charcoal-border': 'rgba(31, 26, 29, 0.12)',
        success: '#2d5a3d',
        'success-bg': '#e9f2eb',
        danger: '#ba1a1a',
        'danger-bg': '#ffdad6',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        card: '20px',
        button: '28px',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      spacing: {
        'gutter-mobile': '16px',
        'gutter-desktop': '24px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'container-max': '720px',
      },
      fontSize: {
        'display-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.01em', fontWeight: '500' }],
      },
      boxShadow: {
        'scrapbook': '0 4px 12px -2px rgba(31, 26, 29, 0.06)',
        'scrapbook-lg': '0 8px 24px -4px rgba(26, 28, 31, 0.15)',
        'card': '0 10px 15px -3px rgba(31, 26, 29, 0.1), 0 4px 6px -2px rgba(31, 26, 29, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config
