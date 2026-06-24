<script>
  import { cloneDeep } from "lodash/fp"
  import { get } from "svelte/store"
  import { tables, datasources } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"

  export let table

  export const show = () => {
    editorModal.show()
  }

  let editorModal, editTableNameModal
  let error = ""

  let originalName
  let updatedName
  let originalProjectIds = []
  let projectIds = []
  let hasChanges = false

  $: hasChanges =
    updatedName !== originalName ||
    JSON.stringify(projectIds) !== JSON.stringify(originalProjectIds)

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    updatedTable.projectIds = projectIds.length ? projectIds : undefined
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
    error = ""
    originalName = table.name + ""
    updatedName = table.name + ""
    originalProjectIds = table.projectIds || []
    projectIds = originalProjectIds
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
      <ProjectSelect bind:value={projectIds} />
    </form>
  </ModalContent>
</Modal>
