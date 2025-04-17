import { ArrayOperator, BasicOperator, RangeOperator } from "@budibase/types"
import { Readable } from "svelte/store"

export * from "./components"
export * from "./fields"
export * from "./forms"

export type Context = Readable<Record<string, any>>

export type Operator =
  | BasicOperator
  | RangeOperator
  | ArrayOperator
  | "rangeLow"
  | "rangeHigh"
