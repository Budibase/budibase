const { createBullBoard } = require("bull-board")
const { BullAdapter } = require("bull-board/bullAdapter")
const { getQueues } = require("./triggers")
const express = require("express")

exports.pathPrefix = "/bulladmin"

exports.init = () => {
  const expressApp = express()
  // Set up queues for bull board admin
  const queues = getQueues()
  const adapters = []
  for (let queue of queues) {
    adapters.push(new BullAdapter(queue))
  }
  const { router } = createBullBoard(adapters)

  expressApp.use(exports.pathPrefix, router)
  return expressApp
}
