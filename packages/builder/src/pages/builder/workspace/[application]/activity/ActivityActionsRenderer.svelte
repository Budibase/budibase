<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"

  export let row: {
    id: string
  }
</script>

<ActionMenu align="right">
  <div slot="control">
    <Icon
      name="dots-three"
      size="M"
      hoverable
      color="var(--spectrum-global-color-gray-600)"
    />
  </div>
  <MenuItem disabled>Request ID: {row.id}</MenuItem>
</ActionMenu>
