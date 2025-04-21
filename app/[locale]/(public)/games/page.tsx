import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { defaultLocale, locales, alternatesLanguage } from '@/lib/i18n/locales';
import { siteConfig } from '@/lib/config/site';
import fs from 'fs';
import path from 'path';
import { Link } from '@/lib/i18n/navigation'
import { getPathnameWithLocale } from '@/lib/i18n/navigation';
type Props = {
  params: Promise<{ locale: string }>;
};

type GameInfo = {
  name: string;
  pagePath: string;
  directory: string;
  screenshotUrl: string;
  createdTime: string;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return {
    title: `${t('GamePage.title')} | ${siteConfig.name}`,
    description: t('GamePage.description'),
    alternates: {
      languages: alternatesLanguage('/games'),
    }
  };
}

async function getGameName(directory: string, pagePath: string, defaultName: string, locale: string) {
  if (locale === 'en') {
    return defaultName;
  }

  const translationPath = path.join(process.cwd(), 'messages', locale, `${pagePath}.json`);
  try {
    if (fs.existsSync(translationPath)) {
      const translationContent = fs.readFileSync(translationPath, 'utf-8');
      const translation = JSON.parse(translationContent);
      return translation.title || defaultName;
    }
  } catch (error) {
    console.error(`Error reading translation for ${directory} in ${locale}:`, error);
  }
  return defaultName;
}

async function getGames(locale: string) {
  const gamesDir = path.join(process.cwd(), 'app/[locale]/(public)/games');
  const entries = fs.readdirSync(gamesDir, { withFileTypes: true });

  const games: GameInfo[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'assets') {
      const configPath = path.join(gamesDir, entry.name, 'config', 'config.json');
      try {
        if (fs.existsSync(configPath)) {
          const configContent = fs.readFileSync(configPath, 'utf-8');
          const config = JSON.parse(configContent);
          const gameName = await getGameName(entry.name, config.pagePath, config.name, locale);
          games.push({
            name: gameName,
            pagePath: config.pagePath,
            directory: entry.name,
            screenshotUrl: config.screenshotUrl,
            createdTime: config.createdTime || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error(`Error reading config for ${entry.name}:`, error);
      }
    }
  }

  // 按创建时间倒序排序
  games.sort((a, b) => {
    const dateA = new Date(a.createdTime).getTime();
    const dateB = new Date(b.createdTime).getTime();
    return dateB - dateA;
  });

  return games;
}

export default async function GamesPage({ params }: Props) {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GamePage");
  const games = await getGames(locale);

  const getGridCols = (count: number) => {
    if (count <= 4) return 'lg:grid-cols-4';
    if (count <= 6) return 'lg:grid-cols-6';
    return 'lg:grid-cols-8';
  };

  const gridColumns = getGridCols(games.length);

  return (
    <div className="bg-background min-h-screen pt-5 pb-5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8 text-center">{t('title')}</h1>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColumns} gap-6`}>
          {games.map((game) => (
            <Link
              href={`/games/${game.directory}`}
              key={game.directory}
              className="group block bg-card rounded-lg overflow-hidden hover:ring-2 hover:ring-accent transition-all duration-300"
            >
              <div className="aspect-video relative">
                <img
                  src={game.screenshotUrl}
                  alt={game.name}
                  className="w-full h-full object-cover absolute inset-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  {game.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}