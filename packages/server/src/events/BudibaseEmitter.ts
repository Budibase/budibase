import { EventEmitter } from "events"
import { rowEmission, tableEmission } from "./utils"
import { Table, Row } from "@budibase/types"

/**
 * keeping event emitter in one central location as it might be used for things other than
 * automations (what it was for originally) - having a central emitter will be useful in the
 * future.
 */

/**
 * Extending the standard emitter to some syntactic sugar and standardisation to the emitted event.
 * This is specifically quite important for template strings used in automations.
 */
class BudibaseEmitter extends EventEmitter {
  emitRow(eventName: string, appId: string, row: Row, table?: Table) {
    rowEmission({ emitter: this, eventName, appId, row, table })
  }

  emitTable(eventName: string, appId: string, table?: Table) {
    tableEmission({ emitter: this, eventName, appId, table })
  }

  emitPort(portNumber?: number | string) {
    this.emit("internal:port", portNumber)
  }
}

export default BudibaseEmitter
