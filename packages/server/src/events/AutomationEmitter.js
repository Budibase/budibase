const { rowEmission, tableEmission } = require("./utils")
const mainEmitter = require("./index")

// max number of automations that can chain on top of each other
const MAX_AUTOMATION_CHAIN = 5

/**
 * Special emitter which takes the count of automation runs which have occurred and blocks an
 * automation from running if it has reached the maximum number of chained automations runs.
 * This essentially "fakes" the normal emitter to add some functionality in-between to stop automations
 * from getting stuck endlessly chaining.
 */
class AutomationEmitter {
  constructor(chainCount) {
    this.chainCount = chainCount
    this.metadata = {
      automationChainCount: chainCount,
    }
  }

  emitRow(eventName, appId, row, table = null) {
    // don't emit even if we've reached max automation chain
    if (this.chainCount > MAX_AUTOMATION_CHAIN) {
      return
    }
    rowEmission({
      emitter: mainEmitter,
      eventName,
      appId,
      row,
      table,
      metadata: this.metadata,
    })
  }

  emitTable(eventName, appId, table = null) {
    // don't emit even if we've reached max automation chain
    if (this.chainCount > MAX_AUTOMATION_CHAIN) {
      return
    }
    tableEmission({
      emitter: mainEmitter,
      eventName,
      appId,
      table,
      metadata: this.metadata,
    })
  }
}

module.exports = AutomationEmitter
