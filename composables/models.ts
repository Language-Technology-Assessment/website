import categories from '@/repos/data/_parameters.yml'
import info from '@/repos/data/.info.json'
import { Octokit } from 'octokit'
import yaml from 'js-yaml'
import { useDateFormat } from '@vueuse/core'

const cache = {}

const models: Ref<Array[any]> = ref([])

const params: Array<any> = []
categories.map(x => {
  x.params.map(xx => {
    xx.category = x.ref
    return params.push(xx)
  })
})

const projectsList = import.meta.glob(['@/repos/data/*.yaml','!@/repos/data/a_submission_template.yaml'], { eager: true })
let latestProjects = ref<Array<any>>([])
for (const path in projectsList) {
  const project = projectsList[path].default
  project.path = path
  project.filename = path.split('/').pop()?.replace('.yaml', '')
  if (!path.match("a_submission_template.yaml") && !path.match("_parameters.yml")) latestProjects.value.push(project)
}

const latestModels: Ref<Array[any]> = ref()

latestModels.value = sortModels(latestProjects.value)

function bg(score:number) {
    return { background: `var(--score)`, '--score': color(score)}
}

function color(score:number) {
  if (score < 0.5) {
    return `color-mix(in srgb, var(--g1), var(--g2) ${Math.round((score * 2) * 100)}%)`
  } else {
    return `color-mix(in srgb, var(--g2), var(--g3) ${Math.round(((score - 0.5) * 2) * 100)}%)`
  }
}

function sortModels(ppp: any) {
  // copy
  const prs = JSON.parse(JSON.stringify(ppp))

  // add weights
  prs.map((x, k) => {
    x.categories = {}
    x.params = {}
    const type = x.system.type
    categories.map(cat => {
      x.categories[cat.ref] = 0
      cat.params.filter(c => c.types.includes(type)).map(param => {
        let weight = 0
        if (!(param.ref in x) && x[param.ref] && x[param.ref].class) {
          x.params[param.ref] = 0
        } else {
          if (x[param.ref]?.class === 'open') {
            weight = 1
          }
          if (x[param.ref]?.class === 'partial') {
            weight = 0.5
          }
          if (x[param.ref]?.class === 'closed') {
            weight = 0
          }
          x.params[param.ref] = weight
        }
      })
      // calculate categories (average of params)
      x.categories[cat.ref] = cat.params.filter(c => c.types.includes(type)).map(xx => x.params[xx.ref]).reduce((a, b) => a + b) / cat.params.length
    })
    // calculate total average
    x.score = Object.values(x.params).reduce((a, b) => a + b) / Object.keys(x.params).length
  })
  // sort
  prs.sort((a, b) => {
    if (a.score > b.score) { return -1 }
    if (a.score < b.score) { return 1 }
    else {
      if (a.path > b.path) { return -1 }
      if (a.path < b.path) { return 1 }
      return 0
    }
  })
  // copy to object
  return prs
}

async function downloadData(version: string) {
  if (version in cache) {
    return cache[version]
  }
  const octokit = new Octokit();

  const { data } = await octokit.rest.repos.getContent({
      owner: info.owner,
      repo: info.repo,
      path: 'projects',
      ref: version
  })
  if (!Array.isArray(data)) throw Error('Not a file list.')
  
  const downloadProjectsList = []
  for (let i in data) {
    if (data[i].name !== 'a_submission_template.yaml' && data[i].name !== "_parameters.yml" && data[i].name.match(/\.yaml$/)) {
      const rawYaml = await fetch(data[i].download_url).then(x => x.text())
      const projectData = yaml.load(rawYaml)
      projectData.path = data[i].name
      projectData.filename = data[i].name
      downloadProjectsList.push(projectData)
    }
  }
  // get commit date
  var { data: metadata } = await octokit.rest.repos.getCommit({ owner: info.owner, repo: info.repo, ref: version });
  const collectedData = {
    data: sortModels(downloadProjectsList),
    version,
    date: metadata.commit.author?.date,
    url: `https://github.com/${info.owner}/${info.repo}/${version}`
  }
  cache[version] = collectedData
  return collectedData
}


export const useModels = (version?: string) => {
  const loading = ref(false)
  const date = ref('')
  const error = ref('')
  const url = ref('')
  if (typeof version === 'string' && version !== 'undefined') {
    // download version
    console.log('Download data version:', version)
    loading.value = true
    downloadData(version).then(result => {
      models.value = result.data
      loading.value = false
      date.value = unref(useDateFormat(result.date, 'DD MMM YYYY'))
      url.value = result
      error.value = ''
    }).catch(err => {
      console.warn(err)
      loading.value = false
      error.value = err
      url.value = `https://github.com/${info.owner}/${info.repo}/commit/${info.repo}`
    })
  } else {
    // use default
    models.value = latestModels.value
    date.value = unref(useDateFormat(info.date, 'DD MMM YYYY'))
    url.value = `https://github.com/${info.owner}/${info.repo}`
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
    params
  }
}
