// Mimic the outer package export for usage in index.ts
import * as generic from "../cache/generic"
import * as user from "../cache/user"
import * as app from "../cache/appMetadata"

export = {
  app,
  user,
  ...generic,
}
