import MdxArticle from '@/lib/components/mdx-article';
import {siteConfig} from '@/lib/config/site';
import {alternatesLanguage, host, locales} from '@/lib/i18n/locales';
import matter from 'gray-matter';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import fs from 'fs';
import path from 'path';
import {Link} from '@/lib/i18n/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {siteConfig as mainConfig} from '@/lib/config/site'
import { AppLayout } from '@/lib/components/layout/AppLayout';
import { getHomeSettings } from '@/lib/utils/game-box-settings';
// 必须添加，避免纯静态编译报错
export const dynamic = 'force-static'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
    // 直接导入 MDX 文件的原始内容
    let Content;
    let hasOther = false;
    try {
      // Check if other locale files exist
      const currentDir = path.dirname(__filename);
      const mdxFiles = fs.readdirSync(currentDir).filter((file: string) => file.endsWith('.mdx'));
      hasOther = mdxFiles.some((file: string) => file !== 'en.mdx');
      
      Content = (await import(`!!raw-loader!./${locale}.mdx`)).default;
    } catch (error) {
      Content = (await import(`!!raw-loader!./en.mdx`)).default;
    }
    const { content, data: frontMatter } = matter(Content);
    // 获取当前文件所在的父级目录名称
    const pathSegments = __filename.split('/');
    let slug = pathSegments[pathSegments.length - 2]
    if(!slug.startsWith('/')){
      slug = `/t/${slug}`
    }
    const alternates = hasOther ? {
      languages: alternatesLanguage(slug),
    } : {
      canonical: `${host}${slug}`,
    }
  return {
    title: `${frontMatter.title} | ${siteConfig.name}`,
    description: frontMatter.description,
    alternates: {
      ...alternates,
    },
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  try {
    const {locale} = await params;
    setRequestLocale(locale);
    // 直接导入 MDX 文件的原始内容
    let Content;
    try {
      Content = (await import(`!!raw-loader!./${locale}.mdx`)).default;
    } catch (error) {
      try{
        Content = (await import(`!!raw-loader!./en.mdx`)).default;
      }catch (error) {
        console.log(error);
      }
    }
    const {content, data: frontMatter } = matter(Content);
    const t = await getTranslations({ locale });
    const PageContent = ()=>(
      <div className="bg-background pt-5 pb-5">
      <div className="container mx-auto">
      <div className="py-2 px-4 max-w-4xl mx-auto text-foreground">
            {/* 添加面包屑导航 */}
            <nav className="text-sm" aria-label="Breadcrumb">
                <ol className="flex space-x-2">
                  <li>
                    <Link href="/" className="text-link hover:text-link-hover">
                      {t('Common.home')}
                    </Link>
                  </li>
                  <li className="text-divider">/</li>
                  <li>
                    <Link href="/blogs" className="text-link hover:text-link-hover">
                      {t('Common.articleList')}
                    </Link>
                  </li>
                  <li className="text-divider">/</li>
                  <li className="text-muted" aria-current="page">
                    {frontMatter.title}
                  </li>
                </ol>
              </nav>

      </div>
        <article
          className="rounded-2xl max-w-4xl mx-auto py-5 px-4">
          <MdxArticle source={content} className="max-w-full"/>
        </article>
        </div>
    </div>
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
    console.log("#### error", error);
    notFound();
  }
}