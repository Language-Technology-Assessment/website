import { defineNuxtModule, createResolver, extendPages } from "@nuxt/kit";
import { Octokit } from "@octokit/rest";
import { pipeline } from "node:stream/promises";
import fs from "fs";
import * as tar from "tar";
import dotenv from "dotenv";
import { resolve } from "node:path";
dotenv.config();

function writeInfo({
  owner,
  repo,
  infoPath,
  info,
}: {
  owner: string;
  repo: string;
  infoPath: string;
  info: any;
}) {
  fs.writeFileSync(
    infoPath,
    JSON.stringify({
      owner,
      repo,
      hash: info.data[0].sha,
      // author: info.data[0].author.login,
      date: info.data[0].commit.author.date,
      url: info.data[0].url.replace(
        "https://api.github.com/repos/",
        "https://github.com/"
      ),
    }),
    "utf8"
  );
}

export default defineNuxtModule({
  meta: {
    name: "github module",
    configKey: "githuboptions",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  setup(moduleOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.hook("build:before", async () => {
      // check if github options are defined
      // console.log(JSON.stringify(moduleOptions, null, " "));
      // if (!('githuboptions' in nuxt.options) || !nuxt.options.githuboptions || !Array.isArray(nuxt.options.githuboptions)) return
      if (
        !("repositories" in moduleOptions) ||
        !Array.isArray(moduleOptions.repositories)
      ) {
        return;
      }
      // check if .env githubtoken exists
      if (!process.env.githubtoken) return;
      // loop through repositories
      for (let i in moduleOptions.repositories) {
        await getRepo(moduleOptions.repositories[i]);
      }
    });
  },
});

async function getRepo({
  owner,
  repo,
  local,
  name,
}: {
  owner: string;
  repo: string;
  local?: string;
  name: string;
}) {
  // do nothing if local folder is used
  if (local && process.env.local) {
    console.log(`Using local github folder: ${local}`);
    return;
  }

  const githubtoken = process.env.githubtoken;
  const rootdir = resolve(__dirname, "../repos");
  const dir = resolve(rootdir, name);
  const infoPath = resolve(dir, ".info.json");

  // define GITHUBMODULE=true in local dev .env, otherwise using github action to include all repos
  if (!process.env.GITHUBMODULE) {
    if (!fs.existsSync(infoPath)) {
      // add info to .info.json
      const octokit = new Octokit({ auth: githubtoken });
      const info = await octokit.rest.repos.getCommit({ owner, repo });
      writeInfo({ owner, repo, infoPath, info });
    }
    return;
  }

  const octokit = new Octokit({ auth: githubtoken });

  // check if update is needed
  console.log("----- check if update is needed -----");
  const info = await octokit.rest.repos.getCommit({ owner, repo });

  if (fs.existsSync(infoPath)) {
    const { hash } = JSON.parse(fs.readFileSync(infoPath, "utf8"));
    if (info?.data && hash === String(info.data[0].sha)) {
      console.log(`No update needed (${hash})`);
      return;
    }
  }

  // prepare ./repos directory
  if (!fs.existsSync(rootdir)) {
    try {
      fs.mkdirSync(rootdir);
    } catch (err) {
      console.warn(err);
      throw Error(
        `Could not create repos directoy for github repository ${owner}/${repo}.`
      );
    }
  } else if (fs.existsSync(dir)) {
    // remove existing directory to start clean
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (err) {
      console.warn(err);
      throw Error(
        `Could not delete existing directory for github repository ${owner}/${repo}.`
      );
    }
  }

  // create repo directory
  try {
    fs.mkdirSync(dir);
  } catch (err) {
    console.warn(err);
    throw Error(
      `Could not create directory ${dir} for github repository ${owner}/${repo}.`
    );
  }

  // start downloading
  console.log(`Start download ${owner}/${repo}...`);

  // fetch content
  const response = await octokit.repos.downloadTarballArchive({
    owner,
    repo,
    ref: process.env.NUXT_SITE_ENV === "preview" ? "preview" : "HEAD",
  });
  const buffer = Buffer.from(response.data);
  fs.writeFileSync("./repo.tar", buffer);

  await tar.x({ f: "./repo.tar", C: dir, strip: 1 });

  fs.rmSync("./repo.tar");

  writeInfo({ owner, repo, infoPath, info });

  console.log(`Done (${info.data[0].sha})`);
}
