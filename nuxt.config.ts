// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from '@modyfi/vite-plugin-yaml';
import ViteMarkdown from 'vite-plugin-markdown';
import svgLoader from 'vite-svg-loader'
import fs from 'fs'
import { resolve } from "node:path";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  i18n: {
    baseUrl: 'https://language-technology-assessment.github.com/website/',
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US'
      },
      {
        code: 'nl',
        language: 'nl-NL'
      }
    ]
  },
  content: {
    sources: {
      content: {
        driver: 'fs',
        base: resolve(__dirname, 'repos/website/pages')
      }
    }
  },
  modules: [// './modules/extend-pages-module/extendpages.ts',
  ['./modules/github.module', {
    repositories: [{
    name: 'data',
    // owner: 'opening-up-chatgpt',
    // repo: 'opening-up-chatgpt.github.io',
    owner: 'Language-Technology-Assessment',
    repo: 'main-database',
    }, {
    name: 'website',
    owner: 'Language-Technology-Assessment',
    repo: 'European-open-AI-index',
  }]
    }], '@nuxt/content', '@pinia/nuxt', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/sitemap'],
  image: {
    dir: 'repos/website',
  },
  sitemap: {
    urls: async () => {
      const urls:Array<string> = []
      fs.readdirSync('./repos/data/').forEach(file => {
        if (!file.match('a_submission_template.yaml') && !file.match('_parameters.yml')) {
          const filename = file.replace('.yaml', '')
          // extendPages
          urls.push(`/model/${filename}`)
        }
      })
      return urls
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/less/ease.less";@import "@/less/animations.less"; @import "@/less/global.less";`
        }
      }
    },
    plugins: [
      ViteYaml(),
      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  // @see https://github.com/svg/svgo/issues/1128
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      }),
      ViteMarkdown({mode: ['html']})
    ]
  },
})