import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'
import { hostname, author } from '../config/constants'

async function createFeed(config: SiteConfig, lang: string) {
  const feed = new Feed({
    title: lang === 'zh-CN' ? '一日终' : 'End of the Day',
    description: 'Blog of Samuka007',
    id: hostname,
    link: hostname,
    language: lang,
    image: 'https://avatars.githubusercontent.com/u/49808042?s=240&v=4',
    copyright: 'CC BY-SA 4.0 2024-present, Samuka007',
    author: {
      name: author.name,
      email: author.email,
      link: author.github
    }
  })

  const postsPattern = lang === 'zh-CN' ? 'blog/*.md' : 'en/blog/*.md'
  const posts = await createContentLoader(postsPattern, {
    excerpt: true,
    render: true
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${hostname}${url}`,
      link: `${hostname}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: author.name,
          email: author.email,
          link: author.github
        }
      ],
      date: frontmatter.date || new Date()
    })
  }

  const fileName = lang === 'zh-CN' ? 'feed.zh.rss' : 'feed.en.rss'
  writeFileSync(path.join(config.outDir, fileName), feed.rss2())
}

export async function buildEndHook(config: SiteConfig) {
  await Promise.all([
    createFeed(config, 'zh-CN'),
    createFeed(config, 'en')
  ])
}