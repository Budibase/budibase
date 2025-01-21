<script>
  import { cloneDeep } from "lodash/fp"
  import { tables, datasources } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"

  export let table

  export const show = () => {
    editorModal.show()
  }

  let editorModal, editTableNameModal
  let error = ""

  let originalName
  let updatedName

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    await tables.save(updatedTable)
    await datasources.fetch()
    notifications.success("Table renamed successfully")
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `Table with name ${tableName} already exists. Please choose another name.`
        : ""
  }

  const initForm = () => {
    originalName = table.name + ""
    updatedName = table.name + ""
  }
</script>

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    bind:this={editTableNameModal}
    title="Edit Table"
    confirmText="Save"
    onConfirm={save}
    disabled={updatedName === originalName || error}
  >
    <form on:submit|preventDefault={() => editTableNameModal.confirm()}>
      <Input
        label="Table Name"
        thin
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
    </form>
  </ModalContent>
</Modal>
