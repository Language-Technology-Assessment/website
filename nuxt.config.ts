// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from "@modyfi/vite-plugin-yaml";
import svgLoader from "vite-svg-loader";
import fs from "fs";
import { join, resolve, basename, dirname, parse } from "node:path";
import glob from "fast-glob";

const BASE = process.env.NUXT_APP_BASE_URL || "/";
const ISPREVIEW = process.env.NUXT_SITE_ENV === "preview";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  pages: true,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [
        {
          rel: "icon",
          href: `${BASE}favicon.svg`,
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: `${BASE}favicon.png`,
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
      posthogPublicKey: "phc_hoxK6NUuVi0AWHTEMWYszchraAZ0BcAQgjq15fC6LeH",
      posthogHost: "https://eu.i.posthog.com",
    },
  },
  site: {
    indexable: process.env.NUXT_SITE_ENV === "production",
    url: "https://osai-index.eu",
    name: "European Open Source AI Index",
    defaultOgImage: "/osai-index-logo.png",
  },

  i18n: {
    baseUrl: "https://osai-index.eu",
    strategy: "no_prefix",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        language: "en-US",
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
    dir: "repos/website",
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
      const models = await glob("./repos/data/*.yaml");
      models.map((file) => {
        let name = basename(file);
        if (
          !name.match(
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^\.)/
          )
        ) {
          const filename = name.replace(".yaml", "");
          // extendPages
          urls.push(`/model/${filename.toLowerCase()}`);
        }
      });
      return urls;
    },
  },
  hooks: {
    async "nitro:config"(nitroConfig) {
      const models = await glob("./repos/data/*.yaml");
      models.map((file) => {
        let name = basename(file);
        if (
          !name.match(
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^\.)/
          )
        ) {
          const filename = name.replace(".yaml", "");
          // extendPages
          nitroConfig.prerender.routes?.push(
            `/model/${filename.toLowerCase()}`
          );
        }
      });
    },
    "nitro:build:public-assets": async (nitro) => {
      const publicDir = nitro.options.output.publicDir;
      fs.writeFileSync(
        join(publicDir, "CNAME"),
        process.env.NUXT_SITE_ENV === "preview"
          ? "preview.osai-index.eu"
          : "osai-index.eu"
      );
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
