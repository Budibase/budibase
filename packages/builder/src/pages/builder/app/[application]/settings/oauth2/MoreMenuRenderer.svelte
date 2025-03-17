<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import { ActionMenu, Icon, MenuItem, notifications } from "@budibase/bbui"
  import type { OAuth2Config } from "@budibase/types"

  export let row: OAuth2Config

  function onEdit() {
    // TODO
  }
  async function onDelete() {
    try {
      await oauth2.delete(row.id)
      notifications.success(`Config '${row.name}' deleted successfully`)
    } catch (e: any) {
      notifications.error("Error deleting config")
    }
  }
</script>

<ActionMenu align="right">
  <div slot="control" class="control icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem on:click={onEdit} icon="Edit">Edit</MenuItem>
  <MenuItem on:click={onDelete} icon="Delete">Delete</MenuItem>
</ActionMenu>
