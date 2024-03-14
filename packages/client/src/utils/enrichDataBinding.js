import { Helpers } from "@budibase/bbui"
import { processObjectSync } from "@budibase/string-templates"

/**
 * Recursively enriches all props in a props object and returns the new props.
 * Props are deeply cloned so that no mutation is done to the source object.
 */
export const enrichDataBindings = (props, context) => {
  return processObjectSync(Helpers.cloneDeep(props), context, { cache: true })
}
