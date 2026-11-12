export const DEFAULT_FUNCTION_SOURCE = `import { inputs, queries, type FunctionResult } from "@budibase/functions"

export default async function (): Promise<FunctionResult> {
  return { output: {} }
}`
