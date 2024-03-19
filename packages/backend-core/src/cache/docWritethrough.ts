import { AnyDocument, Database } from "@budibase/types"

import { JobQueue, Queue, createQueue } from "../queue"
import * as dbUtils from "../db"

interface ProcessDocMessage {
  dbName: string
  docId: string
  data: Record<string, any>
}

const PERSIST_MAX_ATTEMPTS = 100
let processor: DocWritethroughProcessor | undefined

export class DocWritethroughProcessor {
  private static _queue: Queue

  public static get queue() {
    if (!DocWritethroughProcessor._queue) {
      DocWritethroughProcessor._queue = createQueue<ProcessDocMessage>(
        JobQueue.DOC_WRITETHROUGH_QUEUE,
        {
          jobOptions: {
            attempts: PERSIST_MAX_ATTEMPTS,
          },
        }
      )
    }

    return DocWritethroughProcessor._queue
  }

  init() {
    DocWritethroughProcessor.queue.process(async message => {
      try {
        await this.persistToDb(message.data)
      } catch (err: any) {
        if (err.status === 409) {
          // If we get a 409, it means that another job updated it meanwhile. We want to retry it to persist it again.
          throw new Error(
            `Conflict persisting message ${message.id}. Attempt ${message.attemptsMade}`
          )
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
    await DocWritethroughProcessor.queue.add({
      dbName: this.db.name,
      docId: this.docId,
      data,
    })
  }
}

export function init(): DocWritethroughProcessor {
  processor = new DocWritethroughProcessor().init()
  return processor
}

export function getProcessor(): DocWritethroughProcessor {
  if (!processor) {
    return init()
  }
  return processor
}
