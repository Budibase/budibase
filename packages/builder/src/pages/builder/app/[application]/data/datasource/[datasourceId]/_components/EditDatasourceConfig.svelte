<script>
  import { Modal, notifications, ModalContent } from "@budibase/bbui"
  import { integrationForDatasource } from "stores/selectors"
  import { datasources, integrations, tables } from "stores/backend"
  import DatasourceConfigForm from "components/backend/Datasources/DatasourceConfigForm.svelte"
  import EditDatasourceConfigButton from "./EditDatasourceConfigButton.svelte"

  export let datasource

  $: integration = integrationForDatasource($integrations, datasource)
  let config = { ...datasource.config }
  let name = datasource.name

  const getData = datasource => {
    config = { ...datasource.config }
    name = datasource.name
  }

  $: getData(datasource)

  let modal
  let isValid = false

  async function saveDatasource() {
    try {
      await datasources.save({ ...datasource, config, name })

      if (datasource?.plus) {
        await tables.fetch()
      }

      await datasources.fetch()

      notifications.success(
        `Datasource ${datasource.name} updated successfully.`
      )
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }
</script>

<EditDatasourceConfigButton on:click={modal.show} {datasource} />
<Modal bind:this={modal} on:hide={() => getData(datasource)}>
  <ModalContent
    title={`Edit ${datasource.name}`}
    onConfirm={saveDatasource}
    confirmText="Update"
    cancelText="Back"
    size="L"
    disabled={!isValid}
  >
    <DatasourceConfigForm
      {integration}
      bind:name
      bind:config
      on:valid={e => (isValid = e.detail)}
    />
  </ModalContent>
</Modal>
