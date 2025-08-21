// Disable pino logger before requiring any backend-core modules
process.env.DISABLE_PINO_LOGGER = "1"
const fs = require("fs")
const dotenv = require("dotenv")
const { join } = require("path")
const https = require("https")
const http = require("http")
const { URL } = require("url")

const argv = require("yargs")
  .usage("Usage: $0 [--dump <file> | --curl <curl-command>] [options]")
  .option("dump", {
    alias: "d",
    type: "string",
    describe: "Path to the JSON dump file to import",
  })
  .option("curl", {
    alias: "c",
    type: "string",
    describe: "File containing cURL command (paste from browser dev tools)",
  })
  .option("dev", {
    type: "boolean",
    default: true,
    describe: "Import to development database (default: true)",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    default: false,
    describe: "Enable verbose logging",
  })
  .option("dry-run", {
    type: "boolean",
    default: false,
    describe: "Preview what would be done without making changes",
  })
  .option("skip-assets", {
    type: "boolean",
    default: false,
    describe: "Skip uploading client assets to object store",
  })
  .check(argv => {
    if (!argv.dump && !argv.curl) {
      throw new Error("Must provide either --dump or --curl option")
    }
    if (argv.dump && argv.curl) {
      throw new Error("Cannot use both --dump and --curl options together")
    }
    return true
  })
  .example("$0 --dump ./my-app-dump.json", "Import dump to dev database")
  .example(
    "$0 --dump ./my-app-dump.json --dev=false",
    "Import to production database"
  )
  .example(
    "$0 --dump ./my-app-dump.json --dry-run --verbose",
    "Preview import with detailed logging"
  )
  .example(
    "$0 --curl ./curl-command.txt",
    "Fetch data using cURL command from file"
  )
  .help().argv

const serverDir = join(__dirname, "..", "packages", "server")
dotenv.config({ path: join(serverDir, ".env") })
const { db, objectStore } = require("@budibase/backend-core")

const {
  dump,
  curl,
  dev,
  verbose,
  "dry-run": dryRun,
  "skip-assets": skipAssets,
} = argv
let dbName

const log = (message, force = false) => {
  if (verbose || force) {
    console.log(message)
  }
}

const logError = message => {
  console.error(`❌ ${message}`)
}

const parseCurlCommand = curlCommand => {
  log("Parsing cURL command...")

  let originalUrl
  const headers = {}

  // Full cURL command - extract URL and headers
  // Try quoted URL first, then unquoted
  let urlMatch = curlCommand.match(/curl\s+['"]([^'"]+)['"]/)
  if (!urlMatch) {
    // Try unquoted URL (stops at first space followed by dash)
    urlMatch = curlCommand.match(/curl\s+([^\s]+)/)
  }
  
  if (!urlMatch) {
    throw new Error("Could not extract URL from cURL command")
  }

  originalUrl = urlMatch[1]
  log(`Extracted URL: ${originalUrl}`)

  // Extract headers from -H flags (both quoted and unquoted)
  const quotedHeaderRegex = /-H\s+['"]([^'"]+)['"]/g
  const unquotedHeaderRegex = /-H\s+([^-]+?)(?=\s+-|$)/g
  
  let headerMatch
  
  // Try quoted headers first
  while ((headerMatch = quotedHeaderRegex.exec(curlCommand)) !== null) {
    const headerLine = headerMatch[1]
    const colonIndex = headerLine.indexOf(":")
    if (colonIndex > 0) {
      const key = headerLine.substring(0, colonIndex).trim()
      const value = headerLine.substring(colonIndex + 1).trim()
      headers[key] = value
    }
  }
  
  // If no quoted headers found, try unquoted
  if (Object.keys(headers).length === 0) {
    while ((headerMatch = unquotedHeaderRegex.exec(curlCommand)) !== null) {
      const headerLine = headerMatch[1].trim()
      const colonIndex = headerLine.indexOf(":")
      if (colonIndex > 0) {
        const key = headerLine.substring(0, colonIndex).trim()
        const value = headerLine.substring(colonIndex + 1).trim()
        headers[key] = value
      }
    }
  }

  // Extract cookies from -b flag and convert to Cookie header
  let cookieMatch = curlCommand.match(/-b\s+['"]([^'"]+)['"]/)
  if (!cookieMatch) {
    // Try unquoted cookies
    cookieMatch = curlCommand.match(/-b\s+([^-]+?)(?=\s+-|$)/)
  }
  if (cookieMatch) {
    headers["Cookie"] = cookieMatch[1].trim()
  }

  log(`Extracted ${Object.keys(headers).length} headers`)

  // Extract database name from URL path
  const url = new URL(originalUrl)
  const pathParts = url.pathname.split("/").filter(part => part.length > 0)
  const dbName = pathParts[0]

  if (!dbName || !dbName.startsWith("app_")) {
    throw new Error(
      `Could not extract database name from URL path: ${url.pathname}`
    )
  }

  log(`Extracted database name: ${dbName}`)

  // Modify URL to add include_docs=true and remove other query params
  const modifiedUrl = new URL(originalUrl)
  modifiedUrl.search = "?include_docs=true"

  log(`Modified URL: ${modifiedUrl.toString()}`)

  return {
    url: modifiedUrl.toString(),
    headers,
    dbName,
    originalUrl,
  }
}

