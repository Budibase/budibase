import { Row, UIDatasource } from "@budibase/types"

export interface UIFetchAPI {
  definition: UIDatasource

  getInitialData: () => Promise<void>
  loading: any
  loaded: boolean

  resetKey: string | null
  error: any

  hasNextPage: boolean
  nextPage: () => Promise<void>

  rows: Row[]
}
