import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          baby: "var(--baby)",
          deep: "var(--deep)",
          rose: "var(--rose)",
          silver: "var(--silver)",
          charcoal: "var(--char)",
          soft: "var(--bg)",
          muted: "var(--muted)",
          line: "var(--line)",
          chip: "var(--chip)",
        },
      },
      fontFamily: {
        sans: [
          '"Inter Tight"',
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      boxShadow: {
        glass: "inset 0 1.5px 1px var(--hi), inset 0 -.6rem 1.5rem rgba(244,194,208,.22), 0 1.1rem 2.5rem -1.1rem rgba(140,49,80,.45)",
        hg: "inset 0 1.5px 1px rgba(255,255,255,.55), inset 0 -.4rem .9rem rgba(140,49,80,.25), 0 .5rem 1.2rem -.6rem rgba(28,28,30,.5)",
      },
    },
  },
  plugins: [],
};

export default config;
