import { appStore } from "../app.js"
import { builderStore } from "../builder.js"
import { derivedMemo } from "@budibase/frontend-core"

export const snippets = derivedMemo(
  [appStore, builderStore],
  ([$appStore, $builderStore]) => {
    return $builderStore?.snippets || $appStore?.application?.snippets || []
  }
)
