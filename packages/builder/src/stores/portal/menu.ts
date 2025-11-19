import { Readable, readable } from "svelte/store"
import { BUILDER_URLS } from "@budibase/shared-core"

interface MenuItem {
  title: string
  href: string
  subPages?: MenuItem[]
}

// This is the current default
export const menu: Readable<MenuItem[]> = readable([
  {
    title: "Workspaces",
    href: BUILDER_URLS.WORKSPACES,
  },
])
