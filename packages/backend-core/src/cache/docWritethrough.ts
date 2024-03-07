import { AnyDocument, Database, LockName, LockType } from "@budibase/types"

import { JobQueue, createQueue } from "../queue"
import * as dbUtils from "../db"
import { string } from "yargs"
import { db } from ".."
import { locks } from "../redis"
import { Duration } from "../utils"

interface ProcessDocMessage {
  dbName: string
  docId: string

  data: Record<string, any>
}

export const docWritethroughProcessorQueue = createQueue<ProcessDocMessage>(
  JobQueue.DOC_WRITETHROUGH_QUEUE
)

class DocWritethroughProcessor {
  init() {
    docWritethroughProcessorQueue.process(async message => {
      const result = await locks.doWithLock(
        {
          type: LockType.TRY_ONCE,
          name: LockName.PERSIST_DOC_WRITETHROUGH,
          resource: `${message.data.dbName}:${message.data.docId}`,
          ttl: Duration.fromSeconds(60).toMs(),
        },
        async () => {
          await this.persistToDb(message.data)
        }
      )
      if (!result.executed) {
        throw new Error(
          `Error persisting docWritethrough message: ${message.id}`
        )
      }
    })
    return this
  }

  private async persistToDb({
    dbName,
    docId,
    data,
  }: {
    dbName: string
    docId: string
    data: Record<string, any>
  }) {
    const db = dbUtils.getDB(dbName)
    let doc: AnyDocument | undefined
    try {
      doc = await db.get(docId)
    } catch {
      doc = { _id: docId }
    }

    doc = { ...doc, ...data }
    await db.put(doc)
  }
}

export const processor = new DocWritethroughProcessor().init()

export class DocWritethrough {
  private db: Database
  private _docId: string

  constructor(db: Database, docId: string) {
    this.db = db
    this._docId = docId
  }

  get docId() {
    return this._docId
  }

  async patch(data: Record<string, any>) {
    await docWritethroughProcessorQueue.add({
      dbName: this.db.name,
      docId: this.docId,
      data,
    })
  }
}
