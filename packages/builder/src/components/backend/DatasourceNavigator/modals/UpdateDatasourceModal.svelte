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
  let originalProjectIds = []
  let projectIds = []
  let hasChanges = false

  $: hasChanges =
    name !== originalName ||
    JSON.stringify(projectIds) !== JSON.stringify(originalProjectIds)

  export let datasource
  export let onCancel = undefined

  export const show = () => {
    error = ""
    originalName = datasource?.name || ""
    originalProjectIds = datasource?.projectIds || []
    name = originalName
    projectIds = originalProjectIds
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
      projectIds: projectIds.length ? projectIds : undefined,
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
    <ProjectSelect bind:value={projectIds} />
  </ModalContent>
</Modal>
