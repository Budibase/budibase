const workerFarm = require("worker-farm")
const MAX_WORKER_TIME_MS = 10000
const workers = workerFarm(
  {
    autoStart: true,
    maxConcurrentWorkers: 1,
    maxCallTime: MAX_WORKER_TIME_MS,
  },
  require.resolve("./runner")
)

function runService(data) {
  return new Promise((resolve, reject) => {
    workers(data, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = async (datasource, queryVerb, query, transformer) => {
  return runService({
    datasource,
    queryVerb,
    query,
    transformer,
  })
}
