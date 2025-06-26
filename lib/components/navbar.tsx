'use client';

import { LocaleDropdown } from '@/lib/components/locale-dropdown';
import { siteConfig } from '@/lib/config/site';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/lib/ui/components/button';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/lib/ui/components/sheet';
import { cn } from '@/lib/utils/commons';
import { Menu, ChevronDown, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import React from 'react';
import { NavbarItem } from '../types';

interface NavItem {
  title: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export default function AppNavbar({ items }: { items: NavbarItem[] }) {
  const nt = useTranslations('Navbar');
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const pathname = usePathname();
  const locale = useLocale();

  const isActive = (href: string) => pathname === href;

  const toggleSubmenu = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
  };
  const logoUrl = siteConfig.logoUrl ? siteConfig.logoUrl : '/logo.svg';

  const handleLocaleChange = (value: string) => {
    // implement locale change logic here
  };

  const localeNames = {
    // implement locale names here
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-navbar backdrop-blur supports-[backdrop-filter]:bg-navbar/95">
      <div className="container flex h-16 items-center px-4">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="text-navbar-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] bg-navbar/95 backdrop-blur supports-[backdrop-filter]:bg-navbar/60"
          >
            <SheetHeader>
              <SheetTitle className="text-navbar-foreground">{nt('title')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              {items.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubmenu(item.title);
                        }}
                        type="button"
                        className="flex items-center justify-between px-4 py-2 text-sm font-medium text-navbar-foreground/80 hover:text-navbar-foreground transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            openItems.includes(item.title) ? 'rotate-180' : '',
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          'ml-4 flex flex-col gap-2 overflow-hidden transition-all duration-200',
                          openItems.includes(item.title) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
                        )}
                      >
                        {item.children.map((child) => (
                            <a key={child.href}
                              href={child.href}
                              className={cn(
                                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-navbar-foreground/80',
                                'hover:bg-navbar-foreground/10 hover:text-navbar-foreground transition-colors',
                                isActive(child.href) && 'bg-navbar-foreground/10 text-navbar-foreground',
                              )}
                              // 其他普通的 <a> 标签属性，比如 target
                              target={child.href.startsWith('http') ? '_blank' : '_self'}
                              rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              onClick={(e) => {
                                setIsMenuOpen(false);
                              }}
                            >
                              {child.title}
                            </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                      <a key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-navbar-foreground/80',
                          'hover:bg-navbar-foreground/10 hover:text-navbar-foreground transition-colors',
                          isActive(item.href) && 'bg-navbar-foreground/10 text-navbar-foreground',
                        )}
                        // 其他普通的 <a> 标签属性，比如 target
                        target={item.href.startsWith('http') ? '_blank' : '_self'}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.title}
                      </a>
                  )}
                </div>
              ))}
              <div className="px-4 py-2">
                <LocaleDropdown />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src={logoUrl}
              className="h-10 md:h-14 w-auto rounded-xl"
              alt={`${t('title')} logo`}
              width={20}
              height={20}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error('Image load failed:', e);
              }}
            />
            <div>
              <p className="text-navbar-foreground/80 hover:text-navbar-foreground transition-colors">
                {siteConfig.name as any}
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu.Root className="relative">
            <NavigationMenu.List className="flex gap-2">
              {items.map((item) => (
                <NavigationMenu.Item key={item.title} className="relative">
                  {item.children ? (
                    <>
                      <NavigationMenu.Trigger className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-navbar-foreground/80 hover:text-navbar-foreground hover:bg-navbar-foreground/10 transition-colors">
                        {item.title}
                        <ChevronDown
                          className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                          aria-hidden="true"
                        />
                      </NavigationMenu.Trigger>
                      <NavigationMenu.Content
                        className={cn(
                          'absolute top-full left-0 mt-2 w-48 origin-top-left rounded-md bg-navbar/95 backdrop-blur-sm p-2 shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none',
                          'data-[motion=from-start]:animate-enterFromLeft',
                          'data-[motion=from-end]:animate-enterFromRight',
                          'data-[motion=to-start]:animate-exitToLeft',
                          'data-[motion=to-end]:animate-exitToRight',
                        )}
                      >
                        {item.children.map((child) => (
                            <a key={child.href}
                              href={child.href}
                              className={cn(
                                'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2',
                                'text-sm font-medium text-navbar-foreground/80 transition-colors',
                                'hover:bg-navbar-foreground/10 hover:text-navbar-foreground',
                                isActive(child.href) && 'bg-navbar-foreground/10 text-navbar-foreground',
                              )}
                              // 其他普通的 <a> 标签属性，比如 target
                              target={child.href.startsWith('http') ? '_blank' : '_self'}
                              rel={child.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            >
                              {child.title}
                            </a>
                        ))}
                      </NavigationMenu.Content>
                    </>
                  ) : (
                      <a key={item.href}
                        href={item.href}
                        className={cn(
                          'group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2',
                          'text-sm font-medium text-navbar-foreground/80 transition-colors',
                          'hover:bg-navbar-foreground/10 hover:text-navbar-foreground',
                          isActive(item.href) && 'bg-navbar-foreground/10 text-navbar-foreground',
                        )}
                        // 其他普通的 <a> 标签属性，比如 target
                        target={item.href.startsWith('http') ? '_blank' : '_self'}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.title}
                      </a>
                  )}
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <LocaleDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
