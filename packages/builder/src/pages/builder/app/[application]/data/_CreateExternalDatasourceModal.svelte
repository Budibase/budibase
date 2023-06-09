<script>
  import { datasources } from "stores/backend"

  import {
    Body,
    Layout,
    Modal,
    notifications,
    ModalContent,
  } from "@budibase/bbui"
  import { goto } from "@roxi/routify"
  import { IntegrationTypes } from "constants/backend"
  import GoogleDatasourceConfigModal from "components/backend/DatasourceNavigator/modals/GoogleDatasourceConfigModal.svelte"
  import IntegrationConfigForm from "./_IntegrationConfigForm.svelte"

  export let disabled = false
  export let googleSetupId = false

  let modal
  let integration
  let fields
  let isValid = false

  const getFields = integration => {
    return Object.fromEntries(
      Object.entries(integration?.datasource || {}).map(([key, value]) => [
        key,
        value.default,
      ])
    )
  }

  export function show(selectedIntegration) {
    integration = selectedIntegration
    fields = getFields(integration)

    if (integration.name === IntegrationTypes.REST) {
      disabled = true

      // Skip modal for rest, create straight away
      datasources
        .create({ integration, fields: {} })
        .then(response => {
          $goto(`./datasource/${response._id}`)
        })
        .catch(() => {
          disabled = false
          notifications.error("Error creating datasource")
        })
    } else {
      modal.show()
    }
  }

  async function saveDatasource() {
    try {
      const resp = await datasources.create({ integration, fields })
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource created successfully.`)
    } catch (err) {
      notifications.error(err?.message ?? "Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }
</script>

<Modal on:hide bind:this={modal}>
  {#if integration?.auth?.type === "google"}
    <GoogleDatasourceConfigModal
      continueSetupId={googleSetupId}
      {integration}
    />
  {:else}
    <ModalContent
      title={`Connect to ${integration.friendlyName}`}
      onConfirm={() => saveDatasource()}
      confirmText={integration.plus ? "Connect" : "Save and continue to query"}
      cancelText="Back"
      showSecondaryButton={integration.plus}
      size="L"
      disabled={!isValid}
    >
      <Layout noPadding>
        <Body size="XS"
          >Connect your database to Budibase using the config below.
        </Body>
      </Layout>
      <IntegrationConfigForm
        {integration}
        bind:config={fields}
        creating={true}
        on:valid={e => (isValid = e.detail)}
      />
    </ModalContent>
  {/if}
</Modal>
