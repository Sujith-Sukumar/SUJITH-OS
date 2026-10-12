/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--background)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        txt: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          text: 'var(--accent-text)',
        },
        status: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
        },
        terminal: {
          bg: 'var(--terminal-bg)',
          text: 'var(--terminal-text)',
          muted: 'var(--terminal-muted)',
          prompt: 'var(--terminal-prompt)',
          cmd: 'var(--terminal-command)',
          success: 'var(--terminal-success)',
          error: 'var(--terminal-error)',
          border: 'var(--terminal-border)',
          cursor: 'var(--terminal-cursor)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'os-window': 'var(--os-window-shadow)',
        'os-window-active': 'var(--os-window-shadow-active)',
        'os-elevated': 'var(--os-elevated-shadow)',
      },
    },
  },
  plugins: [],
}
