import fetch from "node-fetch"
import { type GetGitHubStarsResponse, type UserCtx } from "@budibase/types"
import { cache } from "@budibase/backend-core"

const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const FAILURE_TTL_MS = 5 * 60 * 1000
const GITHUB_TIMEOUT_MS = 5000
const GITHUB_REPO_URL = "https://api.github.com/repos/budibase/budibase"
const USER_AGENT = "Budibase"

const CACHE_KEY = "global:github:stars"
const RETENTION_TTL_SECONDS = 30 * 24 * 60 * 60

interface StarsCacheEnvelope {
  value: GetGitHubStarsResponse
  expiresAt: number
}

export async function getStars(ctx: UserCtx<void, GetGitHubStarsResponse>) {
  const envelope = (await cache.get(CACHE_KEY, {
    useTenancy: false,
  })) as StarsCacheEnvelope | null
  if (envelope && envelope.expiresAt > Date.now()) {
    ctx.body = envelope.value
    return
  }

  try {
    const response = await fetch(GITHUB_REPO_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
      timeout: GITHUB_TIMEOUT_MS,
    })

    if (!response.ok) {
      throw new Error(`GitHub response: ${response.status}`)
    }

    const json = (await response.json()) as { stargazers_count?: number }
    const stars = json.stargazers_count

    if (typeof stars !== "number") {
      throw new Error("GitHub stars missing")
    }

    const value: GetGitHubStarsResponse = {
      stars,
      fetchedAt: new Date().toISOString(),
    }
    const toStore: StarsCacheEnvelope = {
      value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }

    await cache.store(CACHE_KEY, toStore, RETENTION_TTL_SECONDS, {
      useTenancy: false,
    })

    ctx.body = value
  } catch (err) {
    console.error("Failed to fetch GitHub stars", err)

    const value = envelope?.value || { stars: null, fetchedAt: null }
    const toStore: StarsCacheEnvelope = {
      value,
      expiresAt: Date.now() + FAILURE_TTL_MS,
    }

    await cache.store(CACHE_KEY, toStore, RETENTION_TTL_SECONDS, {
      useTenancy: false,
    })

    ctx.body = value
  }
}
