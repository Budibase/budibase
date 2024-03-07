import { AnyDocument, Database } from "@budibase/types"

import { JobQueue, createQueue } from "../queue"
import * as dbUtils from "../db"

interface ProcessDocMessage {
  dbName: string
  docId: string
  data: Record<string, any>
}

export const docWritethroughProcessorQueue = createQueue<ProcessDocMessage>(
  JobQueue.DOC_WRITETHROUGH_QUEUE,
  {
    jobOptions: {
      // We might have plenty of 409, we want to allow running almost infinitely
      attempts: Number.MAX_SAFE_INTEGER,
    },
  }
)

class DocWritethroughProcessor {
  init() {
    docWritethroughProcessorQueue.process(async message => {
      try {
        await this.persistToDb(message.data)
      } catch (err: any) {
        if (err.status === 409) {
          // If we get a 409, it means that another job updated it meanwhile. We want to retry it to persist it again.
          throw new Error(`Conflict persisting message ${message.id}`)
        }

        throw err
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
