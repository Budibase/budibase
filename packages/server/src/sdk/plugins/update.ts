import fs from "fs"
import fetch from "node-fetch"
import semver from "semver"
import {
  Plugin,
  PluginMetadata,
  PluginSource,
  PluginType,
  PluginUpdateApplyRequest,
  PluginUpdateApplyResponse,
  PluginUpdateCheckResponse,
  PluginUpdateInfo,
  PluginUpdateResult,
} from "@budibase/types"
import { db as dbCore, tenancy } from "@budibase/backend-core"
import { githubUpload } from "../../api/controllers/plugin/github"
import { clientAppSocket } from "../../websockets"
import { sdk as pro } from "@budibase/pro"

const GITHUB_API_ROOT = "https://api.github.com/repos"
const GITHUB_ACCEPT = "application/vnd.github+json"
const USER_AGENT = "Budibase-Plugin-Updater"

interface ReleaseDetails {
  version: string
  tagName?: string
  name?: string
  htmlUrl?: string
  publishedAt?: string
  tarballUrl: string
  etag?: string
  body?: string
}

interface Candidate {
  plugin: Plugin
  release: ReleaseDetails
  metadata: PluginMetadata
}

function resolveToken(token?: string) {
  return token || process.env.GITHUB_TOKEN || ""
}

