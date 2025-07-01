import { Row } from "../../"

export type UIFieldEventContext = { row: Row } | { value: any }

export type UIFieldOnChange = (
  eventContext: UIFieldEventContext
) => Promise<void>
