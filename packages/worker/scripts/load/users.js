// get the JWT secret etc
require("../../src/environment")
require("@budibase/backend-core").init()
const {
  getProdAppID,
  generateGlobalUserID,
} = require("@budibase/backend-core/db")
const { doInTenant, getGlobalDB } = require("@budibase/backend-core/tenancy")
const users = require("../../src/sdk/users")
const { publicApiUserFix } = require("../../src/utilities/users")
const { hash } = require("@budibase/backend-core/utils")

const USER_LOAD_NUMBER = 10000
const BATCH_SIZE = 200
const PASSWORD = "test"
const TENANT_ID = "default"

const APP_ID = process.argv[2]

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

const WORD_1 = words[Math.floor(Math.random() * words.length)]
const WORD_2 = words[Math.floor(Math.random() * words.length)]
let HASHED_PASSWORD

function generateUser(count) {
  return {
    _id: generateGlobalUserID(),
    password: HASHED_PASSWORD,
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
  HASHED_PASSWORD = await hash(PASSWORD)
  return doInTenant(TENANT_ID, async () => {
    const db = getGlobalDB()
    for (let i = 0; i < USER_LOAD_NUMBER; i += BATCH_SIZE) {
      let userSavePromises = []
      for (let j = 0; j < BATCH_SIZE; j++) {
        // like the public API
        const ctx = publicApiUserFix({
          request: {
            body: generateUser(i + j),
          },
        })
        userSavePromises.push(
          users.save(ctx.request.body, {
            hashPassword: false,
            requirePassword: true,
            bulkCreate: true,
          })
        )
      }
      const allUsers = await Promise.all(userSavePromises)
      await db.bulkDocs(allUsers)
      console.log(`${i + BATCH_SIZE} users have been created.`)
    }
  })
}

run()
  .then(() => {
    console.log(`Generated ${USER_LOAD_NUMBER} users!`)
  })
  .catch(err => {
    console.error("Failed for reason: ", err)
    process.exit(-1)
  })
