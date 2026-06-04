<script>
  import { get } from "svelte/store"
  import { datasources, integrations } from "@/stores/builder"
  import { notifications, Input, ModalContent, Modal } from "@budibase/bbui"
  import { integrationForDatasource } from "@/stores/selectors"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"

  let error = ""
  let modal
  let name
  let originalName = ""
  let originalProjectId = ""
  let projectId = ""
  let hasChanges = false

  $: hasChanges = name !== originalName || projectId !== originalProjectId

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    error = ""
    originalName = datasource?.name || ""
    originalProjectId = datasource?.projectId || ""
    name = originalName
    projectId = originalProjectId
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  function checkValid(evt) {
    const datasourceName = evt.target.value
    if (
      $datasources?.list.some(
        ds => ds._id !== datasource?._id && ds.name === datasourceName
      )
    ) {
      error = `Datasource with name ${datasourceName} already exists. Please choose another name.`
      return
    }
    error = ""
  }

  async function updateDatasource() {
    const updatedDatasource = {
      ...datasource,
      name,
      projectId: projectId || undefined,
    }
    await datasources.save({
      datasource: updatedDatasource,
      integration: integrationForDatasource(get(integrations), datasource),
      skipConnectionCheck: true,
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
    disabled={!hasChanges || !!error || !name || !datasource?.type}
  >
    <Input
      label="Datasource Name"
      on:input={checkValid}
      bind:value={name}
      {error}
    />
    <ProjectSelect bind:value={projectId} />
  </ModalContent>
</Modal>
