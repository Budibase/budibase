<script>
  import { Page, notifications } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { SideNav, SideNavItem, Content } from "@/components/portal/page"
  import { isActive, goto } from "@roxi/routify"
  import { menu, features } from "@/stores/portal"

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
