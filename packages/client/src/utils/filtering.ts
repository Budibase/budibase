import { type Operator } from "@/types"
import { ArrayOperator } from "@budibase/types"

/**
 * Check if the supplied filter operator is for an array
 * @param op
 */
export function isArrayOperator(op: Operator): op is ArrayOperator {
  return op === ArrayOperator.CONTAINS_ANY || op === ArrayOperator.ONE_OF
}
