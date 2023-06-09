<script>
  import { integrations, datasources } from "stores/backend"
  import { googleSheetsIntegration } from "stores/selectors"

  import {
    Body,
    Layout,
    Modal,
    notifications,
    ModalContent,
  } from "@budibase/bbui"
  import { goto, params } from "@roxi/routify"
  import { IntegrationTypes } from "constants/backend"
  import DatasourceConfigForm from "components/backend/Datasources/DatasourceConfigForm.svelte"
  import GoogleAuthModalContent from "./GoogleAuthModalContent.svelte"

  export let disabled = false

  let googleSetupId
  let modal
  let integration
  let fields
  let isValid = false

  const getGoogleSetupId = params => {
    // Don't set the id if the new value is nullish, this is to avoid overwriting
    // it when we remove the query param.
    const newId = params["?continue_google_setup"]
    googleSetupId = newId == null ? googleSetupId : newId
    // Remove the query param, to avoid it sticking around and potentially causing
    // strange behavior on refresh
    $goto("./new")
  }

  const handleOpenGoogle = (setupId, integrations, modal) => {
    if (setupId && integrations && modal) {
      integration = googleSheetsIntegration(integrations)
      fields = { continueSetupId: googleSetupId, sheetId: "" }
      modal.show()
    }
  }

  $: getGoogleSetupId($params)
  $: handleOpenGoogle(googleSetupId, $integrations, modal)

  const saveDatasource = async () => {
    try {
      const response = await datasources.create({ integration, fields })
      $goto(`./datasource/${response._id}`)
      notifications.success(`Datasource created successfully.`)
    } catch (err) {
      notifications.error("Error saving datasource")
      // prevent the modal from closing
      return false
    }
  }

  export function show(selectedIntegration) {
    integration = selectedIntegration
    fields = Object.fromEntries(
      Object.entries(integration?.datasource || {}).map(([key, value]) => [
        key,
        value.default,
      ])
    )

    // Skip modal for REST, create straight away
    if (integration.name === IntegrationTypes.REST) {
      disabled = true
      saveDatasource().then(() => (disabled = false))
    } else {
      modal.show()
    }
  }
</script>

<Modal bind:this={modal} on:hide={() => (googleSetupId = false)}>
  {#if integration?.auth?.type === "google" && !googleSetupId}
    <GoogleAuthModalContent />
  {:else}
    <ModalContent
      title={`Connect to ${integration.friendlyName}`}
      onConfirm={saveDatasource}
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
      <DatasourceConfigForm
        {integration}
        bind:config={fields}
        creating={true}
        on:valid={e => (isValid = e.detail)}
      />
    </ModalContent>
  {/if}
</Modal>
