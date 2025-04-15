import { alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {siteConfig} from '@/lib/config/site';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
import {GameCategorySection} from '@/lib/components/game-category';
import GameGroup from '@/lib/components/game-category/GameGroup';
import { AppLayout } from '@/lib/components/layout/AppLayout';
interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return {
    title: `${t('title')}`,
    description: t('description'),
    alternates: {
      languages: alternatesLanguage(''),
    },
    
    icons: {
      icon: siteConfig.icon,
      apple: siteConfig.appleIcon,
    },
  };
}

export default async function Page({ params }: Props) {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const settings = await getHomeSettings(locale);
  const t = await getTranslations({ locale });

  return (
    <div className="bg-background text-foreground">
      <AppLayout categories={settings.categories}>
        {/* 推荐游戏区域 */}
        {settings.recommended.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 将推荐游戏列表按照5个一组进行分组 */}
              {Array.from({ length: Math.ceil(settings.recommended.length / 5) }, (_, i) => {
                const groupGames = settings.recommended.slice(i * 5, (i + 1) * 5);
                return <GameGroup key={i} games={groupGames} />;
              })}
            </div>
          </div>
        )}

        {/* 游戏分类区域 */}
        <div className="space-y-8">
          {settings.categories.map((category) => (
            <GameCategorySection
              key={category.name}
              category={category}
            />
          ))}
        </div>
      </AppLayout>
    </div>
  );
}