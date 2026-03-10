<script>
  import { cloneDeep } from "lodash/fp"
  import { get } from "svelte/store"
  import { tables, datasources } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import PlaybookSelect from "@/components/common/PlaybookSelect.svelte"

  export let table

  export const show = () => {
    editorModal.show()
  }

  let editorModal, editTableNameModal
  let error = ""

  let originalName
  let updatedName
  let originalPlaybookId = ""
  let playbookId = ""

  $: hasChanges =
    updatedName !== originalName || playbookId !== originalPlaybookId

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    updatedTable.playbookId = playbookId || undefined
    await tables.save(updatedTable)
    await datasources.fetch()
    notifications.success("Table updated successfully")
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error = get(tables).list.some(
      existing => existing._id !== table._id && existing.name === tableName
    )
      ? `Table with name ${tableName} already exists. Please choose another name.`
      : ""
  }

  const initForm = () => {
    originalName = table.name + ""
    updatedName = table.name + ""
    originalPlaybookId = table.playbookId || ""
    playbookId = originalPlaybookId
  }
</script>

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    bind:this={editTableNameModal}
    title="Edit Table"
    confirmText="Save"
    onConfirm={save}
    disabled={!hasChanges || !!error}
  >
    <form on:submit|preventDefault={() => editTableNameModal.confirm()}>
      <Input
        label="Table Name"
        thin
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
      <PlaybookSelect bind:value={playbookId} />
    </form>
  </ModalContent>
</Modal>
