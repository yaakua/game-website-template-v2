import { alternatesCanonical, alternatesLanguage, defaultLocale, locales } from '@/lib/i18n/locales';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { siteConfig } from '@/lib/config/site';
import { permanentRedirect } from 'next/navigation'
type Props = {
  params: Promise<{ locale: string }>;
};
export const dynamic = 'force-static'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return {
    title: `${t('Common.articleList')} | ${siteConfig.name}`,
    description: t('description'),
    alternates: {
      languages: alternatesLanguage('/t'),
    },
    icons: {
      icon: siteConfig.icon,
      apple: siteConfig.appleIcon,
    },
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}


type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  permanentRedirect(`${alternatesCanonical(locale, '/blogs')}`);
}