<script>
  import { views, viewsV2 } from "@/stores/builder"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { notifications } from "@budibase/bbui"

  export let view

  let confirmDeleteDialog

  export const show = () => {
    confirmDeleteDialog.show()
  }

  async function deleteView() {
    try {
      if (view.version === 2) {
        await viewsV2.delete(view)
      } else {
        await views.delete(view)
      }
      notifications.success("View deleted")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting view")
    }
  }
</script>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the view '${view.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete View"
  onOk={deleteView}
  title="Confirm Deletion"
/>
