import BundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';
import { NextConfig } from 'next';
import createNextIntlPlugin from "next-intl/plugin";
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';


const withBundleAnalyzer = BundleAnalyzer({
    // enabled: process.env.ANALYZE === 'true',
    enabled: false,
})

const withNextIntl = createNextIntlPlugin("./i18n.ts")
// 添加支持直接使用本地.mdx文件组件
const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    options: {
        remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            remarkMdxFrontmatter
        ],
        rehypePlugins: [],
    },
})

const nextConfig: NextConfig = {
    staticPageGenerationTimeout: 1000,
    onDemandEntries: {
        // 在开发模式下保持页面在内存中的时间更长
        maxInactiveAge: 25 * 1000,
        // 同时保持在内存中的页面数
        pagesBufferLength: 5,
    },
    experimental: {
        cssChunking: "strict"
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'public-image.fafafa.ai',
          },
        ],
    },
    output: 'export',
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    transpilePackages: ["next-mdx-remote"],
    trailingSlash: false,
    env: {
        UE_WEB_URL: process.env.UE_WEB_URL,
    }
}

export default withBundleAnalyzer(withMDX(withNextIntl(nextConfig)))
