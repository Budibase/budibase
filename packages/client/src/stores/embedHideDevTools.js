import { writable } from "svelte/store"

/**
 * Set at script load (loadBudibase) when window["##BUDIBASE_HIDE_DEV_TOOLS##"] === "true".
 * Used by devToolsEnabled so the derived re-runs when this is set (avoids timing issues
 * where the window flag was set after the first derived evaluation).
 */
export const embedHideDevToolsStore = writable(false)
