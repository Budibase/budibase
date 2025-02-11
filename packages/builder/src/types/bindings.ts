import { CompletionContext, Completion } from "@codemirror/autocomplete"

export type BindingCompletion = (context: CompletionContext) => {
  from: number
  options: Completion[]
} | null

export type BindingCompletionOption = Completion
