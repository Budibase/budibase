<script>
  import { UserAvatar } from "@budibase/frontend-core"
  import { auth } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import UserDropdown from "@/pages/builder/portal/_components/UserDropdown.svelte"

  export let collapsed = false
</script>

<UserDropdown>
  <SideNavLink text="Andrew Kingston" {collapsed}>
    <UserAvatar slot="icon" size="XS" user={$auth.user} showTooltip={false} />
  </SideNavLink>
</UserDropdown>
