export interface UIFieldEventContext {
  value: any
}

export type UIFieldOnChange = (
  eventContext: UIFieldEventContext
) => Promise<void>
