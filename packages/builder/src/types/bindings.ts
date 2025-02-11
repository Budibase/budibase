import { BindingCompletionOption } from "@budibase/types"
import { CompletionContext } from "@codemirror/autocomplete"

export type BindingCompletion = (context: CompletionContext) => {
  from: number
  options: BindingCompletionOption[]
} | null
