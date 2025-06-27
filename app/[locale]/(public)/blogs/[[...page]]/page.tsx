import { alternatesCanonical, alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { ArticleMetadata, getArticlesData } from '@/lib/utils/blogs';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import { siteConfig as mainConfig } from '@/lib/config/site'
import { AppLayout } from '@/lib/components/layout/AppLayout';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
import { ArticleList } from '@/lib/components/blogs/ArticleList';
type Props = {
  params: Promise<{ locale: string; page: string }>;
};
export const dynamic = 'force-static'
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale, page } = await params;
  setRequestLocale(locale);
  const currentPage = page ? Number(page[0]) || 1 : 1;
  const t = await getTranslations({ locale });
  let url = "/blogs"
  if (currentPage != 1) {
    url = `/blogs/${currentPage}`
  }
  return {
    title: `${t('Common.articleList')} | ${siteConfig.name}`,
    description: t('description'),
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
  for (const locale of locales) {
    const articles = getArticlesData()[locale] || [];
    const totalPages = Math.ceil(articles.length / 20);

    // 为所有语言生成对应的路径
    allParams.push({ locale, page: [] });
    for (let page = 1; page <= totalPages; page++) {
      allParams.push({ locale, page: [page.toString()] });
    }
  }
  return allParams;
}

type PageProps = {
  params: Promise<{
    locale: string;
    page?: string[];
  }>;
};

export default async function Page({ params }: PageProps) {
  try {
    const { locale, page } = await params;
    setRequestLocale(locale);
    const articles = getArticlesData()[locale] || [];
    const t = await getTranslations({ locale });
    // console.log("###articles#####",articles);
    const currentPage = page ? Number(page[0]) || 1 : 1;
    const pageSize = 20;
    const totalPages = Math.ceil(articles.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentArticles = articles.slice(startIndex, endIndex);
    // 生成分页链接
    const paginationLinks: any[] = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push({
        page: i,
        href: `/blogs/${i}`,
        isCurrent: i === currentPage
      });
    }

    const pageContent = (
      <ArticleList 
        currentArticles={currentArticles}
        paginationLinks={paginationLinks}
        totalPages={totalPages}
        currentPage={currentPage}
        translations={{
          articleList: t('Common.articleList'),
          createAt: t('Common.createAt'),
          previous: t('Common.previous'),
          next: t('Common.next')
        }}
      />
    );
    if (mainConfig.templateType === 'game-box') {
      const settings = await getHomeSettings(locale);
      return (
        <AppLayout categories={settings.categories}>
          {pageContent}
        </AppLayout>
      );
    }

    return pageContent;
  } catch (error) {
    console.log(`article list page render error`, error);
    notFound();
  }
}
