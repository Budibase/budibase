<script>
  import { ActionButton, ActionMenu, MenuItem, Icon } from "@budibase/bbui"

  export let value
</script>

<div class="cell">
  <ActionButton>Restore</ActionButton>
  <ActionMenu>
    <div slot="control">
      <Icon size="M" hoverable name="MoreSmallList" />
    </div>

    <MenuItem icon="Delete">Delete</MenuItem>
  </ActionMenu>
</div>

<style>
  .cell {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-m);
    align-items: center;
    margin-left: auto;
  }
</style>
