import { createAllSearchIndex, createLinkView } from "../../db/views/staticViews"

// Re-PUTs `_design/database` for every existing workspace so the row search
// index (and link view) are rewritten with the correct, un-minified function
// bodies. Previous releases shipped these via `.toString()` on TS functions
// that esbuild rewrote with module-scope helpers (`r(fn, "name")`) which do
// not exist in the CouchDB JS sandbox, producing `ReferenceError("o is not
// defined")` for every doc the indexer touched.
const migration = async () => {
  await createLinkView()
  await createAllSearchIndex()
}

export default migration
