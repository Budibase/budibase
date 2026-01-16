import { CompletionContext, Completion } from "@codemirror/autocomplete"

export type BindingCompletion = (context: CompletionContext) => {
  from: number
  options: BindingCompletionOption[]
} | null

export interface BindingCompletionOption extends Completion {
  args?: any[]
  requiresBlock?: boolean
  icon?: string
}

export type CodeValidator = Record<
  string,
  {
    arguments?: any[]
    requiresBlock?: boolean
  }
>
