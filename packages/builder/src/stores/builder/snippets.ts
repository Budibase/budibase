import { get } from "svelte/store"
import { API } from "@/api"
import { appStore } from "./app"
import { BudiStore } from "../BudiStore"
import { Snippet, UpdateAppResponse } from "@budibase/types"

export class SnippetStore extends BudiStore<Snippet[]> {
  constructor() {
    super([])
  }

  syncMetadata = (metadata: UpdateAppResponse) => {
    this.set(metadata?.snippets || [])
  }

  saveSnippet = async (updatedSnippet: Snippet) => {
    const snippets = [
      ...get(this).filter(snippet => snippet.name !== updatedSnippet.name),
      updatedSnippet,
    ]
    const app = await API.saveAppMetadata(get(appStore).appId, { snippets })
    this.syncMetadata(app)
  }

  deleteSnippet = async (snippetName: string) => {
    const snippets = get(this).filter(snippet => snippet.name !== snippetName)
    const app = await API.saveAppMetadata(get(appStore).appId, { snippets })
    this.syncMetadata(app)
  }
}

export const snippets = new SnippetStore()
