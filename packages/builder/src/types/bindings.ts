import { BindingCompletionOption } from "@budibase/types"
import { CompletionContext } from "@codemirror/autocomplete"

export type BindingCompletion = (context: CompletionContext) => Promise<{
  from: number
  options: BindingCompletionOption[]
} | null>
