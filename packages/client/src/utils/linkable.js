import { get } from "svelte/store"
import { link } from "svelte-spa-router"
import { builderStore } from "stores"

export const linkable = (node, href) => {
  if (get(builderStore).inBuilder) {
    node.onclick = e => {
      e.preventDefault()
    }
    return
  }
  link(node, href)
}
