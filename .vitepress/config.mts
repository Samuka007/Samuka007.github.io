import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'

const hostname: string = 'https://samuka007.github.io'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Samuka007",
  description: "Samuka007's blog",
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh_CN',
    },
    en: {
      label: 'English',
      lang: 'en',
    }
  },
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'DragonOS', link: 'https://github.com/DragonOS-Community/DragonOS' },
    ],

    sidebar: [
      // { text: '首页', link: '/' },
      {
        text: '博客',
        items: [
          { text: '继续未完成的旅途', link: '/blog/continue' },
          { text: '☁️ 云服务', link: '/blog/cloud' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Samuka007' }
    ],

    search: {
      provider: 'local',
    },
  },
  // buildEnd: async (config: SiteConfig) => {
  //   const feed = new Feed({
  //     title: '一日终',
  //     description: 'Blog of Samuka007',
  //     id: hostname,
  //     link: hostname,
  //     language: 'zh-CN',
  //     image: 'https://avatars.githubusercontent.com/u/49808042?s=240&v=4',
  //     // favicon: `${hostname}/favicon.ico`,
  //     copyright:
  //       'CC BY-SA 4.0 2024-present, Samuka007'
  //   })

  //   // You might need to adjust this if your Markdown files 
  //   // are located in a subfolder
  //   const posts = await createContentLoader('*.md', {
  //     excerpt: true,
  //     render: true
  //   }).load()
  
  //   posts.sort(
  //     (a, b) =>
  //       +new Date(b.frontmatter.date as string) -
  //       +new Date(a.frontmatter.date as string)
  //   )
  
  //   for (const { url, excerpt, frontmatter, html } of posts) {
  //     feed.addItem({
  //       title: frontmatter.title,
  //       id: `${hostname}${url}`,
  //       link: `${hostname}${url}`,
  //       description: excerpt,
  //       content: html,
  //       author: [
  //         {
  //           name: 'Samuka007',
  //           email: 'dai-samuel@outlook.com',
  //           link: 'https://github.com/Samuka007'
  //         }
  //       ],
  //       date: frontmatter.date
  //     })
  //   }
  
  //   writeFileSync(path.join(config.outDir, 'feed.rss'), feed.rss2())
  // }
})
