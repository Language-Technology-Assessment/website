// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from "@modyfi/vite-plugin-yaml";
import svgLoader from "vite-svg-loader";
import fs from "fs";
import { resolve, basename, dirname, parse } from "node:path";
import glob from "fast-glob";

const BASE = process.env.NUXT_APP_BASE_URL || "/";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  pages: true,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [
        {
          rel: "icon",
          href: `${BASE}logo.svg`,
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: `${BASE}logo.png`,
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: `${BASE}logo-dark.svg`,
          media: "(prefers-color-scheme: dark)",
        },
        {
          rel: "icon",
          href: `${BASE}logo-dark.png`,
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      NUXT_SITE_ENV: process.env.NUXT_SITE_ENV || "production",
    },
  },
  site: {
    indexable: process.env.NUXT_SITE_ENV === "production",
  },
  i18n: {
    baseUrl: "https://www.osai-index.eu",
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        language: "en-US",
      },
      {
        code: "nl",
        language: "nl-NL",
      },
    ],
  },
  modules: [
    [
      "./modules/github.module",
      {
        repositories: [
          {
            name: "data",
            owner: "Language-Technology-Assessment",
            repo: "main-database",
          },
          {
            name: "website",
            owner: "Language-Technology-Assessment",
            repo: "European-open-AI-index",
          },
        ],
      },
    ],
    "@nuxtjs/seo",
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],
  image: {
    // dir: resolve(__dirname, "repos/website/"),
    dir: "assets/images",
    domains: ["raw.githubusercontent.com"],
  },
  robots: {
    robotsTxt: BASE === "/" ? true : false,
  },
  sitemap: {
    urls: async () => {
      const urls: Array<string> = [];
      const pages = await glob("./repos/website/pages/**/*.md");
      pages.map((x) => {
        let dir = basename(dirname(x));
        let p = parse(x);
        let fromroot = x.split("pages")[1];
        if (dir !== "guides" && dir !== "news") {
          const name = fromroot.replace(/\.md$/, "");
          if (p.name === "index") {
            urls.push(parse(fromroot).dir);
          } else {
            urls.push(fromroot.replace(/\.md$/, ""));
          }
        }
        if (dir === "guides") {
          urls.push(`/guides/${p.name}`);
        }
        if (dir === "news") {
          urls.push(`/news/${p.name}`);
        }
      });
      fs.readdirSync("./repos/data/").forEach((file) => {
        if (
          !file.match(
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^.)/
          )
        ) {
          const filename = file.replace(".yaml", "");
          // extendPages
          urls.push(`/model/${filename}`);
        }
      });
      return urls;
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "@/less/ease.less";@import "@/less/animations.less"; @import "@/less/global.less";`,
        },
      },
    },
    optimizeDeps: {
      exclude: ["lodash"],
    },
    plugins: [
      ViteYaml(),
      svgLoader({
        svgoConfig: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
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
    ],
  },
});
