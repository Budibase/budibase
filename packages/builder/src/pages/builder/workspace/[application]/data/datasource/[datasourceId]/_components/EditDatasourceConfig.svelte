<script>
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { integrationForDatasource } from "@/stores/selectors"
  import { datasources, integrations } from "@/stores/builder"
  import DatasourceConfigEditor from "@/components/backend/Datasources/ConfigEditor/index.svelte"
  import EditDatasourceConfigButton from "./EditDatasourceConfigButton.svelte"

  export let datasource

  $: integration = integrationForDatasource($integrations, datasource)

  let modal

  async function saveDatasource({ config, name, playbookId }) {
    try {
      await datasources.save({
        integration,
        datasource: { ...datasource, config, name, playbookId },
      })

      notifications.success(
        `Datasource ${datasource.name} updated successfully`
      )
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")

      return keepOpen
    }
  }
</script>

<EditDatasourceConfigButton on:click={modal.show} {datasource} />
<Modal bind:this={modal}>
  <DatasourceConfigEditor
    {integration}
    config={datasource.config}
    showNameField
    showPlaybookField
    nameFieldValue={datasource.name}
    playbookIdValue={datasource.playbookId || ""}
    onSubmit={saveDatasource}
  />
</Modal>
