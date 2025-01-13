import { get } from "svelte/store"
import { link, LinkActionOpts } from "svelte-spa-router"
import { builderStore } from "stores"

export const linkable = (node: HTMLElement, href?: LinkActionOpts) => {
  if (get(builderStore).inBuilder) {
    node.onclick = e => {
      e.preventDefault()
    }
    return
  }
  link(node, href)
}
