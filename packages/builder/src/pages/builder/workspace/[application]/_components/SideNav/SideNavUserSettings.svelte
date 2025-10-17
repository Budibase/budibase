<script lang="ts">
  import { UserAvatar } from "@budibase/frontend-core"
  import { auth } from "@/stores/portal"
  import SideNavLink from "./SideNavLink.svelte"
  import UserDropdown from "@/pages/builder/portal/_components/UserDropdown.svelte"
  import { PopoverAlignment } from "@budibase/bbui"
  import { type User } from "@budibase/types"

  export let collapsed = false

  $: user = $auth.user
  $: name = getName(user)

  const getName = (user?: User) => {
    if (!user) {
      return ""
    }
    if (user.firstName) {
      if (user.lastName) {
        return `${user.firstName} ${user.lastName}`
      } else {
        return `${user.firstName}`
      }
    } else {
      return user.email
    }
  }
</script>

{#if user}
  <UserDropdown align={PopoverAlignment.RightOutside} let:open>
    <SideNavLink text={name} {collapsed} forceActive={open}>
      <UserAvatar slot="icon" size="XS" {user} showTooltip={false} />
    </SideNavLink>
  </UserDropdown>
{/if}
