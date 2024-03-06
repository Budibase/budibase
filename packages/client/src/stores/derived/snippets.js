import { derived } from "svelte/store"
import { appStore } from "../app.js"

export const snippets = derived(appStore, $appStore => $appStore.snippets)

snippets.subscribe(console.log)
