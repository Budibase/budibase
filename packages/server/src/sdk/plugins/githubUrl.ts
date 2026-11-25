export const normaliseGithubUrl = (url: string): string | undefined => {
  try {
    let gh = url.trim()
    if (!gh) return

    if (!gh.startsWith("http")) {
      gh = `https://${gh}`
    }
    if (gh.endsWith("/")) {
      gh = gh.slice(0, -1)
    }
    return gh
  } catch (err) {
    console.log(
      "Failed to normalise GitHub URL:",
      url,
      err instanceof Error ? err.message : String(err)
    )
    return
  }
}

export const parseGithubRepo = (
  url?: string
): { repo?: string; url?: string } => {
  if (!url) return {}
  try {
    const gh = normaliseGithubUrl(url)
    if (!gh) {
      return {}
    }
    const parsedUrl = new URL(gh)
    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "github.com" ||
      parsedUrl.username ||
      parsedUrl.password ||
      parsedUrl.port
    ) {
      return {}
    }
    const parts = parsedUrl.pathname.slice(1).split("/")
    if (parts.length >= 2 && parts[0] && parts[1]) {
      const owner = parts[0]
      const repo = parts[1]
      return {
        repo: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
      }
    }
  } catch (err) {
    console.log(
      "Failed to parse GitHub repo:",
      url,
      err instanceof Error ? err.message : String(err)
    )
  }
  return {}
}
