import { rowEmission, tableEmission } from "./utils"
import mainEmitter from "./index"
import env from "../environment"
import { Table, Row, DocumentType, App } from "@budibase/types"
import { context } from "@budibase/backend-core"

const MAX_AUTOMATIONS_ALLOWED = 5

class AutomationEmitter {
  chainCount: number
  metadata: { automationChainCount: number }

  constructor(chainCount: number) {
    this.chainCount = chainCount
    this.metadata = {
      automationChainCount: chainCount,
    }
  }

  async getMaxAutomationChain() {
    const db = context.getAppDB()
    const appMetadata = await db.get<App>(DocumentType.APP_METADATA)
    let chainAutomations = appMetadata?.automations?.chainAutomations

    if (chainAutomations === true) {
      return MAX_AUTOMATIONS_ALLOWED
    } else if (chainAutomations === undefined && env.SELF_HOSTED) {
      return MAX_AUTOMATIONS_ALLOWED
    } else {
      return 0
    }
  }

  async emitRow({
    eventName,
    appId,
    row,
    table,
  }: {
    eventName: string
    appId: string
    row: Row
    table?: Table
  }) {
    let MAX_AUTOMATION_CHAIN = await this.getMaxAutomationChain()

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

  async emitTable(eventName: string, appId: string, table?: Table) {
    let MAX_AUTOMATION_CHAIN = await this.getMaxAutomationChain()

    // don't emit even if we've reached max automation chain
    if (this.chainCount >= MAX_AUTOMATION_CHAIN) {
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
