import { CompletionContext, Completion } from "@codemirror/autocomplete"

export type BindingCompletion = (context: CompletionContext) => {
  from: number
  options: Completion[]
} | null

export interface BindingCompletionOption extends Completion {
  args?: any[]
}
