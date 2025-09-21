import { context } from "@budibase/backend-core"
import {
  ContextEmitter,
  DocumentType,
  EventType,
  Row,
  Table,
  UserBindings,
  Workspace,
} from "@budibase/types"
import env from "../environment"
import mainEmitter from "./index"
import { rowEmission, tableEmission } from "./utils"

const MAX_AUTOMATIONS_ALLOWED = 5

class AutomationEmitter implements ContextEmitter {
  chainCount: number
  metadata: { automationChainCount: number }

  constructor(chainCount: number) {
    this.chainCount = chainCount
    this.metadata = {
      automationChainCount: chainCount,
    }
  }

  async getMaxAutomationChain() {
    const db = context.getWorkspaceDB()
    const appMetadata = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
    let chainAutomations = appMetadata?.automations?.chainAutomations

    if (chainAutomations === true) {
      return MAX_AUTOMATIONS_ALLOWED
    } else if (env.isTest()) {
      return 0
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
    oldRow,
    user,
  }: {
    eventName: EventType.ROW_SAVE | EventType.ROW_DELETE | EventType.ROW_UPDATE
    appId: string
    row: Row
    table?: Table
    oldRow?: Row
    user: UserBindings
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
      oldRow,
      metadata: this.metadata,
      user,
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
