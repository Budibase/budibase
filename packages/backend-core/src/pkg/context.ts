// Mimic the outer package export for usage in index.ts
import {
  getAppDB,
  getDevAppDB,
  getProdAppDB,
  getAppId,
  getProdAppId,
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
  getProdAppId,
  updateAppId,
  doInAppContext,
  doInTenant,
  doInContext,
  identity,
}
