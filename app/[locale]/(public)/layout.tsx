import '@/app/globals.css';
import { defaultLocale } from '@/lib/i18n/locales';
import { NextUIProvider } from '@nextui-org/system';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { Footer, Navbar } from '@/lib/components';
import { siteConfig } from '@/lib/config/site';
import { NavbarItem } from '@/lib/types';
import { Toaster } from '@/lib/ui/components/toaster';
import { GoogleAnalytics } from '@next/third-parties/google';
import MicrosoftClarity from '@/lib/components/microsoft-clarity';
import { SidebarProvider } from '@/lib/context/SidebarContext';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale = defaultLocale } = await params;
  setRequestLocale(locale);
  const isDev = process.env.NODE_ENV === 'development';
  const messages = await getMessages();
  let navbars: NavbarItem[];
  try {
    navbars = (await import(`@/resources/navbar/${locale}.json`)).default;
  } catch {
    try{
      navbars = (await import(`@/resources/navbar/${locale.toLowerCase}.json`)).default;
    } catch {
      navbars = (await import(`@/resources/navbar/${defaultLocale}.json`)).default;
    }
  }
  // 过滤掉 visible=false 的导航项
  navbars = navbars.filter(item => {
    // 如果有子项,递归过滤子项
    if (item.children) {
      item.children = item.children.filter(child => child.visible !== false);
      // 如果过滤后子项为空,则移除该父项
      if (item.children.length === 0) {
        return false;
      }
    }
    // 过滤掉 visible=false 的项
    return item.visible !== false;
  });
  // 提取域名
  const domain = siteConfig.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <NextUIProvider>
      <SidebarProvider>
        <Toaster />
        <Navbar items={navbars} />
        {children}
        <Footer items={navbars} />
        {!isDev && (
          <>
            {siteConfig.gaId && <GoogleAnalytics gaId={siteConfig.gaId as string} />}
            {siteConfig.plausible && <script defer data-domain={domain} src={siteConfig.plausible}></script>}
            {siteConfig.clarityId && <MicrosoftClarity clarityId={siteConfig.clarityId} />}
            {siteConfig.adsenseClientId && <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`} crossOrigin="anonymous"></script>}
          </>
        )}
        </SidebarProvider>
      </NextUIProvider>
    </NextIntlClientProvider>
  );
}
