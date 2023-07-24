#!/usr/bin/env node

const fetch = require("node-fetch")
const path = require("path")
const fs = require("fs")

const WEBHOOK_URL = process.env.WEBHOOK_URL
const GIT_SHA = process.env.GITHUB_SHA
const GITHUB_ACTIONS_RUN_URL = process.env.GITHUB_ACTIONS_RUN_URL

async function generateReport() {
  // read the report file
  const REPORT_PATH = path.resolve(__dirname, "..", "testResults.json")
  const report = fs.readFileSync(REPORT_PATH, "utf-8")
  return JSON.parse(report)
}

const env = process.argv.slice(2)[0]

if (!env) {
  throw new Error("environment argument is required")
}

async function discordResultsNotification(report) {
  const {
    numTotalTestSuites,
    numTotalTests,
    numPassedTests,
    numPendingTests,
    numFailedTests,
    success,
    startTime,
    endTime,
  } = report

  const OUTCOME = success ? "success" : "failure"

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      content: `**Tests Status**: ${OUTCOME}`,
      embeds: [
        {
          title: `Budi QA Bot - ${env}`,
          description: `API Integration Tests`,
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
              name: "Github Actions Run URL",
              value: GITHUB_ACTIONS_RUN_URL || "None Supplied",
            },
            {
              name: "Test Suites",
              value: numTotalTestSuites,
            },
            {
              name: "Tests",
              value: numTotalTests,
            },
            {
              name: "Passed",
              value: numPassedTests,
            },
            {
              name: "Pending",
              value: numPendingTests,
            },
            {
              name: "Failures",
              value: numFailedTests,
            },
            {
              name: "Duration",
              value: endTime
                ? `${(endTime - startTime) / 1000} Seconds`
                : "DNF",
            },
            {
              name: "Pass Percentage",
              value: Math.floor((numPassedTests / numTotalTests) * 100),
            },
          ],
        },
      ],
    }),
  }

  // Only post in discord when tests fail
  if (success) {
    return
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
  await discordResultsNotification(report)
}

run()
