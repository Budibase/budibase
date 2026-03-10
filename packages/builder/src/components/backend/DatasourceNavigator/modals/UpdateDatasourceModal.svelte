<script>
  import { get } from "svelte/store"
  import { datasources, integrations } from "@/stores/builder"
  import { notifications, Input, ModalContent, Modal } from "@budibase/bbui"
  import { integrationForDatasource } from "@/stores/selectors"
  import PlaybookSelect from "@/components/common/PlaybookSelect.svelte"

  let error = ""
  let modal
  let name
  let playbookId = ""

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    name = datasource?.name
    playbookId = datasource?.playbookId || ""
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if ($datasources?.list.some(ds => ds.name === datasourceName)) {
      error = `Datasource with name ${datasourceName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function updateDatasource() {
    const updatedDatasource = {
      ...datasource,
      name,
      playbookId: playbookId || undefined,
    }
    await datasources.save({
      datasource: updatedDatasource,
      integration: integrationForDatasource(get(integrations), datasource),
    })
    notifications.success(`Datasource ${name} updated successfully.`)
    hide()
  }
</script>

<Modal bind:this={modal} on:hide={onCancel}>
  <ModalContent
    title="Edit Datasource"
    size="L"
    confirmText="Save"
    onConfirm={updateDatasource}
    disabled={error || !name || !datasource?.type}
  >
    <Input
      label="Datasource Name"
      on:input={checkValid}
      bind:value={name}
      {error}
    />
    <PlaybookSelect bind:value={playbookId} />
  </ModalContent>
</Modal>
