import fetch from "node-fetch"
import { type GetGitHubStarsResponse, type UserCtx } from "@budibase/types"

const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const FAILURE_TTL_MS = 5 * 60 * 1000
const GITHUB_REPO_URL = "https://api.github.com/repos/budibase/budibase"
const USER_AGENT = "Budibase"

let cache: {
  value: GetGitHubStarsResponse
  expiresAt: number
} = {
  value: { stars: null, fetchedAt: null },
  expiresAt: 0,
}

export async function getStars(ctx: UserCtx<void, GetGitHubStarsResponse>) {
  if (cache.expiresAt > Date.now()) {
    ctx.body = cache.value
    return
  }

  try {
    const response = await fetch(GITHUB_REPO_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub response: ${response.status}`)
    }

    const json = (await response.json()) as { stargazers_count?: number }
    const stars = json.stargazers_count

    if (typeof stars !== "number") {
      throw new Error("GitHub stars missing")
    }

    cache = {
      value: { stars, fetchedAt: new Date().toISOString() },
      expiresAt: Date.now() + CACHE_TTL_MS,
    }

    ctx.body = cache.value
  } catch (err) {
    console.error("Failed to fetch GitHub stars", err)
    cache.expiresAt = Date.now() + FAILURE_TTL_MS
    ctx.body = cache.value
  }
}
