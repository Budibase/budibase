import { API } from "./api.js"
import { patchAPI } from "./patches.js"

// Certain endpoints which return rows need patched so that they transform
// and enrich the row docs, so that they can be correctly handled by the
// client library
patchAPI(API)

export { API }
