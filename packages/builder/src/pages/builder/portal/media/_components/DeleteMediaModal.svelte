<script>
  import { notifications } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { appsStore } from "stores/portal"
  import { API } from "api"

  export let media
  export let onDeleteSuccess = () => {
    $goto("/builder")
  }

  let deleting = false

  export const show = () => {
    deletionModal.show()
  }

  export const hide = () => {
    deletionModal.hide()
  }

  let deletionModal

  const deleteMedia = async () => {
    deleting = true
    try {
      await API.deleteTentantMedia(media.name)
      appsStore.load()
      notifications.success("Media deleted successfully")
      deleting = false
      onDeleteSuccess()
    } catch (err) {
      console.error(err)
      notifications.error("Error deleting media")
      deleting = false
    }
  }
</script>

<ConfirmDialog
  bind:this={deletionModal}
  title="Delete media"
  okText="Delete"
  onOk={deleteMedia}
  onCancel={() => {}}
  disabled={deleting}
>
  Are you sure you want to delete
  <span class="media-name" role="button" tabindex={-1}>
    {media.name}
  </span>?
</ConfirmDialog>

<style>
  .media-name {
    cursor: pointer;
    font-weight: bold;
    display: inline-block;
  }
</style>
