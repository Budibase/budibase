const fetch = require("node-fetch")
const { getProdAppID } = require("@budibase/backend-core/db")

const USER_LOAD_NUMBER = 10000
const BATCH_SIZE = 25
const SERVER_URL = "http://localhost:4001"
const PASSWORD = "test"

const APP_ID = process.argv[2]
const API_KEY = process.argv[3]

const words = [
  "test",
  "testing",
  "budi",
  "mail",
  "age",
  "risk",
  "load",
  "uno",
  "arm",
  "leg",
  "pen",
  "glass",
  "box",
  "chicken",
  "bottle",
]

if (!APP_ID) {
  console.error("Must supply app ID as first CLI option!")
  process.exit(-1)
}
if (!API_KEY) {
  console.error("Must supply API key as second CLI option!")
  process.exit(-1)
}

const WORD_1 = words[Math.floor(Math.random() * words.length)]
const WORD_2 = words[Math.floor(Math.random() * words.length)]

function generateUser(count) {
  return {
    password: PASSWORD,
    email: `${WORD_1}${count}@${WORD_2}.com`,
    roles: {
      [getProdAppID(APP_ID)]: "BASIC",
    },
    status: "active",
    forceResetPassword: false,
    firstName: "John",
    lastName: "Smith",
  }
}

async function run() {
  for (let i = 0; i < USER_LOAD_NUMBER; i += BATCH_SIZE) {
    let promises = []
    for (let j = 0; j < BATCH_SIZE; j++) {
      promises.push(
        fetch(`${SERVER_URL}/api/public/v1/users`, {
          method: "POST",
          body: JSON.stringify(generateUser(i + j)),
          headers: {
            "x-budibase-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        })
      )
    }
    await Promise.all(promises)
    console.log(`${i + BATCH_SIZE} users have been created.`)
  }
}

run()
  .then(() => {
    console.log(`Generated ${USER_LOAD_NUMBER} users!`)
  })
  .catch(err => {
    console.error("Failed for reason: ", err)
    process.exit(-1)
  })
