import { derived, get, Writable } from "svelte/store"
import { memo } from "../../../utils"
import { SortOrder } from "@budibase/types"
import { Store as StoreContext } from "."

export interface SortEntry {
  column: string
  order: SortOrder
}

interface SortStore {
  sort: Writable<SortEntry[]>
}

export type Store = SortStore

export const createStores = (context: StoreContext): SortStore => {
  const { props } = context
  const $props = get(props)

  // Initialise to default props
  const sort = memo<SortEntry[]>(
    $props.initialSortColumn
      ? [
          {
            column: $props.initialSortColumn,
            order: $props.initialSortOrder || SortOrder.ASCENDING,
          },
        ]
      : []
  )

  return {
    sort,
  }
}

export const initialise = (context: StoreContext) => {
  const { sort, initialSortColumn, initialSortOrder, schema } = context

  // Reset sort when initial sort props change
  initialSortColumn.subscribe(newSortColumn => {
    sort.set(
      newSortColumn
        ? [
            {
              column: newSortColumn,
              order: get(initialSortOrder) || SortOrder.ASCENDING,
            },
          ]
        : []
    )
  })
  initialSortOrder.subscribe(newSortOrder => {
    sort.update(state => {
      if (!state.length) {
        return state
      }
      return [
        {
          ...state[0],
          order: newSortOrder || SortOrder.ASCENDING,
        },
        ...state.slice(1),
      ]
    })
  })

  // Remove any sort columns that don't exist in the schema
  const validSorts = derived([sort, schema], ([$sort, $schema]) => {
    if (!$schema) {
      return $sort
    }
    return $sort.filter(sortEntry => $schema[sortEntry.column] != null)
  })

  validSorts.subscribe($validSorts => {
    const current = get(sort)
    if (JSON.stringify($validSorts) !== JSON.stringify(current)) {
      sort.set($validSorts)
    }
  })
}
