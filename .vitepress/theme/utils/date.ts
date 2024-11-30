export function formatDate(date: string, lang: string = 'zh-CN'): string {
  const d = new Date(date)
  return d.toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function sortPostsByDate(posts: any[]): any[] {
  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : new Date(0)
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : new Date(0)
    return dateB.getTime() - dateA.getTime()
  })
}