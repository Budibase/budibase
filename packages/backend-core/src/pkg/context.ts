// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
import {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  doInContext,
} from "../context"

import * as identity from "../context/identity"

export = {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  doInContext,
  identity,
}