const fetchDataFromUrl = (url, headers) => {
  return new Promise((resolve, reject) => {
    log("Fetching data from URL...")

    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers,
    }

    const client = urlObj.protocol === "https:" ? https : http

    const req = client.request(options, res => {
      let data = ""

      log(`HTTP ${res.statusCode} ${res.statusMessage}`)

      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
        return
      }

      res.on("data", chunk => {
        data += chunk
      })

      res.on("end", () => {
        try {
          const json = JSON.parse(data)
          log(`Fetched ${json.rows ? json.rows.length : 0} rows`)
          resolve(json)
        } catch (err) {
          reject(new Error(`Failed to parse JSON response: ${err.message}`))
        }
      })
    })

    req.on("error", err => {
      reject(new Error(`Request failed: ${err.message}`))
    })

    req.setTimeout(30000, () => {
      req.destroy()
      reject(new Error("Request timeout after 30 seconds"))
    })

    req.end()
  })
}

const validateDumpFile = dumpPath => {
  if (!fs.existsSync(dumpPath)) {
    throw new Error(`Dump file not found: ${dumpPath}`)
  }

  const stats = fs.statSync(dumpPath)
  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${dumpPath}`)
  }

  log(
    `Found dump file: ${dumpPath} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`
  )
}

const parseDumpFile = dumpPath => {
  log("Reading and parsing dump file...")

  let dumpContents
  try {
    dumpContents = fs.readFileSync(dumpPath, "utf8")
  } catch (err) {
    throw new Error(`Failed to read dump file: ${err.message}`)
  }

  let json
  try {
    json = JSON.parse(dumpContents)
  } catch (err) {
    throw new Error(`Invalid JSON in dump file: ${err.message}`)
  }

  if (!json.rows || !Array.isArray(json.rows)) {
    throw new Error("Dump file must contain a 'rows' array")
  }

  if (json.rows.length === 0) {
    throw new Error("Dump file contains no rows")
  }

  log(`Parsed ${json.rows.length} rows from dump file`)
  return json.rows
}

const validateAndProcessRows = rawRows => {
  log("Processing and validating rows...")

  const rows = rawRows.map(row => {
    if (!row.doc) {
      throw new Error("Row missing 'doc' property")
    }
    // Remove revision to avoid conflicts
    delete row.doc._rev
    return row.doc
  })

  const metadata = rows.find(row => row._id === "app_metadata")
  if (!metadata) {
    throw new Error("No app_metadata document found in dump")
  }

  if (!metadata.appId) {
    throw new Error("app_metadata missing appId field")
  }

  if (!metadata.instance) {
    throw new Error("app_metadata missing instance field")
  }

  log(`Found app metadata for app: ${metadata.appId}`)
  return { rows, metadata }
}

const setupDatabase = metadata => {
  const uuid = metadata.appId.split("_").pop()
  if (!uuid) {
    throw new Error(`Invalid appId format: ${metadata.appId}`)
  }

  const devDbName = db.APP_DEV_PREFIX + uuid
  const prodDbName = db.APP_PREFIX + uuid
  const targetDbName = dev ? devDbName : prodDbName

  log(
    `Target database: ${targetDbName} (${dev ? "development" : "production"})`
  )

  // Update metadata for target database
  metadata.appId = targetDbName
  metadata.instance._id = targetDbName

  return { targetDbName, prodDbName }
}

const uploadAssets = async prodDbName => {
  if (skipAssets) {
    log("Skipping asset uploads")
    return
  }

  log("Uploading client assets to object store...")

  const clientJsPath = join(serverDir, "client", "budibase-client.js")
  const manifestPath = join(serverDir, "client", "manifest.json")

  if (!fs.existsSync(clientJsPath)) {
    throw new Error(`Client JS file not found: ${clientJsPath}`)
  }

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest file not found: ${manifestPath}`)
  }

  await objectStore.upload({
    bucket: objectStore.ObjectStoreBuckets.APPS,
    filename: `${prodDbName}/budibase-client.js`,
    path: clientJsPath,
  })

  await objectStore.upload({
    bucket: objectStore.ObjectStoreBuckets.APPS,
    filename: `${prodDbName}/manifest.json`,
    path: manifestPath,
  })

  log("✅ Assets uploaded successfully")
}

