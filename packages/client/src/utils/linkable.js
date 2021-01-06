import { get } from "svelte/store"
import { link } from "svelte-spa-router"
import { builderStore } from "../store"

export const linkable = (node, href) => {
  if (get(builderStore).inBuilder) {
    return
  }
  link(node, href)
}
