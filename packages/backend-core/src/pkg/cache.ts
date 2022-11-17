// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
import * as generic from "../cache/generic"
import * as user from "../cache/user"
import * as app from "../cache/appMetadata"
import * as writethrough from "../cache/writethrough"

export = {
  app,
  user,
  writethrough,
  ...generic,
}
