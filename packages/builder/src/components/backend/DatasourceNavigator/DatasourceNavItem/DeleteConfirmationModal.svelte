<script>
  import { goto } from "@roxi/routify"
  import { datasources } from "@/stores/builder"
  import { notifications } from "@budibase/bbui"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"

  export let datasource

  let confirmDeleteDialog

  export const show = () => {
    confirmDeleteDialog.show()
  }

  async function deleteDatasource() {
    try {
      const isSelected = datasource.selected || datasource.containsSelected
      await datasources.delete(datasource)
      notifications.success("Datasource deleted")
      if (isSelected) {
        $goto("./datasource")
      }
    } catch (error) {
      notifications.error("Error deleting datasource")
    }
  }
</script>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Datasource"
  onOk={deleteDatasource}
  title="Confirm Deletion"
>
  Are you sure you wish to delete the datasource
  <i>{datasource.name}</i>? This action cannot be undone.
</ConfirmDialog>
