import { Account } from "@budibase/types"

export interface NewAccount extends Account {
  password: string
}
