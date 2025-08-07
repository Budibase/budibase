import { WorkspaceFavourite, WorkspaceFavouriteResponse } from "@budibase/types"
import { BudiStore } from "../BudiStore"
import { API } from "@/api"
import { derived, Readable } from "svelte/store"

export type WorkspaceFavouriteLookupState = Record<string, WorkspaceFavourite>

export class WorkspaceFavouriteStore extends BudiStore<WorkspaceFavourite[]> {
  lookup: Readable<WorkspaceFavouriteLookupState>

  constructor() {
    super([])
    this.generateLookup = this.generateLookup.bind(this)

    this.lookup = this.generateLookup()
  }

  generateLookup() {
    return derived([this.store], ([$fav]): WorkspaceFavouriteLookupState => {
      return $fav.reduce(
        (acc: WorkspaceFavouriteLookupState, f: WorkspaceFavourite) => {
          acc[f.resourceId] = f
          return acc
        },
        {} as WorkspaceFavouriteLookupState
      )
    })
  }

  async sync() {
    try {
      const resp: WorkspaceFavouriteResponse = await API.workspace.fetch()
      this.set(resp.favourites)
    } catch (e: any) {
      console.error("Could not init workspace favourites")
    }
  }
}

export const workspaceFavouriteStore = new WorkspaceFavouriteStore()
