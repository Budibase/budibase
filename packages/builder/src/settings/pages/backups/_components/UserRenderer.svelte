<script>
  import { UserAvatar } from "@budibase/frontend-core"

  export let value
</script>

<div class="cell">
  <UserAvatar user={value} />
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
