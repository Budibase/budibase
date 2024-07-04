import { builderStore } from "stores"
import { link } from "svelte-spa-router"
import { get } from "svelte/store"

export const linkable = (node, href) => {
  if (get(builderStore).inBuilder) {
    node.onclick = e => {
      e.preventDefault()
    }
    return
  }
  link(node, href)
}
