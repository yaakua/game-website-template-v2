'use client'

import { Link } from '@/lib/i18n/navigation';
import dayjs from 'dayjs';
import { ArticleMetadata } from '@/lib/utils/blogs';

type ArticleListProps = {
  currentArticles: ArticleMetadata[];
  paginationLinks: Array<{
    page: number;
    href: string;
    isCurrent: boolean;
  }>;
  totalPages: number;
  currentPage: number;
  translations: {
    articleList: string;
    createAt: string;
    previous: string;
    next: string;
  };
}

export function ArticleList({ 
  currentArticles, 
  paginationLinks, 
  totalPages, 
  currentPage, 
  translations 
}: ArticleListProps) {
  return (
    <div className="bg-background text-foreground">
      <div className="max-w-6xl mx-auto py-10 px-4 min-h-[65vh]">
        <h1 className="text-2xl font-bold mb-6">{translations.articleList}</h1>
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
                      {translations.createAt}: {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm:ss')}
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
                {translations.previous}
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
                {translations.next}
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}