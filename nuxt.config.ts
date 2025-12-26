// https://nuxt.com/docs/api/configuration/nuxt-config
import ViteYaml from "@modyfi/vite-plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";
import fs from "fs";
import { join, resolve, basename, dirname, parse } from "node:path";
import glob from "fast-glob";
import { readFileSync } from "fs";
import matter from "gray-matter";

const BASE = process.env.NUXT_APP_BASE_URL || "/";
const ISPREVIEW = process.env.NUXT_SITE_ENV === "preview";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  pages: true,
  css: ["@/assets/css/tailwind.css"],
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
  postcss: {
    plugins: {
      "@tailwindcss/postcss": true,
    },
  },
  site: {
    indexable: process.env.NUXT_SITE_ENV === "production",
    url: "https://osai-index.eu",
    name: "European Open Source AI Index",
    defaultOgImage: "/osai-index-logo.png",
    trailingSlash: false,
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
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/critters", // "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/mdc",
  ],
  image: {
    // dir: resolve(__dirname, "repos/website/"),
    dir: "repos/website",
  },
  linkChecker: {
    skipInspections: ["link-text"],
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
        if (dir !== "guides" && dir !== "news" && fromroot) {
          if (p.name === "index") {
            urls.push(parse(fromroot).dir);
          } else {
            urls.push(fromroot.replace(/\.md$/, ""));
          }
        }
      });
      // Helper function to parse frontmatter and check status
      const parseFileAndCheckStatus = (filePath: string) => {
        try {
          const content = readFileSync(filePath, "utf-8");
          const { data } = matter(content);
          return data.status === "published";
        } catch (error) {
          console.warn(`Error parsing ${filePath}:`, error);
          return false;
        }
      };

      // news+guides - only include published articles
      const newsPages = await glob("./repos/website/pages/news/**/*.md");
      const guidePages = await glob("./repos/website/pages/guides/**/*.md");

      // Add news routes (only published)
      for (const file of newsPages) {
        const isPublished = parseFileAndCheckStatus(file);
        if (isPublished) {
          const filename = parse(file).name;
          urls.push(`/news/${filename}`);
        }
      }

      // Add guides routes (only published)
      for (const file of guidePages) {
        const isPublished = parseFileAndCheckStatus(file);
        if (isPublished) {
          const filename = parse(file).name;
          urls.push(`/guides/${filename}`);
        }
      }
      // models
      const models = await glob("./repos/data/*.yaml");
      models.map((file) => {
        let name = basename(file);
        if (
          !name.match(
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^\.)/,
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
            /(a_submission_template\.yaml|^_parameters|^readme\.md|^\.)/,
          )
        ) {
          const filename = name.replace(".yaml", "");
          // extendPages
          nitroConfig.prerender?.routes?.push(
            `/model/${filename.toLowerCase()}`,
          );
        }
      });
      const newsPages = await glob("./repos/website/pages/news/**/*.md");
      const guidePages = await glob("./repos/website/pages/guides/**/*.md");
      // Add news routes
      newsPages.map((file) => {
        const filename = parse(file).name;
        nitroConfig.prerender?.routes?.push(`/news/${filename}`);
      });

      // Add guides routes
      guidePages.map((file) => {
        const filename = parse(file).name;
        nitroConfig.prerender?.routes?.push(`/guides/${filename}`);
      });
    },
    "nitro:build:public-assets": async (nitro) => {
      const publicDir = nitro.options.output.publicDir;
      fs.writeFileSync(
        join(publicDir, "CNAME"),
        process.env.NUXT_SITE_ENV === "preview"
          ? "preview.osai-index.eu"
          : "osai-index.eu",
      );
    },
    "build:before": async function () {
      const results: Record<
        string,
        Array<{
          slug: string;
          title?: string;
          date?: string;
          author?: string;
        }>
      > = {};
      const models = await glob("./repos/data/*.yaml");

      // Function to find models mentioned in guide files
      const findModelsInGuides = async (modelName: string) => {
        const guideFiles = await glob("./repos/website/pages/guides/**/*.md");
        const mentioningGuides = [];

        for (const guideFile of guideFiles) {
          try {
            const content = readFileSync(guideFile, "utf-8");
            const lines = content.split("\n");

            // Look for lines starting with "models:" and check if model is mentioned
            for (let i = 0; i < lines.length; i++) {
              const currentLine = lines[i];
              if (typeof currentLine !== "string") continue;
              const line = currentLine.trim();
              if (line.startsWith("models:")) {
                // Check this line and subsequent lines for the model name
                let j = i;
                while (j < lines.length) {
                  const currentLineAtJ = lines[j];
                  if (!currentLineAtJ) break;

                  if (
                    j !== i &&
                    !currentLineAtJ.startsWith(" ") &&
                    !currentLineAtJ.startsWith("-")
                  ) {
                    break;
                  }

                  const asYaml = matter(content).data;
                  if (
                    currentLineAtJ
                      .toLowerCase()
                      .includes(modelName.toLowerCase()) &&
                    asYaml?.status === "published"
                  ) {
                    mentioningGuides.push({
                      slug: parse(guideFile).name,
                      title: asYaml.title,
                      date: asYaml.date,
                      author: asYaml.author,
                    });
                    break;
                  }
                  j++;
                }
              }
            }
          } catch (error) {
            console.warn(`Error reading guide file ${guideFile}:`, error);
          }
        }

        return mentioningGuides;
      };

      for (let i in models) {
        const model = models[i];
        if (!model) continue;
        const filename = parse(model).name;

        // Find which guides mention this model
        const mentioningGuides = await findModelsInGuides(filename);
        if (mentioningGuides.length > 0) {
          results[filename] = mentioningGuides;
        }
      }

      try {
        fs.mkdirSync("./repos");
      } catch (err) {
        console.warn("fine");
      }
      // Log the complete results
      fs.writeFileSync(
        "./repos/models-in-guides.json",
        JSON.stringify(results, null, 2),
      );

      const modelcount = models.length;
      fs.writeFileSync(
        "./repos/modelcount.json",
        JSON.stringify({ modelcount }, null, 2),
      );
    },
  },
  mdc: {
    components: {
      map: {
        a: "a",
      },
    },
  },
  routeRules: {
    // Redirect trailing slash URLs
    "/**/**/": {
      redirect: { to: (path) => path.slice(0, -1), statusCode: 301 },
    },
  },
  vite: {
    css: {},
    plugins: [
      ViteYaml(),
      tailwindcss(),
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
