const fs = require("fs-extra")
const { join } = require("path")

const chmodr = async (dir, perms) => {
  const children = await fs.readdir(dir)
  for (let child of children) {
    const fullChildPath = join(dir, child)
    const stat = await fs.stat(join(dir, child))
    if (stat.isFile()) {
      await fs.chmod(fullChildPath, perms)
    } else {
      await chmodr(fullChildPath, perms)
    }
  }
}

module.exports = chmodr
