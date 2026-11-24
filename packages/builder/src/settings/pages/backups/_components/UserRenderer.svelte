<script lang="ts">
  import { UserAvatar } from "@budibase/frontend-core"
  import type { User } from "@budibase/types"

  interface Props {
    value?: string | User
  }

  let { value }: Props = $props()
  const user = $derived(typeof value === "string" ? undefined : value)
</script>

<div class="cell">
  <UserAvatar {user} />
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
