import { Readable, readable } from "svelte/store"

interface MenuItem {
  title: string
  href: string
  subPages?: MenuItem[]
}

// This is the current default
export const menu: Readable<MenuItem[]> = readable([
  {
    title: "Workspaces",
    href: "/builder/portal/workspaces",
  },
])
