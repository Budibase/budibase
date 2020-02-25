import { mkdir } from "fs"
import { join } from "path"
import { promisify } from "es6-promisify"

const mkdirp = promisify(mkdir)

const getConfig = async () => {
  const config = {
    local: {
      root: "./output/local/files",
    },
    memory: {},
  }

  await mkdirp("./output")

  for (let type in config) {
    await mkdirp(join("output", type))
  }

  await mkdirp("./output/local/files")

  return config
}

export default getConfig
