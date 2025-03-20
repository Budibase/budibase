<script lang="ts">
  import { oauth2 } from "@/stores/builder"
  import {
    ActionMenu,
    Icon,
    MenuItem,
    Modal,
    notifications,
  } from "@budibase/bbui"
  import type { OAuth2Config } from "@budibase/types"
  import OAuth2ConfigModalContent from "./OAuth2ConfigModalContent.svelte"
  import { confirm } from "@/helpers"

  export let row: OAuth2Config

  let modal: Modal

  function onEdit() {
    modal.show()
  }
  async function onDelete() {
    await confirm({
      title: "Confirm Deletion",
      body: `Deleting "${row.name}" cannot be undone. Are you sure?`,
      okText: "Delete Configuration",
      warning: true,
      onConfirm: async () => {
        try {
          await oauth2.delete(row.id)
          notifications.success(`Config '${row.name}' deleted successfully`)
        } catch (e: any) {
          let message = "Error deleting config"
          if (e.message) {
            message += ` - ${e.message}`
          }
          notifications.error(message)
        }
      },
    })
  }
</script>

<ActionMenu align="right">
  <div slot="control" class="control icon">
    <Icon size="S" hoverable name="MoreSmallList" />
  </div>
  <MenuItem on:click={onEdit} icon="Edit">Edit</MenuItem>
  <MenuItem on:click={onDelete} icon="Delete">Delete</MenuItem>
</ActionMenu>

<Modal bind:this={modal}>
  <OAuth2ConfigModalContent config={{ ...row }} />
</Modal>
