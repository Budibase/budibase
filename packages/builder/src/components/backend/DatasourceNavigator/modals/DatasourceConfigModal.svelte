<script>
  import { goto } from "@roxi/routify"
  import { ModalContent, notifications, Body, Layout } from "@budibase/bbui"
  import IntegrationConfigForm from "components/backend/DatasourceNavigator/TableIntegrationMenu/IntegrationConfigForm.svelte"
  import { IntegrationNames } from "constants/backend"
  import cloneDeep from "lodash/cloneDeepWith"
  import { saveDatasource as save } from "builderStore/datasource"
  import { onMount } from "svelte"

  export let integration
  export let modal

  // kill the reference so the input isn't saved
  let datasource = cloneDeep(integration)
  let skipFetch = false
  let isValid = false

  $: name =
    IntegrationNames[datasource.type] || datasource.name || datasource.type

  async function saveDatasource() {
    try {
      if (!datasource.name) {
        datasource.name = name
      }
      const resp = await save(datasource, skipFetch)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource updated successfully.`)
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }

  onMount(() => {
    skipFetch = false
  })
</script>

<ModalContent
  title={`Connect to ${name}`}
  onConfirm={() => saveDatasource()}
  onCancel={() => modal.show()}
  confirmText={datasource.plus
    ? "Save and fetch tables"
    : "Save and continue to query"}
  cancelText="Back"
  showSecondaryButton={datasource.plus}
  secondaryButtonText={datasource.plus ? "Skip table fetch" : undefined}
  secondaryAction={() => {
    skipFetch = true
    saveDatasource()
    return true
  }}
  size="L"
  disabled={!isValid}
>
  <Layout noPadding>
    <Body size="XS"
      >Connect your database to Budibase using the config below.
    </Body>
  </Layout>
  <IntegrationConfigForm
    schema={datasource.schema}
    bind:datasource
    creating={true}
    on:valid={e => (isValid = e.detail)}
  />
</ModalContent>
