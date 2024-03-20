import { writable, get } from "svelte/store"
import { API } from "api"
import { appStore } from "./app"

const createsnippets = () => {
  const store = writable([])

  const syncMetadata = metadata => {
    store.set(metadata?.snippets || [])
  }

  const saveSnippet = async updatedSnippet => {
    const snippets = [
      ...get(store).filter(snippet => snippet.name !== updatedSnippet.name),
      updatedSnippet,
    ]
    const app = await API.saveAppMetadata({
      appId: get(appStore).appId,
      metadata: { snippets },
    })
    syncMetadata(app)
  }

  const deleteSnippet = async snippetName => {
    const snippets = get(store).filter(snippet => snippet.name !== snippetName)
    const app = await API.saveAppMetadata({
      appId: get(appStore).appId,
      metadata: { snippets },
    })
    syncMetadata(app)
  }

  return {
    ...store,
    syncMetadata,
    saveSnippet,
    deleteSnippet,
  }
}

export const snippets = createsnippets()
