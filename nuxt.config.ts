// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from "@modyfi/vite-plugin-yaml";
import ViteMarkdown from "vite-plugin-markdown";
import svgLoader from "vite-svg-loader";
import fs from "fs";
import { resolve, basename, join, dirname, parse } from "node:path";
import glob from "fast-glob";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [
        {
          rel: "icon",
          href: "/logo.svg",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: "/logo.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          href: "/logo-dark.svg",
          media: "(prefers-color-scheme: dark)",
        },
        {
          rel: "icon",
          href: "/logo-dark.png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
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
  content: {
    sources: {
      content: {
        driver: "fs",
        base: resolve(__dirname, "repos/website/pages"),
      },
    },
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
    "@nuxt/content",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
  ],
  image: {
    dir: resolve(__dirname, "repos/website/"),
    domains: ["raw.githubusercontent.com"],
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
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^\.github|^\.info)/
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
      ViteMarkdown({ mode: ["html"] }),
    ],
  },
});
