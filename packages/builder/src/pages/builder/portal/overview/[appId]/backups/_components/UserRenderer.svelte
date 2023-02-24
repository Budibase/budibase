<script>
  import getUserInitials from "helpers/userInitials.js"
  import { Avatar } from "@budibase/bbui"

  export let value

  $: initials = getUserInitials(value)
</script>

<div title={value.email} class="cell">
  <Avatar size="M" {initials} />
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
  }
</style>
