#!/usr/bin/env node

const { execFileSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const slackPostMessageUrl = "https://slack.com/api/chat.postMessage"

const loadDotEnv = () => {
  const envPath = path.join(process.cwd(), ".env")

  if (!fs.existsSync(envPath)) {
    return
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)

    if (!match) {
      continue
    }

    const key = match[1]

    if (process.env[key] !== undefined) {
      continue
    }

    const value = match[2] || ""

    process.env[key] = value
      .replace(/^(['"])(.*)\1$/, "$2")
      .replace(/\\n/g, "\n")
  }
}

loadDotEnv()

const run = (command, args) =>
  execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim()

const getArgs = () => {
  const args = new Set(process.argv.slice(2))
  return {
    dryRun: args.has("--dry-run"),
  }
}

const getLatestReleaseTag = () =>
  process.env.TAG ||
  run("gh", ["release", "view", "--json", "tagName", "-q", ".tagName"])

const getReleaseCommitDate = tag =>
  run("git", ["log", "-1", "--format=%aI", tag])

const getPendingPullRequests = since =>
  JSON.parse(
    run("gh", [
      "pr",
      "list",
      "--state",
      "merged",
      "--base",
      "master",
      "--search",
      `merged:>${since}`,
      "--limit",
      "100",
      "--json",
      "number,title,author,url,mergedAt",
    ])
  )

const truncate = (value, length) => {
  if (value.length <= length) {
    return value
  }

  return `${value.slice(0, length - 3)}...`
}

const formatDate = value =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value))

const formatDateTime = value =>
  `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(value))} UTC`

const formatAuthor = author => author?.login || "unknown"

const pad = (value, length) => value.padEnd(length, " ")

const formatTable = pullRequests => {
  if (!pullRequests.length) {
    return "No merged PRs pending release."
  }

  const rows = pullRequests.map(pr => ({
    pr: `#${pr.number}`,
    merged: formatDate(pr.mergedAt),
    author: formatAuthor(pr.author),
    title: truncate(pr.title.replace(/\s+/g, " "), 76),
  }))

  const widths = {
    pr: Math.max("PR".length, ...rows.map(row => row.pr.length)),
    merged: Math.max("Merged".length, ...rows.map(row => row.merged.length)),
    author: Math.max("Author".length, ...rows.map(row => row.author.length)),
    title: Math.max("Title".length, ...rows.map(row => row.title.length)),
  }

  const header = [
    pad("PR", widths.pr),
    pad("Merged", widths.merged),
    pad("Author", widths.author),
    pad("Title", widths.title),
  ].join("  ")

  const divider = [
    "-".repeat(widths.pr),
    "-".repeat(widths.merged),
    "-".repeat(widths.author),
    "-".repeat(widths.title),
  ].join("  ")

  const body = rows
    .map(row =>
      [
        pad(row.pr, widths.pr),
        pad(row.merged, widths.merged),
        pad(row.author, widths.author),
        pad(row.title, widths.title),
      ].join("  ")
    )
    .map(row => row.trimEnd())
    .join("\n")

  return [header, divider, body].join("\n")
}

const buildText = ({ tag, releaseCommitDate, pullRequests }) => {
  const title = `Pending releases since ${tag}`
  const context = `${pullRequests.length} merged PR${
    pullRequests.length === 1 ? "" : "s"
  } after ${formatDateTime(releaseCommitDate)}`
  const table = formatTable(pullRequests)

  return `*${title}*\n${context}\n\`\`\`\n${table}\n\`\`\``
}

const slackRequest = async (url, token, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()

  if (!response.ok || !data.ok) {
    const scopes = [
      data.error || `${response.status} ${response.statusText}`,
      data.needed ? `needed: ${data.needed}` : "",
      data.provided ? `provided: ${data.provided}` : "",
    ].filter(Boolean)

    throw new Error(scopes.join("\n"))
  }

  return data
}

const postToSlack = async ({ tag, releaseCommitDate, pullRequests }) => {
  const token = process.env.SLACK_BOT_TOKEN
  const channel = process.env.SLACK_CHANNEL_ID

  if (!channel) {
    throw new Error("SLACK_CHANNEL_ID is required to post pending releases")
  }

  const text = buildText({ tag, releaseCommitDate, pullRequests })

  await slackRequest(slackPostMessageUrl, token, {
    channel,
    text,
    mrkdwn: true,
    unfurl_links: false,
  })
}

const main = async () => {
  const { dryRun } = getArgs()
  const tag = getLatestReleaseTag()
  const releaseCommitDate = getReleaseCommitDate(tag)
  const pullRequests = getPendingPullRequests(releaseCommitDate)
  const text = buildText({ tag, releaseCommitDate, pullRequests })

  if (dryRun || !process.env.SLACK_BOT_TOKEN) {
    console.log(text)
    return
  }

  await postToSlack({ tag, releaseCommitDate, pullRequests })
  console.log(`Posted ${pullRequests.length} pending release PRs to Slack`)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
