<script lang="ts">
  import { get } from "svelte/store"
  import { tables, datasources } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import type { Table } from "@budibase/types"

  interface ModalHandle {
    show(): void
  }

  interface ModalContentHandle {
    confirm(): void
  }

  interface Props {
    table: Table
  }

  let { table }: Props = $props()

  export const show = () => {
    editorModal?.show()
  }

  let editorModal: ModalHandle | undefined = $state()
  let editTableNameModal: ModalContentHandle | undefined = $state()
  let error = $state("")

  let originalName = $state("")
  let updatedName = $state("")
  const hasChanges = $derived(updatedName !== originalName)

  async function save() {
    const { projectIds: _projectIds, ...tableWithoutProjectIds } = table
    const updatedTable = { ...tableWithoutProjectIds, name: updatedName }
    await tables.save(updatedTable)
    await datasources.fetch()
    notifications.success("Table updated successfully")
  }

  function checkValid(evt: Event) {
    const tableName = (evt.target as HTMLInputElement).value
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
  }

  const confirmEditTableName = (event: SubmitEvent) => {
    event.preventDefault()
    editTableNameModal?.confirm()
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
    <form onsubmit={confirmEditTableName}>
      <Input
        label="Table Name"
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
    </form>
  </ModalContent>
</Modal>
