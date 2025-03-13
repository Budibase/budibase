import { ActionTypes } from "@/constants"
import { APIClient } from "@budibase/frontend-core"
import { Readable } from "svelte/store"

export interface SDK {
  API: APIClient
  styleable: any
  Provider: any
  ActionTypes: typeof ActionTypes
  fetchDatasourceSchema: any
  generateGoldenSample: any
  builderStore: Readable<{
    inBuilder: boolean
  }> & {
    actions: {
      highlightSetting: (key: string) => void
      addParentComponent: (
        componentId: string,
        fullAncestorType: string
      ) => void
      updateProp: (key: string, value: any) => void
    }
  }
}
