<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"

  function onEdit() {
    // TODO
  }
  function onDelete() {
    // TODO
  }
</script>

<ActionMenu align="right">
  <div slot="control" class="control icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem on:click={onEdit} icon="Edit">Edit</MenuItem>
  <MenuItem on:click={onDelete} icon="Delete">Delete</MenuItem>
</ActionMenu>
