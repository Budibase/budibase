const fs = require("fs-extra")
const { join } = require("./centralPath")
const os = require("os")
const fetch = require("node-fetch")
const stream = require("stream")
const tar = require("tar-fs")
const zlib = require("zlib")
const { promisify } = require("util")
const streamPipeline = promisify(stream.pipeline)
const { budibaseAppsDir } = require("./budibaseDir")
const env = require("../environment")
const { downloadTemplate } = require("./fileSystem")


// can't really test this, downloading is just not something we should do in a behavioural test
/* istanbul ignore next */
exports.downloadTemplate = downloadTemplate
