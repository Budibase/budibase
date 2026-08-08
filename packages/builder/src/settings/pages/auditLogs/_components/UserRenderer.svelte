<script>
  import { UserAvatar } from "@budibase/frontend-core"
  import { IdentityType } from "@budibase/types"

  export let row
</script>

{#if row?.user?.type === IdentityType.SERVICE_ACCOUNT}
  <span>{row.user.name} (service API key)</span>
{:else if row?.user?.email}
  <UserAvatar user={row.user} />
{/if}
