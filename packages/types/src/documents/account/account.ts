import { Hosting } from "../../core"

export interface Account {
  accountId: string
  hosting: Hosting
  verified: boolean
}
