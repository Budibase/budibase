<script>
  import { StatusLight } from "@budibase/bbui"

  export let value
  export let schema

  $: role = schema.roles?.find(x => x._id === value)
</script>

<div class="role-cell">
  <div class="light">
    <StatusLight
      square
      size="L"
      color={role?.color || "var(--spectrum-global-color-magenta-400)"}
    />
  </div>
  <div class="value">
    {role?.displayName || role?.name || value}
  </div>
</div>

<style>
  .role-cell {
    flex: 1 1 auto;
    padding: var(--cell-padding);
    align-self: stretch;
    display: flex;
    align-items: flex-start;
    overflow: hidden;
    gap: var(--cell-padding);
  }
  .light {
    height: 20px;
    display: grid;
    place-items: center;
  }
  .value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
</style>
