#!/usr/bin/env node

const owner = "Budibase"
const repo = "budibase"
const releasesUrl = `https://github.com/${owner}/${repo}/releases`
const issueUrl = `https://github.com/${owner}/${repo}/issues`
const repoPath = `${owner}/${repo}`
const escapedRepoPath = repoPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const hrefPattern = new RegExp(
  `href="(?:https://github\\.com/)?${escapedRepoPath}/(?:issues|pull)/(\\d+)"`,
  "gi"
)
const dataUrlPattern = new RegExp(
  `data-url="https://github\\.com/${escapedRepoPath}/issues/(\\d+)"`,
  "gi"
)
const mentionPattern =
  /<a class="user-mention[^>]*href="https:\/\/github\.com\/([^"/]+)"/i
const userAgent = "budibase-scripts/listReleasedIssues"

const ownerMap = new Map([
  ["Dakuan", "Dom"],
  ["andz-bb", "Andy"],
  ["PClmnt", "Peter"],
  ["deanhannigan", "Dean"],
  ["adrinr", "Adria"],
  ["melohagan", "Mel"],
  ["calexiou", "Christos"],
])

if (typeof fetch !== "function") {
  console.error(
    "This script requires Node.js v18 or newer with global fetch support"
  )
  process.exit(1)
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const fetchText = async url => {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/html",
    },
  })

  if (response.status === 429) {
    const retryAfter =
      Number.parseInt(response.headers.get("retry-after") ?? "0", 10) || 5
    await sleep(retryAfter * 1000)
    return fetchText(url)
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "<unable to read body>")
    throw new Error(
      `Request failed with ${response.status} ${response.statusText}\nURL: ${url}\nBody: ${body}`
    )
  }

  return response.text()
}

const decodeHtml = html =>
  html
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")

const stripHtml = html =>
  decodeHtml(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim()

const getWeekBounds = now => {
  const current = now ?? new Date()
  const todayUtc = new Date(
    Date.UTC(
      current.getUTCFullYear(),
      current.getUTCMonth(),
      current.getUTCDate()
    )
  )
  const day = todayUtc.getUTCDay()
  const daysSinceMonday = (day + 6) % 7

  todayUtc.setUTCDate(todayUtc.getUTCDate() - daysSinceMonday)

  const startOfThisWeek = todayUtc
  const startOfLastWeek = new Date(startOfThisWeek)
  startOfLastWeek.setUTCDate(startOfLastWeek.getUTCDate() - 7)

  return { startOfLastWeek, startOfThisWeek }
}

const extractNumbers = html => {
  const numbers = new Set()

  for (const match of html.matchAll(hrefPattern)) {
    const number = Number.parseInt(match[1], 10)
    if (!Number.isNaN(number)) {
      numbers.add(number)
    }
  }

  for (const match of html.matchAll(dataUrlPattern)) {
    const number = Number.parseInt(match[1], 10)
    if (!Number.isNaN(number)) {
      numbers.add(number)
    }
  }

  return Array.from(numbers)
}

const extractOwner = (html, fallbackText) => {
  const mentionMatch = html.match(mentionPattern)
  if (mentionMatch) {
    return mentionMatch[1]
  }

  const textMatch = fallbackText.match(/@([A-Za-z0-9-]+)/)
  if (textMatch) {
    return textMatch[1]
  }

  return "Unknown"
}

const parseReleaseSections = html => {
  const sections =
    html.match(/<section aria-labelledby="hd-[^"]+">[\s\S]*?<\/section>/g) ?? []
  return sections.map(section => {
    const nameMatch = section.match(
      /<h2 class="sr-only" id="hd-[^"]+">([\s\S]*?)<\/h2>/
    )
    const name = nameMatch ? stripHtml(nameMatch[1]) : "Unknown release"

    const publishedMatch = section.match(
      /<relative-time[^>]*datetime="([^"]+)"/
    )
    const publishedAt = publishedMatch ? new Date(publishedMatch[1]) : null

    const bodyMatch = section.match(
      /<div[^>]*class="markdown-body[^"]*"[^>]*>([\s\S]*?)<\/div>/
    )
    const bodyHtml = bodyMatch ? bodyMatch[1] : ""

    const listItems = [...bodyHtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
      match => match[1]
    )

    const entries = listItems.map(itemHtml => {
      const text = stripHtml(itemHtml)
      const numbers = extractNumbers(itemHtml)
      const firstLinkMatch = itemHtml.match(hrefPattern)
      const primaryUrl = firstLinkMatch
        ? (firstLinkMatch[0].match(/href="([^"]+)"/)?.[1] ?? null)
        : null
      const owner = extractOwner(itemHtml, text)

      let title = text
      const byIndex = title.toLowerCase().indexOf(" by ")
      if (byIndex > 0) {
        title = title.slice(0, byIndex).trim()
      }

      return {
        title: title || text,
        text,
        numbers,
        primaryUrl,
        owner,
        publishedAt,
      }
    })

    return {
      publishedAt,
      entries,
    }
  })
}

