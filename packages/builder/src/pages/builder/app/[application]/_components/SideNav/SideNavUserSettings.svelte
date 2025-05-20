<script lang="ts">
  import { UserAvatar } from "@budibase/frontend-core"
  import { auth } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import UserDropdown from "@/pages/builder/portal/_components/UserDropdown.svelte"
  import { PopoverAlignment } from "@budibase/bbui"

  export let collapsed = false

  $: user = $auth.user!
</script>

<UserDropdown align={PopoverAlignment.RightOutside} let:open>
  <SideNavLink text="Andrew Kingston" {collapsed} forceActive={open}>
    <UserAvatar slot="icon" size="XS" {user} showTooltip={false} />
  </SideNavLink>
</UserDropdown>
