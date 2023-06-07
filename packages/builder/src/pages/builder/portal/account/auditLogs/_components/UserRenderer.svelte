<script>
  import { UserAvatar } from "@budibase/frontend-core"

  export let row
</script>

{#if row?.user?.email}
  <UserAvatar user={row.user} />
{/if}
