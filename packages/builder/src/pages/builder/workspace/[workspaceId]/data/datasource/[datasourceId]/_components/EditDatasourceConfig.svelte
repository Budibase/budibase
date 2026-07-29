<svelte:options runes={true} />

<script lang="ts">
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { integrationForDatasource } from "@/stores/selectors"
  import { datasources, integrations } from "@/stores/builder"
  import DatasourceConfigEditor from "@/components/backend/Datasources/ConfigEditor/index.svelte"
  import EditDatasourceConfigButton from "./EditDatasourceConfigButton.svelte"
  import type { Datasource, UIIntegration } from "@budibase/types"

  interface ModalHandle {
    show(): void
  }

  type DatasourceConfig = NonNullable<Datasource["config"]>

  interface DatasourceConfigSubmit {
    config: DatasourceConfig
    name: string
    projectIds?: string[]
  }

  interface Props {
    datasource: Datasource
  }

  let { datasource }: Props = $props()

  const integration = $derived(
    integrationForDatasource($integrations, datasource)
  )

  let modal: ModalHandle | undefined = $state()

  async function saveDatasource({
    config,
    name,
    projectIds,
  }: DatasourceConfigSubmit) {
    try {
      const { projectIds: _projectIds, ...datasourceWithoutProjectIds } =
        datasource
      const updatedDatasource: Datasource = {
        ...datasourceWithoutProjectIds,
        config,
        name,
      }
      if (projectIds !== undefined) {
        updatedDatasource.projectIds = projectIds
      }

      await datasources.save({
        integration,
        datasource: updatedDatasource,
      })

      notifications.success(
        `Datasource ${datasource.name} updated successfully`
      )
    } catch (err) {
      notifications.error(
        err instanceof Error ? err.message : "Error saving datasource"
      )

      return keepOpen
    }
  }
</script>

<EditDatasourceConfigButton on:click={() => modal?.show()} {datasource} />
<Modal bind:this={modal}>
  <DatasourceConfigEditor
    integration={integration as UIIntegration}
    config={datasource.config || {}}
    showNameField
    showProjectField
    originalProjectIdsValue={datasource.projectIds || []}
    nameFieldValue={datasource.name}
    projectIdsValue={datasource.projectIds || []}
    onSubmit={saveDatasource}
  />
</Modal>
