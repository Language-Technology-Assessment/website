import info from "@/repos/data/.info.json";
// import { load } from "js-yaml";
import { useDateFormat } from "@vueuse/core";

import categories_current from "@/repos/data/_parameters.yml";
import descriptions_current from "@/repos/data/_parameters-descriptions.yml";

const cache: any = {};

const models: Ref<any[]> = ref([]);

const categories = ref(categories_current);
const params: Ref<Array<any>> = ref(getParams(categories.value));
const descriptions = ref(descriptions_current);

function getParams(cats: Array<any>) {
  let ps = [];
  cats.map((x) => {
    x.params.map((xx) => {
      xx.category = x.ref;
      return ps.push(xx);
    });
  });
  return ps;
}

const projectsList = import.meta.glob(
  ["@/repos/data/*.yaml", "!@/repos/data/a_submission_template.yaml"],
  { eager: true }
);
let latestProjects = ref<any[]>([]);
if (projectsList) {
  for (const path in projectsList) {
    try {
      const project = projectsList[path].default;
      project.path = path;
      project.filename = path.split("/").pop()?.replace(".yaml", "");
      if (
        !path.match("a_submission_template.yaml") &&
        !path.match(/^_parameters/)
      ) {
        latestProjects.value.push(project);
      }
    } catch (err) {
      console.log("Error in:", path);
      console.error(err);
    }
  }
}

const latestModels = ref<any[]>([]);

latestModels.value = sortModels(latestProjects.value);

function bg(score: number) {
  return { background: `var(--score)`, "--score": color(score) };
}

function color(score: number) {
  if (score < 0.5) {
    return `color-mix(in srgb, var(--g1), var(--g2) ${Math.round(
      score * 2 * 100
    )}%)`;
  } else {
    return `color-mix(in srgb, var(--g2), var(--g3) ${Math.round(
      (score - 0.5) * 2 * 100
    )}%)`;
  }
}

function sortModels(ppp: any) {
  // copy
  const prs = JSON.parse(JSON.stringify(ppp));

  // add weights
  prs.map((x, k) => {
    x.categories = {};
    x.params = {};
    const types = x.system.type.split(",").map((x) => x.trim());
    categories.value.map((cat) => {
      x.categories[cat.ref] = 0;
      cat.params
        .filter((c) => c.types.some((item: string) => types.includes(item)))
        .map((param) => {
          let weight = 0;
          if (!(param.ref in x) && x[param.ref] && x[param.ref].class) {
            x.params[param.ref] = 0;
          } else {
            if (x[param.ref]?.class === "open") {
              weight = 1;
            }
            if (x[param.ref]?.class === "partial") {
              weight = 0.5;
            }
            if (x[param.ref]?.class === "closed") {
              weight = 0;
            }
            x.params[param.ref] = weight;
          }
        });
      // calculate categories (average of params linked to types)
      const catparams = cat.params
        .filter((c) =>
          c.types.some((item: string) => types.includes(item.trim()))
        )
        .map((xx) => x.params[xx.ref]);
      x.categories[cat.ref] =
        catparams.reduce((a, b) => a + b) / catparams.length;
    });
    // calculate total average
    x.score =
      Object.values(x.params).reduce((a, b) => a + b) /
      Object.keys(x.params).length;
  });
  // sort
  prs.sort((a, b) => {
    if (a.score > b.score) {
      return -1;
    }
    if (a.score < b.score) {
      return 1;
    } else {
      if (a.path > b.path) {
        return -1;
      }
      if (a.path < b.path) {
        return 1;
      }
      return 0;
    }
  });
  // copy to object
  return prs;
}

async function downloadData(version: string) {
  if (version in cache) {
    return cache[version];
  }

  const { Octokit } = await import("@octokit/rest");
  const { load } = await import("js-yaml");

  const octokit = new Octokit();

  const { data } = await octokit
    .request(`GET /repos/${info.owner}/${info.repo}/contents/`, {
      owner: info.owner,
      repo: info.repo,
      path: "/",
      version,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .catch((err) => {
      throw Error(err);
    });

  if (!Array.isArray(data)) throw Error("Not a file list.");

  const downloadProjectsList = [];
  let downloaded_categories = {};
  let downloaded_params: any[] = [];
  let downloaded_descriptions = {};
  for (let i in data) {
    if (
      data[i].name !== "a_submission_template.yaml" &&
      !data[i].name.match(/^_parameters/) &&
      data[i].name.match(/\.yaml$/)
    ) {
      const rawYaml = await fetch(data[i].download_url).then((x) => x.text());
      const projectData: any = load(rawYaml);
      projectData.path = data[i].name;
      projectData.filename = data[i].name;
      downloadProjectsList.push(projectData);
    }
    const found_parameters_descriptions = data.find(
      (x) => x.name === "_parameters-descriptions.yml"
    );
    if (found_parameters_descriptions) {
      const rawYaml = await fetch(found_parameters_descriptions.download_url)
        .then((x) => x.text())
        .catch(console.warn);
      if (rawYaml) {
        const loadedYaml: any = load(rawYaml);
        downloaded_descriptions = loadedYaml;
      }
    }
    const found_parameters = data.find((x) => x.name === "_parameters.yml");
    if (found_parameters_descriptions && found_parameters?.download_url) {
      const rawYaml = await fetch(found_parameters.download_url)
        .then((x) => x.text())
        .catch(console.warn);
      if (rawYaml) {
        const loadedYaml: any = load(rawYaml);
        downloaded_params = [];
        loadedYaml.map((x) => {
          x.params.map((xx) => {
            xx.category = x.ref;
            return downloaded_params.push(xx);
          });
        });
      }
    }
  }
  // get commit date
  var { data: metadata } = await octokit.rest.repos.getCommit({
    owner: info.owner,
    repo: info.repo,
    ref: version,
  });
  const collectedData = {
    data: sortModels(downloadProjectsList),
    params: downloaded_params,
    categories: downloaded_categories,
    descriptions: downloaded_descriptions,
    version,
    date: metadata.commit.author?.date,
    url: `https://github.com/${info.owner}/${info.repo}/${version}`,
  };
  cache[version] = collectedData;
  return collectedData;
}

export const useModels = (version?: string) => {
  const loading = ref(false);
  const date = ref("");
  const error = ref("");
  const url = ref("");

  if (typeof version === "string" && version !== "undefined") {
    // download version
    console.log("Download data version:", version);
    loading.value = true;
    downloadData(version)
      .then((result) => {
        models.value = result.data;
        loading.value = false;
        descriptions.value =
          Object.keys(result.descriptions).length > 0
            ? result.descriptions
            : descriptions_current;
        categories.value =
          Object.keys(result.categories).length > 0
            ? result.categories
            : categories_current;
        if (result.params.length > 0) params: result.params;
        else {
          params.value = getParams(categories.value);
        }
        date.value = unref(useDateFormat(result.date, "DD MMM YYYY"));
        url.value = result;
        error.value = "";
      })
      .catch((err) => {
        console.warn(err);
        loading.value = false;
        error.value = err;
        url.value = `https://github.com/${info.owner}/${info.repo}/commit/${info.repo}`;
      });
  } else {
    // use default
    models.value = latestModels.value;
    date.value = unref(useDateFormat(info.date, "DD MMM YYYY"));
    url.value = `https://github.com/${info.owner}/${info.repo}`;
  }

  return {
    loading,
    date,
    url,
    error,
    latestInfo: info,
    models,
    sortModels,
    categories,
    bg,
    color,
    params,
    descriptions,
  };
};
