<script>
  import {
    Layout,
    Button,
    Modal,
    Table,
    InlineAlert,
    notifications,
  } from "@budibase/bbui"
  import { environment, licensing } from "@/stores/portal"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "@/components/portal/environment/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"
  import LockedFeature from "../../_components/LockedFeature.svelte"

  let modal

  const customRenderers = [{ column: "edit", component: EditVariableColumn }]

  $: noEncryptionKey = $environment.status?.encryptionKeyAvailable === false
  $: schema = buildSchema(noEncryptionKey)

  onMount(async () => {
    try {
      await environment.checkStatus()
      await environment.loadVariables()
    } catch (error) {
      notifications.error(
        `Error loading environment variables: ${error.message}`
      )
    }
  })

  const buildSchema = noEncryptionKey => {
    const schema = {
      name: {
        width: "2fr",
      },
    }
    if (!noEncryptionKey) {
      schema.edit = {
        width: "auto",
        borderLeft: true,
        displayName: "",
      }
    }
    return schema
  }

  const save = async data => {
    try {
      await environment.createVariable(data)
      modal.hide()
    } catch (err) {
      notifications.error(`Error saving variable: ${err.message}`)
    }
  }
</script>

<LockedFeature
  title={"Environment Variables"}
  planType={"Enterprise plan"}
  description={"Add and manage environment variables for development and production"}
  enabled={$licensing.environmentVariablesEnabled}
  upgradeButtonClick={async () => {
    await environment.upgradePanelOpened()
    $licensing.goToUpgradePage()
  }}
>
  {#if noEncryptionKey}
    <InlineAlert
      message="Your Budibase installation does not have a key for encryption, please update your app service's environment variables to contain an 'ENCRYPTION_KEY' value."
      header="No encryption key found"
      type="error"
    />
  {/if}
  <div>
    <Button on:click={modal.show} cta disabled={noEncryptionKey}
      >Add Variable</Button
    >
  </div>
  <Layout noPadding>
    <Table
      {schema}
      data={$environment.variables}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {customRenderers}
    />
  </Layout>
</LockedFeature>

<Modal bind:this={modal}>
  <CreateEditVariableModal {save} />
</Modal>

<style>
</style>
