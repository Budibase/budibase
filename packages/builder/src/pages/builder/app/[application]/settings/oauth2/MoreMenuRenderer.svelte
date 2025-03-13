<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"
</script>

<ActionMenu align="right">
  <div slot="control" class="control icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem on:click={() => {}} icon="Edit">Edit</MenuItem>
  <MenuItem on:click={() => {}} icon="Delete">Delete</MenuItem>
</ActionMenu>
