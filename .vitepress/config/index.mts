import { defineConfig } from 'vitepress'
import { nav } from './nav'
import { sidebar } from './sidebar'
import { themeConfig } from './theme'
import { locales } from './locales'
import { buildEndHook } from '../hooks/buildEnd'
import { site } from './site'

export default defineConfig({
  ...site,
  locales,
  cleanUrls: true,
  themeConfig,
  buildEnd: buildEndHook
})