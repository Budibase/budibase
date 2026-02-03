const fs = require("fs")
const { join } = require("path")
const { tmpdir } = require("os")

const DEV_VER_FILENAME = "dev-version.txt"
fs.rmSync(join(tmpdir(), ".budibase", DEV_VER_FILENAME), { force: true })
