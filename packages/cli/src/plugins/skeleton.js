const fetch = require("node-fetch")
const download = require("download")
const fs = require("fs")
const os = require("os")
const { join } = require("path")
const tar = require("tar")
const { processStringSync } = require("@budibase/string-templates")

const HBS_FILES = ["package.json.hbs", "schema.json.hbs", "README.md.hbs"]

async function getSkeletonUrl(type) {
  const resp = await fetch(
    "https://api.github.com/repos/budibase/budibase-skeleton/releases/latest"
  )
  if (resp.status >= 300) {
    throw new Error("Failed to retrieve skeleton metadata")
  }
  const json = await resp.json()
  for (let asset of json["assets"]) {
    if (asset.name && asset.name.includes(type)) {
      return asset["browser_download_url"]
    }
  }
  throw new Error("No skeleton found in latest release.")
}

exports.getSkeleton = async (type, name) => {
  const url = await getSkeletonUrl(type)
  const tarballFile = join(os.tmpdir(), "skeleton.tar.gz")

  // download the full skeleton tarball
  fs.writeFileSync(tarballFile, await download(url))
  fs.mkdirSync(name)
  // extract it and get what we need
  await tar.extract({
    file: tarballFile,
    C: name,
  })
  // clear up
  fs.rmSync(tarballFile)
}

exports.fleshOutSkeleton = async (type, name, description, version) => {
  for (let file of HBS_FILES) {
    const oldFile = join(name, file),
      newFile = join(name, file.substring(0, file.length - 4))
    const hbsContents = fs.readFileSync(oldFile, "utf8")
    if (!hbsContents) {
      continue
    }
    const output = processStringSync(hbsContents, {
      name,
      description,
      version,
    })
    // write the updated file and remove the HBS file
    fs.writeFileSync(newFile, output)
    fs.rmSync(oldFile)
  }
}
