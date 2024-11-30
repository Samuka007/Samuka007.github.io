import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Samuka007",
  description: "Samuka007's blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'DragonOS', link: 'https://github.com/DragonOS-Community/DragonOS' },
    ],

    sidebar: [
      {
        text: 'Blogs',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: '继续未完的', link: '/24-11-30-continue'},
        ]
      }
    ],

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  }
})
