import fs from "fs"
import path from "path"
import os from "os"
import { getSkeleton } from "./skeleton"

type MigrationResult = {
  changed: boolean
  before?: string
  after?: string
  message: string
}

type RollupTemplate = {
  source: string
  origin: "local" | "skeleton"
  location?: string
}

type AnalysisResult = {
  rollup: "needs-migration" | "looks-new" | "unknown"
  packageJson: "needs-migration" | "looks-new"
  wrapper: "needs-migration" | "looks-new" | "not-found"
  schema: "needs-migration" | "looks-new" | "not-found" | "unknown"
  canBuildAfter: boolean
  report: string[]
  rollupFile?: string
  wrapperFile?: string
  pkg: any
}

const bumpMinorVersion = (version: string | undefined): string | undefined => {
  if (!version || typeof version !== "string") return undefined
  const parts = version.trim().split(".")
  if (parts.length < 2) return undefined
  const major = Number.parseInt(parts[0], 10)
  const minor = Number.parseInt(parts[1], 10)
  const patch = parts.length > 2 ? Number.parseInt(parts[2], 10) : 0
  if (
    Number.isNaN(major) ||
    Number.isNaN(minor) ||
    Number.isNaN(patch) ||
    major < 0 ||
    minor < 0
  ) {
    return undefined
  }
  return `${major}.${minor + 1}.0`
}

export function findRollupFile(): string | undefined {
  const candidates = [
    "rollup.config.mjs",
    "rollup.config.js",
    "rollup.config.cjs",
    "rollup.config.ts",
  ]
  for (const rel of candidates) {
    const abs = path.join(process.cwd(), rel)
    if (fs.existsSync(abs)) {
      return rel
    }
  }
  return undefined
}

export function rollupLooksMigrated(source: string): boolean {
  return (
    source.includes("compilerOptions:") &&
    source.includes("componentApi: 4") &&
    source.includes("external: (id)") &&
    source.includes("svelte/store")
  )
}

// Removed inline rollup template generation.

function findFileRecursive(dir: string, filename: string): string | undefined {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isFile() && entry.name === filename) {
      return full
    }
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const found = findFileRecursive(full, filename)
      if (found) return found
    }
  }
  return undefined
}

async function loadRollupFromSkeleton(): Promise<RollupTemplate | undefined> {
  const templateCandidates: string[] = []
  if (process.env.BUDIBASE_ROLLUP_TEMPLATE) {
    templateCandidates.push(
      path.resolve(process.env.BUDIBASE_ROLLUP_TEMPLATE.trim())
    )
  }

  for (const candidate of templateCandidates) {
    if (candidate && fs.existsSync(candidate)) {
      try {
        const source = fs.readFileSync(candidate, "utf8")
        return { source, origin: "local", location: candidate }
      } catch (err: any) {
        console.error(
          `Failed to read local Rollup template at ${candidate}:`,
          err instanceof Error ? err.message : err
        )
      }
    }
  }

  const tempDir = path.join(os.tmpdir(), `bb-skeleton-${Date.now()}`)
  try {
    fs.mkdirSync(tempDir)
  } catch (err: any) {
    console.error(
      "Failed to create temporary directory:",
      err instanceof Error ? err.message : err
    )
    return undefined
  }

  const types = ["component", "datasource", "automation"]
  for (const t of types) {
    const extractDir = path.join(tempDir, t)
    try {
      await getSkeleton(t, extractDir)
      let rollupPath = path.join(extractDir, "rollup.config.mjs")
      if (!fs.existsSync(rollupPath)) {
        rollupPath = findFileRecursive(extractDir, "rollup.config.mjs") || ""
      }
      if (rollupPath && fs.existsSync(rollupPath)) {
        const content = fs.readFileSync(rollupPath, "utf8")
        return { source: content, origin: "skeleton", location: rollupPath }
      }
    } catch (_) {
      // try next type
    }
  }
  return undefined
}

export async function migrateRollupConfig(): Promise<MigrationResult> {
  const rollupFile = findRollupFile()
  let originalSource = ""
  if (rollupFile) {
    originalSource = fs.readFileSync(rollupFile, "utf8")
    if (rollupLooksMigrated(originalSource)) {
      return {
        changed: false,
        message: `${rollupFile} already looks Svelte 5 compatible. Skipping.`,
      }
    }
  }

  const backupPath = rollupFile ? `${rollupFile}.pre-svelte5` : undefined
  if (backupPath && rollupFile) {
    fs.writeFileSync(backupPath, originalSource)
  }

  const newConfigPath = "rollup.config.mjs"
  const template = await loadRollupFromSkeleton()
  if (!template) {
    return {
      changed: false,
      message:
        "Failed to retrieve canonical rollup.config.mjs from skeleton. Please check your network or update the CLI.",
    }
  }
  fs.writeFileSync(newConfigPath, template.source)

  const templateMessage =
    template.origin === "local" && template.location
      ? ` using local template at ${template.location}`
      : ""
  return {
    changed: true,
    before: rollupFile ? originalSource : undefined,
    after: template.source,
    message: backupPath
      ? `Wrote new Rollup config to ${newConfigPath}${templateMessage} (backup at ${backupPath}).`
      : `Wrote new Rollup config to ${newConfigPath}${templateMessage}.`,
  }
}

