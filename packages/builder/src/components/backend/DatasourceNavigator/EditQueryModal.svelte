<script>
  import { cloneDeep } from "lodash/fp"
  import { queries } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"

  export let query

  export const show = () => {
    editorModal.show()
  }

  let editorModal, editQueryNameModal
  let error = ""

  let originalName
  let updatedName

  async function save() {
    try {
      const updatedQuery = cloneDeep(query)
      updatedQuery.name = updatedName
      await queries.save(updatedQuery.datasourceId, updatedQuery)
      notifications.success("Query renamed successfully")
    } catch (err) {
      notifications.error("Error renaming query")
    }
  }

  function checkValid(evt) {
    const queryName = evt.target.value || ""
    error = queryName.trim() ? "" : "Query name is required."
  }

  const initForm = () => {
    originalName = query.name + ""
    updatedName = query.name + ""
    error = ""
  }
</script>

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    bind:this={editQueryNameModal}
    title="Edit Query"
    confirmText="Save"
    onConfirm={save}
    disabled={updatedName === originalName || !!error}
  >
    <form on:submit|preventDefault={() => editQueryNameModal.confirm()}>
      <Input
        label="Query Name"
        thin
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
    </form>
  </ModalContent>
</Modal>
