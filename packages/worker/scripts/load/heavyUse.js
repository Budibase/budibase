const fetch = require("node-fetch")

const MAX_RUNTIME_SEC = 600
const HOST = "http://localhost:10000"
const TENANT_ID = "default"
const RATE_MS = 500

let API_KEY = process.argv[2]
let STATS = {
  iterations: 0,
  error: 0,
  success: 0,
}

if (!API_KEY) {
  console.error("Must specify API key as first run command!")
  process.exit(-1)
}

const USERS = [
  {
    email: "loadtest1@test.com",
    password: "test",
  },
  {
    email: "loadtest2@test.com",
    password: "test",
  },
  {
    email: "loadtest3@test.com",
    password: "test",
  },
  {
    email: "loadtest4@test.com",
    password: "test",
  },
  {
    email: "loadtest5@test.com",
    password: "test",
  },
  {
    email: "loadtest6@test.com",
    password: "test",
  },
  {
    email: "loadtest7@test.com",
    password: "test",
  },
]

const REQUESTS = [
  {
    endpoint: `/api/global/self`,
    method: "GET",
  },
]

function timeout() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, MAX_RUNTIME_SEC * 1000)
  })
}

async function preTest() {
  // check if the user exists or not
  const response = await fetch(`${HOST}/api/global/users`, {
    method: "GET",
    headers: {
      "x-budibase-api-key": API_KEY,
    },
  })
  if (response.status !== 200) {
    throw new Error("Unable to retrieve users")
  }
  const users = await response.json()
  for (let user of USERS) {
    if (users.find(u => u.email === user.email)) {
      continue
    }
    const response = await fetch(`${HOST}/api/global/users`, {
      method: "POST",
      headers: {
        "x-budibase-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        roles: {},
        status: "active",
      }),
    })
    if (response.status !== 200) {
      throw new Error(
        `Unable to create user ${user.email}, reason: ${await response.text()}`
      )
    }
  }
}

async function requests(user) {
  let response = await fetch(`${HOST}/api/global/auth/${TENANT_ID}/login`, {
    method: "POST",
    body: JSON.stringify({
      username: user.email,
      password: user.password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
  // unable to login
  if (response.status !== 200) {
    STATS.error++
    return
  } else {
    STATS.success++
  }
  const cookie = response.headers.get("set-cookie")
  let promises = []
  for (let request of REQUESTS) {
    const headers = {
      cookie,
    }
    if (request.body) {
      headers["Content-Type"] = "application/json"
    }
    promises.push(
      fetch(`${HOST}${request.endpoint}`, {
        method: request.method,
        headers: {
          cookie,
        },
      })
    )
  }
  const responses = await Promise.all(promises)
  for (let resp of responses) {
    if (resp.status !== 200) {
      console.error(await resp.text())
      STATS.error++
    } else {
      STATS.success++
    }
  }
}

async function run() {
  await preTest()
  setInterval(async () => {
    let promises = []
    for (let user of USERS) {
      promises.push(requests(user))
    }
    await Promise.all(promises)
    console.log(
      `Iteration ${STATS.iterations++} - errors: ${STATS.error}, success: ${
        STATS.success
      }`
    )
  }, RATE_MS)
  await timeout()
  console.log(
    `Max runtime of ${MAX_RUNTIME_SEC} seconds has been reached - stopping.`
  )
  process.exit(0)
}

run().catch(err => {
  console.error("Failed to run - ", err)
})
