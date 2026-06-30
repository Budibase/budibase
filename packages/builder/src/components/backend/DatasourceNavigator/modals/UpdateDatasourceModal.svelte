<svelte:options runes={true} />

<script lang="ts">
  import { get } from "svelte/store"
  import { datasources, integrations } from "@/stores/builder"
  import { notifications, Input, ModalContent, Modal } from "@budibase/bbui"
  import { integrationForDatasource } from "@/stores/selectors"
  import ProjectSelect from "@/components/common/ProjectSelect.svelte"
  import type { Datasource, UIInternalDatasource } from "@budibase/types"

  type EditableDatasource = (Datasource | UIInternalDatasource) & {
    entities?: Datasource["entities"] | UIInternalDatasource["entities"]
  }

  interface ModalHandle {
    show(): void
    hide(): void
  }

  interface Props {
    datasource: EditableDatasource
    onCancel?: (event: CustomEvent<void>) => void
  }

  let error = $state("")
  let modal: ModalHandle | undefined = $state()
  let name = $state("")
  let originalName = ""
  let originalProjectIds: string[] = $state([])
  let projectIds: string[] = $state([])

  const hasChanges = $derived(
    name !== originalName ||
      JSON.stringify(projectIds) !== JSON.stringify(originalProjectIds)
  )

  let { datasource, onCancel }: Props = $props()

  export const show = () => {
    error = ""
    originalName = datasource?.name || ""
    originalProjectIds = datasource?.projectIds || []
    name = originalName
    projectIds = [...originalProjectIds]
    modal?.show()
  }
  export const hide = () => {
    modal?.hide()
  }

  function checkValid(evt: Event) {
    const datasourceName = (evt.target as HTMLInputElement).value
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
    const { projectIds: _projectIds, ...datasourceWithoutProjectIds } =
      datasource
    const updatedDatasource: Datasource = {
      ...datasourceWithoutProjectIds,
      name,
      entities: Array.isArray(datasource.entities)
        ? undefined
        : datasource.entities,
    }
    if (JSON.stringify(projectIds) !== JSON.stringify(originalProjectIds)) {
      updatedDatasource.projectIds = projectIds
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

<Modal bind:this={modal} on:hide={event => onCancel?.(event)}>
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
