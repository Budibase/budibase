#!/usr/bin/env node

const { execSync, spawnSync } = require("node:child_process")

const mode = process.argv[2] || "check"

if (!["check", "fix"].includes(mode)) {
  console.error('Usage: node scripts/lintChanged.js [check|fix]')
  process.exit(1)
}

const runGit = command => {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim()
  } catch (_err) {
    return ""
  }
}

const originDefaultBranch = (() => {
  const head = runGit("git symbolic-ref refs/remotes/origin/HEAD")
  if (!head) {
    return ""
  }

  return head.replace("refs/remotes/origin/", "")
})()

const baseRef = originDefaultBranch ? `origin/${originDefaultBranch}` : "origin/master"
const mergeBase = runGit(`git merge-base ${baseRef} HEAD`) || "HEAD~1"

const changedSets = [
  runGit(`git diff --name-only --diff-filter=ACMR ${mergeBase}...HEAD`),
  runGit("git diff --name-only --diff-filter=ACMR"),
  runGit("git diff --name-only --cached --diff-filter=ACMR"),
  runGit("git ls-files --others --exclude-standard"),
]

const lintableFiles = [...new Set(changedSets.join("\n").split("\n"))].filter(
  file =>
    file.startsWith("packages/") &&
    (file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".svelte"))
)

if (lintableFiles.length === 0) {
  console.log("No changed lintable files under packages/")
  process.exit(0)
}

const resolveBin = name =>
  process.platform === "win32"
    ? `.\\node_modules\\.bin\\${name}.cmd`
    : `./node_modules/.bin/${name}`

const run = (bin, args) => {
  const result = spawnSync(resolveBin(bin), args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

if (mode === "fix") {
  run("eslint", ["--fix", "--max-warnings=0", ...lintableFiles])
  run("prettier", ["--write", ...lintableFiles])
} else {
  run("eslint", ["--max-warnings=0", ...lintableFiles])
  run("prettier", ["--check", ...lintableFiles])
}
