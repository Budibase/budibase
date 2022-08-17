const fetch = require("node-fetch")

const run = async () => {
  const postmanApiKey = process.env.POSTMAN_API_KEY
  const branch = process.env.BRANCH

  if (!postmanApiKey || !branch) {
    throw new Error("postman api key and branch must be set")
  }

  const url = "https://api.getpostman.com/collections/"

  const options = {
    method: "GET",
    headers: {
      "accept": "*/*",
      "content-type": "application/json",
      "x-api-key": postmanApiKey,
    },
  }

  const response = await fetch(url, options)

  if (response.status === 200) {
    const collections = await response.json()
    const collection = collections.collections.find(c => c.fork && c.fork.label === branch)
    if (collection && collection.id) {
      console.log(collection.id)
    } else {
      console.log("19937057-61592abe-6d90-4738-b466-53de65e94442")
    }
  } else {
    throw new Error(`Non 200 reponse from postman collections ${response}`)
  }
}


run()