export function findWrapperFile(): string | undefined {
  const rel = path.join("lib", "Wrapper.svelte")
  const abs = path.join(process.cwd(), rel)
  if (fs.existsSync(abs)) {
    return rel
  }
  return undefined
}

export function migrateWrapper(): MigrationResult {
  const wrapperFile = findWrapperFile()
  if (!wrapperFile) {
    return {
      changed: false,
      message: "No wrapper.svelte found - skipping wrapper migration.",
    }
  }
  const src = fs.readFileSync(wrapperFile, "utf8")
  if (src.includes("<svelte:boundary>")) {
    return {
      changed: false,
      message: `${wrapperFile} already uses <svelte:boundary>. Skipping.`,
    }
  }

  const backupPath = `${wrapperFile}.pre-svelte5`
  fs.writeFileSync(backupPath, src)

  const newWrapper = `<script>
  import Component from "../src/Component.svelte"
</script>

<svelte:boundary>
  <Component {...$$restProps}>
    <slot />
  </Component>
  {#snippet failed(error, reset)}
    <div class="plugin-error">Component failed to render: {error?.message}</div>
  {/snippet}
</svelte:boundary>

<style>
  .plugin-error { color: var(--spectrum-global-color-red-500); font-size: 0.9em }
  .plugin-error:empty { display: none }
</style>
`

  fs.writeFileSync(wrapperFile, newWrapper)

  // Clean up legacy Boundary.js if present
  const legacyBoundary = path.join(path.dirname(wrapperFile), "Boundary.js")
  if (fs.existsSync(legacyBoundary)) {
    try {
      fs.unlinkSync(legacyBoundary)
    } catch (err: any) {
      console.log(
        "Failed to delete legacy Boundary.js:",
        err instanceof Error ? err.message : err
      )
    }
  }

  return {
    changed: true,
    before: src,
    after: newWrapper,
    message: `Updated ${wrapperFile} to use <svelte:boundary> and $$restProps.`,
  }
}

export function migratePackageJson(): MigrationResult {
  const pkgPath = path.join(process.cwd(), "package.json")
  if (!fs.existsSync(pkgPath)) {
    return {
      changed: false,
      message: "package.json not found",
    }
  }
  const raw = fs.readFileSync(pkgPath, "utf8")
  let json: any
  try {
    json = JSON.parse(raw)
  } catch (err: any) {
    return {
      changed: false,
      message: `Invalid package.json: ${err?.message || "parse error"}`,
    }
  }

  const before = JSON.stringify(json, null, 2)

  const previousVersion =
    typeof json.version === "string" ? json.version.trim() : undefined
  const bumpedVersion = bumpMinorVersion(previousVersion)

  if (!json.dependencies) json.dependencies = {}
  json.dependencies["svelte"] = "^5.0.0"

  json.peerDependencies = {
    ...(json.peerDependencies || {}),
    svelte: "^5.0.0",
  }

  const dev = json.devDependencies || {}
  dev["rollup"] = "^4.21.0"
  dev["@rollup/plugin-commonjs"] = "^25.0.7"
  dev["@rollup/plugin-node-resolve"] = "^15.2.3"
  dev["rollup-plugin-svelte"] = "^7.2.3"
  // retain others as-is
  if (dev["npm-run-all"]) {
    delete dev["npm-run-all"]
  }
  json.devDependencies = dev

  if (!json.scripts) json.scripts = {}
  json.scripts["build"] = "rollup -c rollup.config.mjs"
  json.scripts["watch"] = "rollup -cw rollup.config.mjs"

  if (bumpedVersion) {
    json.version = bumpedVersion
  }

  const after = JSON.stringify(json, null, 2)

  if (before === after) {
    return {
      changed: false,
      message: "package.json already appears Svelte 5 ready. Skipping.",
    }
  }

  fs.writeFileSync(`${pkgPath}.pre-svelte5`, raw)
  fs.writeFileSync(pkgPath, `${after}\n`)

  const versionMessage =
    previousVersion && bumpedVersion
      ? ` (version ${previousVersion} -> ${bumpedVersion})`
      : ""
  const message = bumpedVersion
    ? `Updated package.json for Svelte 5, Rollup 4, scripts, and version bump${versionMessage}.`
    : "Updated package.json for Svelte 5, Rollup 4, and scripts."

  return {
    changed: true,
    before,
    after,
    message,
  }
}

