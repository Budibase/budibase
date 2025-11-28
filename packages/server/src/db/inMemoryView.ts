import { Row, DBView } from "@budibase/types"

// bypass the main application db config
// use in memory pouchdb directly
import { db as dbCore, utils } from "@budibase/backend-core"
import { buildMapFunction } from "./viewInterpreter"

const Pouch = dbCore.getPouch({ inMemory: true })

export async function runView(
  view: DBView,
  calculation: string,
  group: boolean,
  data: Row[]
) {
  // use a different ID each time for the DB, make sure they
  // are always unique for each query, don't want overlap
  // which could cause 409s
  const db = new Pouch(utils.newid())
  try {
    // write all the docs to the in memory Pouch (remove revs)
    await db.bulkDocs(
      data.map(row => ({
        ...row,
        _rev: undefined,
      }))
    )
    const fn = buildMapFunction(view)
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
