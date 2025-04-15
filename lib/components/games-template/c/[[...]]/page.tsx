import { alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
import GameCard from '@/lib/components/game-category/GameCard';
import Link from 'next/link';
import { AppLayout } from '@/lib/components/layout/AppLayout';
interface Props {
  params: Promise<{ locale: string; page: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale, page } = await params;
  setRequestLocale(locale);
  const settings = await getHomeSettings(locale);
  const t = await getTranslations({ locale });

  if (!page || page.length === 0) {
    return {
      title: `${t('CategoryPage.categories')} | ${siteConfig.name}`,
      description: t('description'),
      alternates: {
        languages: alternatesLanguage('/c'),
      },
      icons: {
        icon: siteConfig.icon,
        apple: siteConfig.appleIcon,
      },
    };
  }

  const categoryName = page[0];
  const currentPage = page.length > 1 ? parseInt(page[1]) || 1 : 1;
  const category = settings.categories?.find(c => c.path === `/c/${categoryName}`);
  
  if (!category) {
    return {
      title: `${t('CategoryPage.categories')} | ${siteConfig.name}`,
      description: t('description'),
      alternates: {
        languages: alternatesLanguage('/c'),
      },
      icons: {
        icon: siteConfig.icon,
        apple: siteConfig.appleIcon,
      },
    };
  }

  let url = `/c/${categoryName}`;
  if (currentPage > 1) {
    url = `/c/${categoryName}/${currentPage}`;
  }

  return {
    title: `${category.name} ${currentPage > 1 ? `- ${t('Page')} ${currentPage}` : ''} | ${siteConfig.name}`,
    description: category.description || t('description'),
    alternates: {
      languages: alternatesLanguage(url),
    },
    icons: {
      icon: siteConfig.icon,
      apple: siteConfig.appleIcon,
    },
  };
}

export async function generateStaticParams() {
  const allParams = [];
  
  // 为每个语言生成根路径参数
  for (const locale of locales) {
    // 添加分类列表页的参数
    allParams.push({ locale, page: [] });
    
    const settings = await getHomeSettings(locale);
    
    // 如果没有分类，直接跳过后续处理
    if (!settings.categories || settings.categories.length === 0) {
      continue;
    }
    
    for (const category of settings.categories) {
      const categoryName = category.path.split('/').pop();
      const totalGames = category.games?.length || 0;
      const totalPages = Math.ceil(totalGames / category.pageSize);
      
      // 生成分类的首页
      allParams.push({ locale, page: [categoryName!] });
      
      // 生成分页页面
      for (let page = 2; page <= totalPages; page++) {
        allParams.push({ locale, page: [categoryName!, page.toString()] });
      }
    }
  }
  return allParams;
}

export default async function Page({ params }: Props) {
  const { locale = defaultLocale, page } = await params;
  setRequestLocale(locale);
  
  const settings = await getHomeSettings(locale);
  const t = await getTranslations({ locale });

  if (!page || page.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">{t('CategoryPage.categories')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settings.categories?.map((category) => (
            <div key={category.path} className="w-full">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="text-sm text-gray-500">{category.description}</p>
              <Link href={category.path} className="text-primary">
                {t('CategoryPage.viewMore')}
              </Link>
            </div>
          ))}
        </div>
        {(!settings.categories || settings.categories.length === 0) && (
          <p className="text-center text-gray-500">{t('CategoryPage.noCategories')}</p>
        )}
      </div>
    );
  }

  const categoryName = page[0];
  const currentPage = page.length > 1 ? parseInt(page[1]) || 1 : 1;
  
  const category = settings.categories?.find(c => c.path === `/c/${categoryName}`);
  
  if (!category) {
    notFound();
  }
  
  const games = category.games || [];
  const totalPages = Math.ceil(games.length / category.pageSize);
  const startIndex = (currentPage - 1) * category.pageSize;
  const endIndex = startIndex + category.pageSize;
  const currentGames = games.slice(startIndex, endIndex);
  const isHorizontal = category.displayStyle === 'horizontal';

  const paginationLinks = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationLinks.push({
      page: i,
      url: i === 1 ? `/c/${categoryName}` : `/c/${categoryName}/${i}`,
      isCurrent: i === currentPage
    });
  }

  return (
    <div className="bg-background text-foreground min-h-screen pt-5 pb-5">
       <AppLayout categories={settings.categories}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          {category.icon && (
            <img
              src={category.icon}
              alt={category.name}
              className="w-8 h-8"
            />
          )}
          <h1 className="text-2xl font-bold">{category.name}</h1>
        </div>
        <p className="text-gray-500 mb-8">{category.description}</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentGames.map((game) => (
            <GameCard
              key={game.url}
              game={game}
              isHorizontal={isHorizontal}
            />
          ))}
        </div>
        
        {/* 分页导航 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {paginationLinks.map((link) => (
              <Link
                key={link.page}
                href={link.url}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  link.isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-default-100 hover:bg-default-200'
                }`}
              >
                {link.page}
              </Link>
            ))}
          </div>
        )}
      </div>
      </AppLayout>
    </div>
  );
}