export function migrateSchemaJson(): MigrationResult {
  const schemaPath = path.join(process.cwd(), "schema.json")
  if (!fs.existsSync(schemaPath)) {
    return {
      changed: false,
      message: "schema.json not found - skipping schema metadata migration.",
    }
  }

  const raw = fs.readFileSync(schemaPath, "utf8")
  let json: any
  try {
    json = JSON.parse(raw)
  } catch (err: any) {
    return {
      changed: false,
      message: `Invalid schema.json: ${err?.message || "parse error"}`,
    }
  }

  const metadata =
    json && typeof json.metadata === "object" && !Array.isArray(json.metadata)
      ? json.metadata
      : {}
  const needsUpdate = metadata?.svelteMajor !== 5
  if (!needsUpdate) {
    return {
      changed: false,
      message:
        "schema.json metadata already includes svelteMajor: 5. Skipping.",
    }
  }

  const before = JSON.stringify(json, null, 2)
  const nextMetadata = { ...metadata, svelteMajor: 5 }
  json.metadata = nextMetadata
  const after = JSON.stringify(json, null, 2)

  fs.writeFileSync(`${schemaPath}.pre-svelte5`, raw)
  fs.writeFileSync(schemaPath, `${after}\n`)

  return {
    changed: true,
    before,
    after,
    message: "Updated schema.json metadata to include svelteMajor: 5.",
  }
}

export async function analysePluginForSvelte5(): Promise<AnalysisResult> {
  const report: string[] = []

  // package.json
  const pkgRaw = fs.readFileSync("package.json", "utf8")
  const pkg = JSON.parse(pkgRaw)
  const usingSvelte5 =
    pkg?.dependencies?.svelte?.startsWith("^5") ||
    pkg?.peerDependencies?.svelte?.startsWith("^5")
  const currentVersion =
    typeof pkg?.version === "string" ? pkg.version.trim() : undefined
  const projectedVersion = bumpMinorVersion(currentVersion)
  if (!usingSvelte5) {
    report.push("Will bump svelte to ^5.0.0 and align dev/peer dependencies.")
  } else {
    report.push("package.json appears to already depend on Svelte 5.")
  }
  if (
    projectedVersion &&
    currentVersion &&
    projectedVersion !== currentVersion
  ) {
    report.push(
      `Will bump package.json version from ${currentVersion} to ${projectedVersion}.`
    )
  }

  // rollup
  const rollupFile = findRollupFile()
  let rollupStatus: AnalysisResult["rollup"] = "unknown"
  if (rollupFile) {
    const rollupSource = fs.readFileSync(rollupFile, "utf8")
    if (rollupLooksMigrated(rollupSource)) {
      rollupStatus = "looks-new"
      report.push(`Rollup config ${rollupFile} already looks Svelte 5-ready.`)
    } else {
      rollupStatus = "needs-migration"
      report.push(
        `Will write Rollup 4 / Svelte 5 config and rename to rollup.config.mjs.`
      )
    }
  } else {
    rollupStatus = "unknown"
    report.push("No rollup config found - will create rollup.config.mjs.")
  }

  // wrapper
  const wrapperFile = findWrapperFile()
  let wrapperStatus: AnalysisResult["wrapper"] = "not-found"
  if (wrapperFile) {
    const wrapperSrc = fs.readFileSync(wrapperFile, "utf8")
    if (wrapperSrc.includes("<svelte:boundary>")) {
      wrapperStatus = "looks-new"
      report.push(`${wrapperFile} already uses <svelte:boundary>.`)
    } else {
      wrapperStatus = "needs-migration"
      report.push(
        `Will update ${wrapperFile} to use <svelte:boundary>, $$restProps, and error UI.`
      )
    }
  } else {
    report.push("No wrapper.svelte found - skipping wrapper migration.")
  }

  // schema
  let schemaStatus: AnalysisResult["schema"] = "unknown"
  if (fs.existsSync("schema.json")) {
    try {
      const schemaRaw = fs.readFileSync("schema.json", "utf8")
      const schemaJson = JSON.parse(schemaRaw)
      const metadata =
        schemaJson &&
        typeof schemaJson.metadata === "object" &&
        !Array.isArray(schemaJson.metadata)
          ? schemaJson.metadata
          : {}
      if (metadata.svelteMajor === 5) {
        schemaStatus = "looks-new"
        report.push("schema.json metadata already declares svelteMajor: 5.")
      } else {
        schemaStatus = "needs-migration"
        report.push("Will update schema.json metadata to set svelteMajor: 5.")
      }
    } catch (err: any) {
      schemaStatus = "unknown"
      report.push(
        `schema.json could not be parsed - please fix JSON before migration (${err?.message || "parse error"}).`
      )
    }
  } else {
    schemaStatus = "not-found"
    report.push("schema.json not found - cannot update metadata.")
  }

  const packageJsonStatus: AnalysisResult["packageJson"] = usingSvelte5
    ? "looks-new"
    : "needs-migration"

  return {
    report,
    rollup: rollupStatus,
    packageJson: packageJsonStatus,
    wrapper: wrapperStatus,
    schema: schemaStatus,
    canBuildAfter: true,
    rollupFile,
    wrapperFile,
    pkg,
  }
}

export async function runSvelte5Migration() {
  const pkgRes = migratePackageJson()
  const schemaRes = migrateSchemaJson()
  const rollupRes = await migrateRollupConfig()
  const wrapperRes = migrateWrapper()
  return { pkgRes, schemaRes, rollupRes, wrapperRes }
}
