import type { Database, DatabaseQueryOpts, Document } from "@budibase/types"

export async function* pageAllDocs<T extends Document>({
  db,
  params,
  pageSize = 1000,
}: {
  db: Database
  params: DatabaseQueryOpts
  pageSize?: number
}): AsyncGenerator<T[]> {
  let startAfter: string | undefined
  while (true) {
    const response = await db.allDocs<T>({
      ...params,
      include_docs: true,
      limit: pageSize + (startAfter ? 1 : 0),
      ...(startAfter ? { startkey: startAfter } : {}),
    })
    // Filter the cursor instead of skipping one result: it may have been
    // deleted since the preceding page was read.
    const page = response.rows
      .filter(row => row.id !== startAfter)
      .slice(0, pageSize)
    if (!page.length) {
      return
    }
    startAfter = page[page.length - 1].id
    yield page.flatMap(({ doc }) => (doc && !doc._deleted ? [doc] : []))
    if (page.length < pageSize) {
      return
    }
  }
}
