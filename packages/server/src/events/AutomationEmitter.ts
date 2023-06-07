import { rowEmission, tableEmission } from "./utils"
import mainEmitter from "./index"
import env from "../environment"
import { Table, Row } from "@budibase/types"

// max number of automations that can chain on top of each other
// TODO: in future make this configurable at the automation level
const MAX_AUTOMATION_CHAIN = env.SELF_HOSTED ? 5 : 0

/**
 * Special emitter which takes the count of automation runs which have occurred and blocks an
 * automation from running if it has reached the maximum number of chained automations runs.
 * This essentially "fakes" the normal emitter to add some functionality in-between to stop automations
 * from getting stuck endlessly chaining.
 */
class AutomationEmitter {
  chainCount: number
  metadata: { automationChainCount: number }

  constructor(chainCount: number) {
    this.chainCount = chainCount
    this.metadata = {
      automationChainCount: chainCount,
    }
  }

  emitRow(eventName: string, appId: string, row: Row, table?: Table) {
    // don't emit even if we've reached max automation chain
    if (this.chainCount >= MAX_AUTOMATION_CHAIN) {
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

  emitTable(eventName: string, appId: string, table?: Table) {
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

export default AutomationEmitter
