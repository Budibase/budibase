import { EventEmitter } from "events"
import { rowEmission, tableEmission } from "./utils"
import { Table, Row, User } from "@budibase/types"

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
  emitRow({
    eventName,
    appId,
    row,
    table,
    oldRow,
    user,
  }: {
    eventName: string
    appId: string
    row: Row
    table?: Table
    oldRow?: Row
    user: User
  }) {
    rowEmission({ emitter: this, eventName, appId, row, table, oldRow, user })
  }

  emitTable(eventName: string, appId: string, table?: Table) {
    tableEmission({ emitter: this, eventName, appId, table })
  }

  emitPort(portNumber?: number | string) {
    this.emit("internal:port", portNumber)
  }
}

export default BudibaseEmitter
