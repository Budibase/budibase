const env = require("../environment")
import IORedis from "ioredis"

type Redis = typeof IORedis
let client: Redis

if (env.isTest()) {
  // ioredis mock is all in memory
  client = require("ioredis-mock") as Redis
} else {
  client = IORedis
}

export = client
