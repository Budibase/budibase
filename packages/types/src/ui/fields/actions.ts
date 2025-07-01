import { Row } from "../../"

export interface UIFieldEventContext {
  row?: Row
  value?: any
}

export type UIFieldOnChange = (eventContext: UIFieldEventContext) => Promise<void>