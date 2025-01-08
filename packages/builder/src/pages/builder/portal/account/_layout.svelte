<script>
  import { goto, isActive } from "@roxi/routify"
  import { Page } from "@budibase/bbui"
  import { Content, SideNav, SideNavItem } from "@/components/portal/page"
  import { menu } from "@/stores/portal"

  $: wide = $isActive("./auditLogs")
  $: pages = $menu.find(x => x.title === "Account")?.subPages || []
  $: !pages.length && $goto("../")
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
