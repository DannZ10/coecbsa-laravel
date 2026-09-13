import type { Config } from 'tailwindcss';

/**
 * CoE CBSA — Tailwind theme mapping the Design Tokens.
 * Semantic colours use CSS variables (see src/styles/tokens.css) so light/dark
 * theming is automatic. Raw palettes (emerald/amber/stone) remain available for
 * special cases. darkMode is driven by [data-theme="dark"].
 *
 * Adapted from design-system/tailwind.config.ts: font families now reference the
 * CSS variables set by next/font (--font-display / --font-body), per design-system §10.
 */
export default {
  content: [
    './resources/js/**/*.{ts,tsx}',
    './resources/views/**/*.blade.php',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* Public-site palette from the supplied landing-page source. */
        paper: '#F5F2E9',
        'paper-2': '#EFEADD',
        ink: '#16261D',
        forest: {
          300: '#7BB79B',
          500: '#2C7D5B',
          600: '#1F6347',
          700: '#174D38',
          800: '#123B2B',
          900: '#0C261B',
        },
        clay: '#B8683F',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        'primary-foreground': 'var(--primary-foreground)',
        'accent-foreground': 'var(--accent-foreground)',
        // ---- Raw palettes ----
        emerald: {
          50: '#F2F8F6', 100: '#DBF0EA', 200: '#B5E3D5', 300: '#7DD4BA',
          400: '#39C69C', 500: '#259D79', 600: '#187C5E', 700: '#106048',
          800: '#0C4B38', 900: '#09392B', 950: '#07271D',
        },
        amber: {
          DEFAULT: '#CAA03D', soft: '#E2C883',
          50: '#FCF7EE', 100: '#FBF0DB', 200: '#F8E0AF', 300: '#F6CD79',
          400: '#F3B73F', 500: '#E8A111', 600: '#BA8212', 700: '#8E6615',
          800: '#6A4E16', 900: '#493712', 950: '#2F240E',
        },
        stone: {
          50: '#F6F5F4', 100: '#EDEBE8', 200: '#D8D5CF', 300: '#BEBAB1',
          400: '#A19C91', 500: '#868074', 600: '#6D685F', 700: '#58544B',
          800: '#45423A', 900: '#322F29', 950: '#22201B',
        },
        // ---- Semantic (theme-aware via CSS vars) ----
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        elevated: 'var(--color-elevated)',
        foreground: {
          DEFAULT: 'var(--color-fg)',
          muted: 'var(--color-fg-muted)',
          subtle: 'var(--color-fg-subtle)',
        },
        line: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          fg: 'var(--color-on-primary)',
          subtle: 'var(--color-primary-subtle)',
          'subtle-fg': 'var(--color-primary-subtle-fg)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          fg: 'var(--color-on-accent)',
          strong: 'var(--color-accent-strong)',
        },
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
        },
        success: { DEFAULT: 'var(--success)', bg: 'var(--success-bg)', fg: 'var(--success-fg)' },
        warning: { DEFAULT: 'var(--warning)', bg: 'var(--warning-bg)', fg: 'var(--warning-fg)' },
        danger: { DEFAULT: 'var(--danger)', bg: 'var(--danger-bg)', fg: 'var(--danger-fg)' },
        info: { DEFAULT: 'var(--info)', bg: 'var(--info-bg)', fg: 'var(--info-fg)' },
        focus: 'var(--color-focus-ring)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3rem,1rem+7vw,5rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
      },
      borderRadius: { sm: '6px', md: '8px', lg: '12px', xl: '12px', '2xl': '16px', '3xl': '24px' },
      boxShadow: {
        xs: 'var(--shadow-xs)', primary: 'var(--shadow-primary)',
        focus: 'var(--shadow-focus)',
      },
      opacity: { 8: '0.08', 12: '0.12', 15: '0.15', 45: '0.45', 55: '0.55', 85: '0.85' },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4,0,0.2,1)',
        emphasized: 'cubic-bezier(0.2,0,0,1)',
      },
      transitionDuration: { fast: '150ms', DEFAULT: '250ms', slow: '400ms' },
      maxWidth: { container: '1200px' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
      zIndex: { dropdown: '1000', sticky: '1100', overlay: '1300', modal: '1400', toast: '1500' },
      keyframes: {
        'fade-rise': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise var(--dur-slow) var(--ease-standard) both',
        'toast-in': 'toast-in var(--dur-base) var(--ease-emphasized) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
