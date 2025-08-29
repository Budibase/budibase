import { derived } from "svelte/store"
import { DerivedBudiStore } from "../BudiStore"
import { screenStore, workspaceAppStore } from "@/stores/builder"
import { Screen } from "@budibase/types"

export type RoutesState = string[]

export const INITIAL_ROUTES_STATE: RoutesState = []

export interface DerivedRoutesStore extends RoutesState {}

export class RoutesStore extends DerivedBudiStore<
  RoutesState,
  DerivedRoutesStore
> {
  constructor() {
    const makeDerivedStore = () => {
      return derived(
        [screenStore, workspaceAppStore],
        ([$screenStore, $wsa]) => {
          const workspaceApp = $wsa.selectedWorkspaceApp
          return $screenStore.screens
            .filter(
              (s: Screen) =>
                workspaceApp && workspaceApp._id === s.workspaceAppId
            )
            .map(screen => screen.routing?.route)
            .filter(url => url != null)
            .sort()
        }
      )
    }

    super(INITIAL_ROUTES_STATE, makeDerivedStore)
  }

  reset() {
    this.store.set({ ...INITIAL_ROUTES_STATE })
  }
}
