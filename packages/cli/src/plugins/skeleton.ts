import fetch from "node-fetch"
import fs from "fs"
import os from "os"
import { join } from "path"
import { processStringSync } from "@budibase/string-templates"

const download = require("download")
const tar = require("tar")

const HBS_FILES = ["package.json.hbs", "schema.json.hbs", "README.md.hbs"]

async function getSkeletonUrl(type: string) {
  const resp = await fetch(
    "https://api.github.com/repos/budibase/budibase-skeleton/releases/latest"
  )
  if (resp.status >= 300) {
    throw new Error("Failed to retrieve skeleton metadata")
  }
  const json = (await resp.json()) as { assets: any[] }
  for (let asset of json["assets"]) {
    if (asset.name && asset.name.includes(type)) {
      return asset["browser_download_url"]
    }
  }
  throw new Error("No skeleton found in latest release.")
}

export async function getSkeleton(type: string, name: string) {
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

export async function fleshOutSkeleton(
  type: string,
  name: string,
  description: string,
  version: string
) {
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
