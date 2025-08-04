import { MetadataRoute } from 'next'
import { locales } from '@/lib/i18n/locales'
import { getArticlesData } from '@/lib/utils/blogs'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/lib/config/site'

type GameInfo = {
  directory: string;
  pagePath: string;
  createdTime: string;
}

async function getGames(): Promise<GameInfo[]> {
  const gamesDir = path.join(process.cwd(), 'app/[locale]/(public)/games')
  const entries = fs.readdirSync(gamesDir, { withFileTypes: true })
  const games: GameInfo[] = []

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'assets') {
      const configPath = path.join(gamesDir, entry.name, 'config', 'config.json')
      try {
        if (fs.existsSync(configPath)) {
          const configContent = fs.readFileSync(configPath, 'utf-8')
          const config = JSON.parse(configContent)
          games.push({
            directory: entry.name,
            pagePath: config.pagePath,
            createdTime: config.createdTime || new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error(`Error reading config for ${entry.name}:`, error)
      }
    }
  }
  return games
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `https://${siteConfig.domain}`
  const currentDate = new Date()
  const games = await getGames()
  const articles = getArticlesData()

  // Initialize sitemap entries with home pages for all locales
  const entries: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1
  }))

  // Add games pages for all locales
  locales.forEach(locale => {
    // Games list page
    entries.push({
      url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/games`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9
    })

    // Individual game pages
    games.forEach(game => {
      entries.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/games/${game.directory}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    })
  })

  // Add blogs pages for all locales
  locales.forEach(locale => {
    const localeArticles = articles[locale] || []
    const totalPages = Math.ceil(localeArticles.length / 20)

    // Blogs list pages with pagination
    for (let page = 1; page <= Math.max(1, totalPages); page++) {
      entries.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/blogs${page === 1 ? '' : `/${page}`}`,
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 0.9
      })
    }

    // Individual blog article pages
    localeArticles.forEach(article => {
      entries.push({
        url: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/t/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    })
  })

  return entries
} 