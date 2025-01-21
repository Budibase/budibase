import { derived } from "svelte/store"
import { Socket } from "socket.io-client"
import { DerivedBudiStore } from "../BudiStore.js"
import { datasourceSelect as format } from "@/helpers/data/format"
import { tables } from "./tables.js"
import { datasources } from "./datasources.js"
import { viewsV2 } from "./viewsV2.js"

interface FriendlyNamesState {}

interface DerivedFriendlyNamesState {
  tables: {
    label: string
    resourceId: string
    datasourceName: string
  }[]
  viewsV2: {
    label: string
    resourceId: string
    datasourceName: string
  }[]
}

export class FriendlyNamesStore extends DerivedBudiStore<
  FriendlyNamesState,
  DerivedFriendlyNamesState
> {
  websocket?: Socket

  constructor() {
    const makeDerivedStore = () => {
      return derived(
        [tables, datasources, viewsV2],
        ([$tables, $datasources, $viewsV2]) => ({
          tables: $tables.list
            .map(table => {
              const formatted = format.table(table, $datasources.list)
              return {
                label: formatted.label,
                datasourceName: formatted.datasourceName,
                resourceId: table._id!,
              }
            })
            .sort((a, b) => {
              // sort tables alphabetically, grouped by datasource
              const dsA = a.datasourceName ?? ""
              const dsB = b.datasourceName ?? ""

              const dsComparison = dsA.localeCompare(dsB)
              if (dsComparison !== 0) {
                return dsComparison
              }
              return a.label.localeCompare(b.label)
            }),
          viewsV2: $viewsV2.list.map(view => {
            const formatted = format.viewV2(view, $datasources.list)
            return {
              label: formatted.label,
              datasourceName: formatted.datasourceName,
              resourceId: view.id,
            }
          }),
        })
      )
    }

    super({}, makeDerivedStore)
  }
}

export const friendlyNamesStore = new FriendlyNamesStore()
