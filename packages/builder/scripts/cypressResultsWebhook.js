#!/usr/bin/env node

const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")

const WEBHOOK_URL = process.env.CYPRESS_WEBHOOK_URL
const DASHBOARD_URL = process.env.CYPRESS_DASHBOARD_URL
const GIT_SHA = process.env.GITHUB_SHA
const GITHUB_ACTIONS_RUN_URL = process.env.GITHUB_ACTIONS_RUN_URL

async function generateReport() {
  // read the report file
  const REPORT_PATH = path.resolve(
    __dirname,
    "..",
    "cypress",
    "reports",
    "testReport.json"
  )
  const report = fs.readFileSync(REPORT_PATH, "utf-8")
  return JSON.parse(report)
}

async function discordCypressResultsNotification(report) {
  const {
    suites,
    tests,
    passes,
    pending,
    failures,
    duration,
    passPercent,
    skipped,
  } = report.stats

  const OUTCOME = failures > 0 ? "failure" : "success"

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      content: `**Nightly Tests Status**: ${OUTCOME}`,
      embeds: [
        {
          title: "Budi QA Bot",
          description: `Nightly Tests`,
          url: GITHUB_ACTIONS_RUN_URL,
          color: OUTCOME === "success" ? 3066993 : 15548997,
          timestamp: new Date(),
          footer: {
            icon_url: "http://bbui.budibase.com/budibase-logo.png",
            text: "Budibase QA Bot",
          },
          thumbnail: {
            url: "http://bbui.budibase.com/budibase-logo.png",
          },
          author: {
            name: "Budibase QA Bot",
            url: "https://discordapp.com",
            icon_url: "http://bbui.budibase.com/budibase-logo.png",
          },
          fields: [
            {
              name: "Commit",
              value: `https://github.com/Budibase/budibase/commit/${GIT_SHA}`,
            },
            {
              name: "Cypress Dashboard URL",
              value: DASHBOARD_URL || "None Supplied",
            },
            {
              name: "Github Actions Run URL",
              value: GITHUB_ACTIONS_RUN_URL || "None Supplied",
            },
            {
              name: "Test Suites",
              value: suites,
            },
            {
              name: "Tests",
              value: tests,
            },
            {
              name: "Passed",
              value: passes,
            },
            {
              name: "Pending",
              value: pending,
            },
            {
              name: "Skipped",
              value: skipped,
            },
            {
              name: "Failures",
              value: failures,
            },
            {
              name: "Duration",
              value: `${duration / 1000} Seconds`,
            },
            {
              name: "Pass Percentage",
              value: Math.floor(passPercent),
            },
          ],
        },
      ],
    }),
  }
  const response = await fetch(WEBHOOK_URL, options)

  if (response.status >= 201) {
    const text = await response.text()
    console.error(
      `Error sending discord webhook. \nStatus: ${response.status}. \nResponse Body: ${text}. \nRequest Body: ${options.body}`
    )
  }
}

async function run() {
  const report = await generateReport()
  await discordCypressResultsNotification(report)
}

run()
