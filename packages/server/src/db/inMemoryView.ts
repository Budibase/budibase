import newid from "./newid"
import { Row, View, Document } from "@budibase/types"

// bypass the main application db config
// use in memory pouchdb directly
import { db as dbCore } from "@budibase/backend-core"
const Pouch = dbCore.getPouch({ inMemory: true })

export async function runView(
  view: View,
  calculation: string,
  group: boolean,
  data: Row[]
) {
  // use a different ID each time for the DB, make sure they
  // are always unique for each query, don't want overlap
  // which could cause 409s
  const db = new Pouch(newid())
  try {
    // write all the docs to the in memory Pouch (remove revs)
    await db.bulkDocs(
      data.map(row => ({
        ...row,
        _rev: undefined,
      }))
    )
    let fn = (doc: Document, emit: any) => emit(doc._id)
    // BUDI-7060 -> indirect eval call appears to cause issues in cloud
    eval("fn = " + view?.map?.replace("function (doc)", "function (doc, emit)"))
    const queryFns: any = {
      meta: view.meta,
      map: fn,
    }
    if (view.reduce) {
      queryFns.reduce = view.reduce
    }
    const response: { rows: Row[] } = await db.query(queryFns, {
      include_docs: !calculation,
      group: !!group,
    })
    // need to fix the revs to be totally accurate
    for (let row of response.rows) {
      if (!row._rev || !row._id) {
        continue
      }
      const found = data.find(possible => possible._id === row._id)
      if (found) {
        row._rev = found._rev
      }
    }
    return response
  } finally {
    await db.destroy()
    await dbCore.closePouchDB(db)
  }
}