const collectReleases = async ({ since, until }) => {
  const releases = []
  let page = 1
  let reachedOlderReleases = false

  while (!reachedOlderReleases) {
    const url = page === 1 ? releasesUrl : `${releasesUrl}?page=${page}`
    const html = await fetchText(url)
    const sections = parseReleaseSections(html)

    if (sections.length === 0) {
      break
    }

    for (const section of sections) {
      if (!section.publishedAt) {
        continue
      }

      if (section.publishedAt < since) {
        reachedOlderReleases = true
      }

      if (section.publishedAt >= since && section.publishedAt < until) {
        releases.push(section)
      }
    }

    if (reachedOlderReleases) {
      break
    }

    const hasNextPage = /rel="next"/.test(html)
    if (!hasNextPage) {
      break
    }

    page += 1
  }

  return releases
}

const escapeCell = value => String(value ?? "").replace(/\|/g, "\\|")

const formatLinkLabel = (title, number, url) => {
  const type = url.includes("/pull/") ? "Pull Request" : "Issue"
  const display = `${title} · ${type} #${number} · ${repo}`
  return `[${display}](${url})`
}

const mapOwner = ownerLogin => ownerMap.get(ownerLogin) ?? ownerLogin

const main = async () => {
  const { startOfLastWeek, startOfThisWeek } = getWeekBounds()

  console.log(
    `Gathering releases published between ${startOfLastWeek.toISOString()} and ${startOfThisWeek.toISOString()}`
  )

  const releases = await collectReleases({
    since: startOfLastWeek,
    until: startOfThisWeek,
  })

  if (releases.length === 0) {
    console.log("No releases were published last week.")
    return
  }

  const rows = []

  releases.forEach(release => {
    release.entries.forEach(entry => {
      entry.numbers.forEach(number => {
        rows.push({
          number,
          title: entry.title,
          url: entry.primaryUrl ?? `${issueUrl}/${number}`,
          owner: entry.owner,
          publishedAt: entry.publishedAt,
        })
      })
    })
  })

  const uniqueRows = new Map()
  rows.forEach(row => {
    if (!uniqueRows.has(row.number)) {
      uniqueRows.set(row.number, row)
    }
  })

  const sortedRows = Array.from(uniqueRows.values()).sort(
    (a, b) => a.publishedAt - b.publishedAt || a.number - b.number
  )

  if (sortedRows.length === 0) {
    console.log(
      "No issue or pull request references were found in last week's release notes."
    )
    return
  }

  console.log("")
  console.log("| Github Link | Owner |")
  console.log("| --- | --- |")

  sortedRows.forEach(row => {
    const link = formatLinkLabel(row.title, row.number, row.url)
    const ownerCell = escapeCell(mapOwner(row.owner))
    console.log(`| ${link} | ${ownerCell} |`)
  })
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
