import { alternatesCanonical, alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { Link } from '@/lib/i18n/navigation';
import { ArticleMetadata, getArticlesData } from '@/lib/utils/blogs';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';
import { siteConfig } from '@/lib/config/site';
import dayjs from 'dayjs';
import { siteConfig as mainConfig } from '@/lib/config/site'
import { AppLayout } from '@/lib/components/layout/AppLayout';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
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

    const PageContent = () => (

      (
        <div className="bg-background text-foreground">
          <div className="max-w-6xl mx-auto py-10 px-4 min-h-[65vh]">
            <h1 className="text-2xl font-bold mb-6">{t('Common.articleList')}</h1>
            <div className="grid gap-6 mb-6">
              {currentArticles.map((article) => (
                <Link
                  href={`/t/${article.slug}`}
                  key={article.slug}
                  className="block p-4 border rounded-lg hover:bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className='aspect-[4/3] md:aspect-[16/9] relative'>
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          width={240}
                          height={240}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{article.title}</h2>
                      {article.description && (
                        <p className="text-foreground/60 mt-2 text-sm line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      {article.createdAt && (
                        <p className="text-foreground/50 text-sm mt-1">
                          {t('Common.createAt')}: {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="flex justify-center gap-2 py-4" aria-label="Pagination">
                {currentPage > 1 && (
                  <Link
                    href={`/blogs/${currentPage - 1}`}
                    className="px-4 py-2 border rounded hover:bg-card"
                    aria-label="Previous page"
                  >
                    {t('Common.previous')}
                  </Link>
                )}
                {paginationLinks.map(({ page, href, isCurrent }) => (
                  <Link
                    key={page}
                    href={href}
                    className={`px-4 py-2 border rounded ${isCurrent ? 'bg-success text-background' : 'hover:bg-success-hover hover:text-background'}`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {page}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={`/blogs/${currentPage + 1}`}
                    className="px-4 py-2 border rounded hover:bg-card"
                    aria-label="Next page"
                  >
                    {t('Common.next')}
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      )
    )
    if (mainConfig.templateType === 'game-box') {
      const settings = await getHomeSettings(locale);
      return (
        <AppLayout categories={settings.categories}>
          <PageContent />
        </AppLayout>
      );
    }

    return <PageContent />;
  } catch (error) {
    console.log(`article list page render error`, error);
    notFound();
  }
}
