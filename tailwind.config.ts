import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';
import { getTheme } from './lib/config/themes';
import siteConfig from './lib/config/site.json';

const theme = getTheme(siteConfig.theme?.name || 'default');
console.log("###加载theme", siteConfig.theme?.name);
const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './lib/components/**/*.{ts,tsx}',
    './lib/ui/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: '',
  theme: {
    extend: {
      ...theme
    }
  },
  plugins: [
    animate,
    typography,
    nextui(theme.nextui),
  ],
} satisfies Config;

export default config;
