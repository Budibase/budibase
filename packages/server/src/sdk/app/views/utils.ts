import { ViewV2 } from "@budibase/types"
import { utils, dataFilters } from "@budibase/shared-core"
import { cloneDeep, isPlainObject } from "lodash"
import { HTTPError } from "@budibase/backend-core"

function isEmptyObject(obj: any) {
  return obj && isPlainObject(obj) && Object.keys(obj).length === 0
}

export function ensureQueryUISet(viewArg: Readonly<ViewV2>): ViewV2 {
  const view = cloneDeep<ViewV2>(viewArg)
  if (!view.queryUI && view.query && !isEmptyObject(view.query)) {
    if (!Array.isArray(view.query)) {
      // In practice this should not happen. `view.query`, at the time this code
      // goes into the codebase, only contains LegacyFilter[] in production.
      // We're changing it in the change that this comment is part of to also
      // include SearchFilters objects. These are created when we receive an
      // update to a ViewV2 that contains a queryUI and not a query field. We
      // can convert UISearchFilter (the type of queryUI) to SearchFilters,
      // but not LegacyFilter[], they are incompatible due to UISearchFilter
      // and SearchFilters being recursive types.
      //
      // So despite the type saying that `view.query` is a LegacyFilter[] |
      // SearchFilters, it will never be a SearchFilters when a `view.queryUI`
      // is specified, making it "safe" to throw an error here.
      throw new HTTPError("view is missing queryUI field", 400)
    }

    view.queryUI = utils.processSearchFilters(view.query)
  }
  return view
}

export function ensureQuerySet(viewArg: Readonly<ViewV2>): ViewV2 {
  const view = cloneDeep<ViewV2>(viewArg)
  // We consider queryUI to be the source of truth, so we don't check for the
  // presence of query here. We will overwrite it regardless of whether it is
  // present or not.
  if (view.queryUI && !isEmptyObject(view.queryUI)) {
    view.query = dataFilters.buildQuery(view.queryUI)
  }
  return view
}