function headersForRequest(token: string) {
  const headers: Record<string, string> = {
    Accept: GITHUB_ACCEPT,
    "User-Agent": USER_AGENT,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

function normaliseVersion(version?: string) {
  if (!version) {
    return undefined
  }
  return version.startsWith("v") ? version.slice(1) : version
}

function shouldUpgrade(current: string, latest: string) {
  const currentCoerced = semver.coerce(current)
  const latestCoerced = semver.coerce(latest)
  if (currentCoerced && latestCoerced) {
    return semver.gt(latestCoerced, currentCoerced)
  }
  return current !== latest
}

function safeRemoveDirectory(directory?: string) {
  if (!directory) {
    return
  }
  try {
    if (fs.existsSync(directory)) {
      fs.rmSync(directory, { recursive: true, force: true })
    }
  } catch (err) {
    // ignore cleanup failures
  }
}

async function fetchLatestRelease(
  repo: string,
  token: string
): Promise<ReleaseDetails | null> {
  const url = `${GITHUB_API_ROOT}/${repo}/releases/latest`
  const headers = headersForRequest(token)
  const response = await fetch(url, { headers })

  if (response.status === 404) {
    return null
  }

  const data = await response.json()
  const tarballAsset = (data.assets || []).find(
    (asset: any) => asset?.content_type === "application/gzip"
  )
  const tarballUrl = tarballAsset?.browser_download_url
  if (!tarballUrl) {
    throw new Error("Github latest release url not found")
  }
  const version = normaliseVersion(data.tag_name) || normaliseVersion(data.name)
  if (!version) {
    throw new Error("Github release version not found")
  }
  return {
    version,
    tagName: data.tag_name,
    name: data.name,
    htmlUrl: data.html_url,
    publishedAt: data.published_at,
    tarballUrl,
    etag: response.headers.get("etag") || undefined,
    body: data.body,
  }
}

function buildUpdateInfo(
  plugin: Plugin,
  release: ReleaseDetails
): PluginUpdateInfo {
  return {
    pluginId: plugin._id!,
    name: plugin.name,
    currentVersion: plugin.version,
    latestVersion: release.version,
    releaseUrl: release.htmlUrl,
    releasePublishedAt: release.publishedAt,
    releaseNotes: release.body,
  }
}

function buildUpdateResult(
  plugin: Plugin,
  updatedDoc: Plugin
): PluginUpdateResult {
  return {
    pluginId: updatedDoc._id!,
    name: updatedDoc.name,
    previousVersion: plugin.version,
    updatedVersion: updatedDoc.version,
  }
}

function extractSvelteMajor(metadata: PluginMetadata): number | undefined {
  const meta: any = metadata.schema?.metadata
  if (!meta) {
    return undefined
  }
  const major = meta.svelteMajor ?? meta.svelte_major
  if (typeof major === "string") {
    const parsed = parseInt(major, 10)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  if (typeof major === "number") {
    return major
  }
  return undefined
}

async function collectCandidates(
  plugins: Plugin[],
  token: string
): Promise<{ candidates: Candidate[]; originUpdates: Plugin[] }> {
  const candidates: Candidate[] = []
  const originUpdatesMap = new Map<string, Plugin>()

  for (const plugin of plugins) {
    if (!plugin?.origin || plugin.origin.source !== "github") {
      continue
    }
    if (plugin.schema?.type !== PluginType.COMPONENT) {
      continue
    }
    try {
      const release = await fetchLatestRelease(plugin.origin.repo, token)
      if (!release) {
        continue
      }
      if (!shouldUpgrade(plugin.version, release.version)) {
        const originUpdate = {
          ...plugin.origin,
          etag: release.etag ?? plugin.origin.etag,
          latestKnownVersion: release.version,
          lastCheckedAt: new Date().toISOString(),
        }
        originUpdatesMap.set(plugin._id!, { ...plugin, origin: originUpdate })
        continue
      }

      const download = await githubUpload(plugin.origin.url, plugin.name, token)

      const svelteMajor = extractSvelteMajor(download.metadata)
      safeRemoveDirectory(download.directory)

      const originBase = {
        ...plugin.origin,
        etag: release.etag ?? plugin.origin.etag,
        latestKnownVersion: release.version,
        lastCheckedAt: new Date().toISOString(),
      }
      if (typeof svelteMajor !== "number" || svelteMajor < 5) {
        originUpdatesMap.set(plugin._id!, { ...plugin, origin: originBase })
        continue
      }

      candidates.push({
        plugin,
        release,
        metadata: download.metadata,
      })

      originUpdatesMap.set(plugin._id!, { ...plugin, origin: originBase })
    } catch (err) {
      // on error skip this plugin but continue others

      console.log(
        `Failed to evaluate plugin update for ${plugin.name}:`,
        err instanceof Error ? err.message : err
      )
    }
  }

  return {
    candidates,
    originUpdates: Array.from(originUpdatesMap.values()),
  }
}

async function fetchPlugins(pluginIds?: string[]) {
  const db = tenancy.getGlobalDB()
  let response
  if (pluginIds && pluginIds.length) {
    response = await db.allDocs({
      keys: pluginIds,
      include_docs: true,
    })
  } else {
    response = await db.allDocs(
      dbCore.getPluginParams(null, {
        include_docs: true,
      })
    )
  }

  const plugins = response.rows
    .map(row => row.doc as Plugin)
    .filter((plugin): plugin is Plugin => !!plugin)

  return { dbPlugins: plugins, db }
}

export async function checkPluginUpdates(
  options: { pluginIds?: string[]; token?: string } = {}
): Promise<PluginUpdateCheckResponse> {
  const token = resolveToken(options.token)
  const { dbPlugins, db } = await fetchPlugins(options.pluginIds)

  const { candidates, originUpdates } = await collectCandidates(
    dbPlugins,
    token
  )
  if (originUpdates.length) {
    await db.bulkDocs(originUpdates)
  }

  const updates: PluginUpdateInfo[] = candidates.map(({ plugin, release }) =>
    buildUpdateInfo(plugin, release)
  )

  return { updates }
}

export async function applyPluginUpdates(
  options: PluginUpdateApplyRequest & { token?: string } = {}
): Promise<PluginUpdateApplyResponse> {
  const token = resolveToken(options.token)
  const { dbPlugins } = await fetchPlugins(options.pluginIds)

  const updated: PluginUpdateResult[] = []
  const failed: { pluginId: string; name: string; error: string }[] = []

  for (const plugin of dbPlugins) {
    if (!plugin?.origin || plugin.origin.source !== "github") {
      continue
    }
    if (plugin.schema?.type !== PluginType.COMPONENT) {
      continue
    }

    let directory: string | undefined
    try {
      const release = await fetchLatestRelease(plugin.origin.repo, token)

      if (!release || !shouldUpgrade(plugin.version, release.version)) {
        continue
      }

      const download = await githubUpload(plugin.origin.url, plugin.name, token)
      directory = download.directory

      const svelteMajor = extractSvelteMajor(download.metadata)
      if (typeof svelteMajor !== "number" || svelteMajor < 5) {
        throw new Error("Latest release is not marked as Svelte 5 compatible")
      }

      const originUpdate = {
        ...plugin.origin,
        etag: release.etag ?? plugin.origin.etag,
        latestKnownVersion: release.version,
        lastCheckedAt: new Date().toISOString(),
      }

      const stored = await pro.plugins.storePlugin(
        download.metadata,
        directory,
        PluginSource.GITHUB,
        originUpdate
      )

      clientAppSocket?.emit("plugin-update", {
        name: stored.name,
        hash: stored.hash,
      })

      updated.push(buildUpdateResult(plugin, stored))
    } catch (err: any) {
      failed.push({
        pluginId: plugin._id!,
        name: plugin.name,
        error: err?.message || String(err),
      })
    } finally {
      safeRemoveDirectory(directory)
    }
  }

  return { updated, failed }
}
