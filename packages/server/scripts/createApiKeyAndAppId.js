// THIS will create API Keys and App Ids input in a local Dynamo instance if it is running
const dynamoClient = require("../src/db/dynamoClient")

if (process.argv[2] == null || process.argv[3] == null) {
  console.error(
    "Inputs incorrect format, was expecting: node createApiKeyAndAppId.js <API_KEY> <APP_ID>"
  )
  process.exit(-1)
}

const FAKE_STRING = "fakestring"

// set fake credentials for local dynamo to actually work
process.env.AWS_ACCESS_KEY_ID = "KEY_ID"
process.env.AWS_SECRET_ACCESS_KEY = "SECRET_KEY"
dynamoClient.init("http://localhost:8333")

async function run() {
  await dynamoClient.apiKeyTable.put({
    item: {
      pk: process.argv[2],
      accountId: FAKE_STRING,
      trackingId: FAKE_STRING,
      quotaReset: Date.now() + 2592000000,
      usageQuota: {
        automationRuns: 0,
        rows: 0,
        storage: 0,
        users: 0,
        views: 0,
      },
      usageLimits: {
        automationRuns: 10,
        rows: 10,
        storage: 1000,
        users: 10,
        views: 10,
      },
    },
  })
  await dynamoClient.apiKeyTable.put({
    item: {
      pk: process.argv[3],
      apiKey: process.argv[2],
    },
  })
}

run()
  .then(() => {
    console.log("Rows should have been created.")
  })
  .catch(err => {
    console.error("Cannot create rows - " + err)
  })
