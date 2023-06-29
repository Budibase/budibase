<script>
  import { keepOpen, Modal, notifications } from "@budibase/bbui"
  import { integrationForDatasource } from "stores/selectors"
  import { datasources, integrations } from "stores/backend"
  import DatasourceConfigEditor from "components/backend/Datasources/ConfigEditor/index.svelte"
  import EditDatasourceConfigButton from "./EditDatasourceConfigButton.svelte"

  export let datasource

  $: integration = integrationForDatasource($integrations, datasource)

  let modal

  async function saveDatasource({ config, name }) {
    try {
      await datasources.update({
        integration,
        datasource: { ...datasource, config, name },
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
    nameFieldValue={datasource.name}
    onSubmit={saveDatasource}
  />
</Modal>
