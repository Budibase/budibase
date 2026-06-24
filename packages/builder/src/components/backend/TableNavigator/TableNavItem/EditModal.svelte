<svelte:options runes={true} />

<script lang="ts">
  import { cloneDeep } from "lodash/fp"
  import { get } from "svelte/store"
  import { tables, datasources } from "@/stores/builder"
  import { Input, Modal, ModalContent, notifications } from "@budibase/bbui"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
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
  let originalProjectIds: string[] = $state([])
  let projectIds: string[] = $state([])
  const hasChanges = $derived(
    updatedName !== originalName ||
      JSON.stringify(projectIds) !== JSON.stringify(originalProjectIds)
  )

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    updatedTable.projectIds = projectIds.length ? projectIds : undefined
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
    originalProjectIds = table.projectIds || []
    projectIds = originalProjectIds
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
      <ProjectSelect bind:value={projectIds} />
    </form>
  </ModalContent>
</Modal>
