export const DEFAULT_FUNCTION_SOURCE = `import { inputs, queries, type FunctionResult } from "@budibase/functions"

/*
 * Link saved queries below before calling them with
 * await queries.datasourceAlias.queryAlias().
 */
export default async function (): Promise<FunctionResult> {
  return { output: {} }
}`
