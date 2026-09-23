<script>
  import { views, viewsV2 } from "@/stores/builder"
  import { cloneDeep } from "lodash/fp"
  import { notifications, Input, Modal, ModalContent } from "@budibase/bbui"

  export let view

  let editorModal
  let originalName
  let updatedName

  export const show = () => {
    editorModal.show()
  }

  async function save() {
    const updatedView = cloneDeep(view)
    updatedView.name = updatedName

    if (view.version === 2) {
      await viewsV2.save({
        originalName,
        ...updatedView,
      })
    } else {
      await views.save({
        originalName,
        ...updatedView,
      })
    }

    notifications.success("View renamed successfully")
  }

  const initForm = () => {
    updatedName = view.name + ""
    originalName = view.name + ""
  }
</script>

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent title="Edit view" onConfirm={save} confirmText="Save">
    <Input label="Name" thin bind:value={updatedName} />
  </ModalContent>
</Modal>
