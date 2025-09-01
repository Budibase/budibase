import { derived, Readable } from "svelte/store"
import { featureFlags } from "./featureFlags"

interface MenuItem {
  title: string
  href: string
  subPages?: MenuItem[]
}

export const menu: Readable<MenuItem[]> = derived(
  [featureFlags],
  ([$featureFlags]) => {
    // Pages that all devs and admins can access
    let menu: MenuItem[] = [
      {
        title: $featureFlags.WORKSPACES ? "Workspaces" : "Apps",
        href: "/builder/portal/workspaces",
      },
    ]
    return menu
  }
)
