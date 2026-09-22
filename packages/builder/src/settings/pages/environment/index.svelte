<script lang="ts">
  import {
    Layout,
    Button,
    Modal,
    Table,
    InlineAlert,
    notifications,
    type ModalAPI,
  } from "@budibase/bbui"
  import type { CreateEnvironmentVariableRequest } from "@budibase/types"
  import { environment } from "@/stores/portal/environment"
  import { licensing } from "@/stores/portal/licensing"
  import { onMount } from "svelte"
  import CreateEditVariableModal from "@/components/portal/environment/CreateEditVariableModal.svelte"
  import EditVariableColumn from "./_components/EditVariableColumn.svelte"
  import LockedFeature from "@/pages/builder/_components/LockedFeature.svelte"
  import RouteActions from "@/settings/components/RouteActions.svelte"

  const customRenderers = [{ column: "edit", component: EditVariableColumn }]

  interface TableColumn {
    width: string
    borderLeft?: boolean
    displayName?: string
  }

  let modal = $state<ModalAPI>()
  let loading = $state<boolean>(true)

  const noEncryptionKey = $derived(
    !loading && $environment.status?.encryptionKeyAvailable === false
  )
  const schema = $derived(buildSchema(noEncryptionKey))

  onMount(async () => {
    try {
      await environment.checkStatus()
      await environment.loadVariables()
    } catch (error) {
      notifications.error(
        `Error loading environment variables: ${error instanceof Error ? error.message : error}`
      )
    }
    loading = false
  })

  function buildSchema(noEncryptionKey: boolean) {
    const schema: Record<string, TableColumn> = {
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

  const save = async (data: CreateEnvironmentVariableRequest) => {
    try {
      await environment.createVariable(data)
      modal?.hide()
    } catch (err) {
      notifications.error(
        `Error saving variable: ${err instanceof Error ? err.message : err}`
      )
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
    licensing.goToUpgradePage()
  }}
>
  {#if noEncryptionKey}
    <InlineAlert
      message="Your Budibase installation does not have a key for encryption, please update your app service's environment variables to contain an 'ENCRYPTION_KEY' value."
      header="No encryption key found"
      type="error"
    />
  {/if}

  <RouteActions>
    <Button
      size="M"
      on:click={() => modal?.show()}
      cta
      disabled={noEncryptionKey}
    >
      Add Variable
    </Button>
  </RouteActions>

  <Layout noPadding>
    <Table
      {schema}
      data={$environment.variables}
      allowEditColumns={false}
      allowEditRows={false}
      allowSelectRows={false}
      {customRenderers}
      {loading}
    />
  </Layout>
</LockedFeature>

<Modal bind:this={modal}>
  <CreateEditVariableModal {save} />
</Modal>

<style>
</style>
