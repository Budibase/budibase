const fetch = require('node-fetch')
const fs = require('fs')
const util = require('util')
const streamPipeline = util.promisify(require('stream').pipeline)

async function download (url, opts, path) {
  const response = await fetch(url, opts)
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
  await streamPipeline(response.body, fs.createWriteStream(path))
}

const install = async () => {
  // get github token
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error("Missing token")
  }
  
  // get version from package.json
  let packageJson = JSON.parse(fs.readFileSync('package.json'))
  let version = packageJson.dependencies['@budibase/pro']
  if (version.startsWith('^')) {
    version = version.substring(1)
  }
  const ghVersion = `v${version}`
  
  // get the package url
  // TODO: Add semver support
  // TODO: Potentially can use yarn to download directly from github if pro becomes a non monorepo
  const resp = await fetch(`https://api.github.com/repos/budibase/budibase-pro/releases`, { 
    headers: { 
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw"  
    } 
  })

  if (!resp.ok) {
    throw new Error("Failed to get release info. Aborting")
  }
  const releases = await resp.json()
  const release = releases.filter(r => r.name === ghVersion)[0]
  const url = release.assets.filter(a => a.name === "pro.zip")[0].url
  
  console.log("Downloading pro package")
  // download the package
  await download(url, { headers: { Authorization: `token ${token}`, Accept: 'application/octet-stream' }}, './pro.zip')
}

install().catch(e => {
  console.error(e)
  process.exit(1)
})