async function run() {
  try {
    let rawRows
    let sourceFile = dump

    if (curl) {
      // Handle cURL option - read from file
      if (!fs.existsSync(curl)) {
        throw new Error(`cURL file not found: ${curl}`)
      }

      const curlCommand = fs.readFileSync(curl, "utf8").trim()
      log(`Read cURL command from file: ${curl}`)

      const {
        url,
        headers,
        dbName: extractedDbName,
      } = parseCurlCommand(curlCommand)
      sourceFile = `${extractedDbName}.json`

      if (dryRun) {
        console.log("🔍 DRY RUN - No changes will be made")
        console.log(`Would fetch data from: ${url}`)
        console.log(`Would save to: ${sourceFile}`)
        console.log(`Headers: ${Object.keys(headers).length} headers extracted`)
        return
      }

      // Fetch data from URL
      const fetchedData = await fetchDataFromUrl(url, headers)

      // Save to file
      log(`Saving fetched data to ${sourceFile}...`)
      fs.writeFileSync(sourceFile, JSON.stringify(fetchedData, null, 2))
      log(`✅ Data saved to ${sourceFile}`)

      // Use the fetched data
      rawRows = fetchedData.rows || []
      if (rawRows.length === 0) {
        throw new Error("Fetched data contains no rows")
      }
    } else {
      // Handle dump file option
      validateDumpFile(dump)
      rawRows = parseDumpFile(dump)
    }

    // Common processing for both paths
    const { rows, metadata } = validateAndProcessRows(rawRows)
    const { targetDbName, prodDbName } = setupDatabase(metadata)

    if (dryRun && !curl) {
      console.log("🔍 DRY RUN - No changes will be made")
      console.log(
        `Would import ${rows.length} documents to database: ${targetDbName}`
      )
      if (!skipAssets) {
        console.log("Would upload client assets to object store")
      }
      return
    }

    // Execution phase
    log("Initializing database connection...")
    db.init()

    const database = db.getDB(targetDbName)
    log(`Importing ${rows.length} documents to ${targetDbName}...`)

    await database.bulkDocs(rows)
    log("✅ Documents imported successfully")

    await uploadAssets(prodDbName)

    dbName = targetDbName // Set for final message
  } catch (err) {
    logError(err.message)
    if (verbose) {
      console.error(err.stack)
    }
    process.exit(-1)
  }
}

run()
  .then(() => {
    if (!dryRun && dbName) {
      console.log(`🎉 Successfully imported app dump to database: ${dbName}`)
    }
  })
  .catch(err => {
    // Error already handled in run() function
    // This catch is just to prevent unhandled promise rejection
  })
