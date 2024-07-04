<script>
import { Page, notifications } from "@budibase/bbui"
import { goto, isActive } from "@roxi/routify"
import { Content, SideNav, SideNavItem } from "components/portal/page"
import { features, menu } from "stores/portal"
import { onMount } from "svelte"

$: wide = $isActive("./users/index") || $isActive("./groups/index")
$: pages = $menu.find(x => x.title === "Users")?.subPages || []
$: !pages.length && $goto("../")

onMount(async () => {
  try {
    await features.init()
  } catch (error) {
    notifications.error(
      `Error fetching feature configs - ${error?.message || "unknown error"}`
    )
  }
})
</script>

<Page>
  <Content narrow={!wide}>
    <div slot="side-nav">
      <SideNav>
        {#each pages as { title, href }}
          <SideNavItem text={title} url={href} active={$isActive(href)} />
        {/each}
      </SideNav>
    </div>
    <slot />
  </Content>
</Page>
