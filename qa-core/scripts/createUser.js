const dotenv = require("dotenv")
const { join } = require("path")
const fs = require("fs")
const fetch = require("node-fetch")

function getVarFromDotEnv(path, varName) {
  const parsed = dotenv.parse(fs.readFileSync(path))
  return parsed[varName]
}

async function createUser() {
  const serverPath = join(__dirname, "..", "..", "packages", "server", ".env")
  const qaCorePath = join(__dirname, "..", ".env")
  const apiKey = getVarFromDotEnv(serverPath, "INTERNAL_API_KEY")
  const username = getVarFromDotEnv(qaCorePath, "BB_ADMIN_USER_EMAIL")
  const password = getVarFromDotEnv(qaCorePath, "BB_ADMIN_USER_PASSWORD")
  const url = getVarFromDotEnv(qaCorePath, "BUDIBASE_URL")
  const resp = await fetch(`${url}/api/public/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-budibase-api-key": apiKey,
    },
    body: JSON.stringify({
      email: username,
      password,
      builder: {
        global: true,
      },
      admin: {
        global: true,
      },
      roles: {},
    }),
  })
  if (resp.status !== 200) {
    throw new Error(await resp.text())
  } else {
    return await resp.json()
  }
}

createUser()
  .then(() => {
    console.log("User created - ready to use")
  })
  .catch(err => {
    console.error("Failed to create user - ", err)
  })
