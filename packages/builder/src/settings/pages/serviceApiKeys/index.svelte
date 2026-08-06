<script lang="ts">
  import {
    Body,
    Button,
    CopyInput,
    Divider,
    Heading,
    Input,
    Layout,
    Modal,
    ModalContent,
    Multiselect,
    RadioGroup,
    Table,
    Toggle,
    keepOpen,
    notifications,
  } from "@budibase/bbui"
  import {
    ServiceApiKeyAccessLevel,
    ServiceApiKeyStatus,
    type ServiceApiKeySummary,
  } from "@budibase/types"
  import { onMount } from "svelte"
  import { API } from "@/api"
  import { confirm } from "@/helpers"
  import { workspacesStore } from "@/stores/portal/workspaces"
  import RouteActions from "@/settings/components/RouteActions.svelte"

  interface ServiceApiKeyTableRow extends ServiceApiKeySummary {
    access: string
    workspaces: string
    tenant: string
    statusLabel: string
    created: string
  }

  let createModal: any
  let credentialModal: any
  let loading = true
  let serviceApiKeys: ServiceApiKeySummary[] = []
  let selectedRows: ServiceApiKeyTableRow[] = []
  let createdApiKey = ""
  let name = ""
  let accessLevel = ServiceApiKeyAccessLevel.READ_ONLY
  let workspaceAccessType: "all" | "selected" = "selected"
  let selectedWorkspaceIds: string[] = []
  let tenantAdmin = false

  const accessOptions = [
    {
      label: "Read only",
      value: ServiceApiKeyAccessLevel.READ_ONLY,
      subtitle: "Can use public API read and search operations.",
    },
    {
      label: "Read and write",
      value: ServiceApiKeyAccessLevel.READ_WRITE,
      subtitle: "Can also create, update, and delete resources.",
    },
  ]
  const workspaceAccessOptions = [
    {
      label: "Selected workspaces",
      value: "selected",
      subtitle: "Restrict this key to an explicit workspace list.",
    },
    {
      label: "All workspaces",
      value: "all",
      subtitle: "Includes current and future workspaces.",
    },
  ]

  const schema = {
    name: { width: "1.5fr" },
    access: { displayName: "Access", width: "1fr" },
    workspaces: { displayName: "Workspaces", width: "1.5fr" },
    tenant: { displayName: "Tenant admin", width: "1fr" },
    statusLabel: { displayName: "Status", width: "1fr" },
    created: { displayName: "Created", width: "1.5fr" },
  }

  $: workspaceOptions = ($workspacesStore.apps || []).map(workspace => ({
    label: workspace.name,
    value: workspace.devId || workspace.appId,
  }))
  $: rows = serviceApiKeys.map(serviceApiKey => ({
    ...serviceApiKey,
    access:
      serviceApiKey.accessLevel === ServiceApiKeyAccessLevel.READ_WRITE
        ? "Read and write"
        : "Read only",
    workspaces:
      serviceApiKey.workspaceAccess.type === "all"
        ? "All workspaces"
        : `${serviceApiKey.workspaceAccess.workspaceIds.length} selected`,
    tenant: serviceApiKey.tenantAdmin ? "Enabled" : "Disabled",
    statusLabel:
      serviceApiKey.status === ServiceApiKeyStatus.ACTIVE
        ? "Active"
        : "Revoked",
    created: new Date(serviceApiKey.createdAt).toLocaleString(),
  }))
  $: activeSelectedRows = selectedRows.filter(
    row => row.status === ServiceApiKeyStatus.ACTIVE
  )

  const load = async () => {
    loading = true
    try {
      const response = await API.fetchServiceApiKeys()
      serviceApiKeys = response.serviceApiKeys
      selectedRows = []
    } catch (err: any) {
      notifications.error(`Unable to load service API keys - ${err.message}`)
    } finally {
      loading = false
    }
  }

  const resetForm = () => {
    name = ""
    accessLevel = ServiceApiKeyAccessLevel.READ_ONLY
    workspaceAccessType = "selected"
    selectedWorkspaceIds = []
    tenantAdmin = false
  }

  const createServiceApiKey = async () => {
    if (!name.trim()) {
      notifications.error("Name is required")
      return keepOpen
    }
    if (
      workspaceAccessType === "selected" &&
      selectedWorkspaceIds.length === 0
    ) {
      notifications.error("Select at least one workspace")
      return keepOpen
    }
    try {
      const response = await API.createServiceApiKey({
        name: name.trim(),
        accessLevel,
        workspaceAccess:
          workspaceAccessType === "all"
            ? { type: "all" }
            : { type: "selected", workspaceIds: selectedWorkspaceIds },
        tenantAdmin: workspaceAccessType === "all" && tenantAdmin,
      })
      createdApiKey = response.apiKey
      resetForm()
      await load()
      setTimeout(() => credentialModal.show())
      notifications.success("Service API key created")
    } catch (err: any) {
      notifications.error(`Unable to create service API key - ${err.message}`)
      return keepOpen
    }
  }

  const revokeSelected = async () => {
    if (!activeSelectedRows.length) {
      return
    }
    const confirmed = await confirm({
      title: "Revoke service API keys",
      body: "Revoked credentials stop working immediately and cannot be restored.",
      okText: "Revoke keys",
      warning: true,
    })
    if (!confirmed) {
      return
    }
    try {
      await Promise.all(
        activeSelectedRows.map(serviceApiKey =>
          API.revokeServiceApiKey(serviceApiKey._id!)
        )
      )
      await load()
      notifications.success("Service API keys revoked")
    } catch (err: any) {
      notifications.error(`Unable to revoke service API keys - ${err.message}`)
    }
  }

  onMount(async () => {
    await Promise.all([load(), workspacesStore.load()])
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Service API keys</Heading>
    <Body>
      Create non-human credentials for scoped access to the Budibase public API.
    </Body>
  </Layout>
  <Divider noMargin />
  <RouteActions>
    <div class="actions">
      {#if activeSelectedRows.length}
        <Button warning on:click={revokeSelected}>
          Revoke selected ({activeSelectedRows.length})
        </Button>
      {/if}
      <Button cta on:click={() => createModal.show()}>Create API key</Button>
    </div>
  </RouteActions>
  <Table
    {schema}
    data={rows}
    {loading}
    allowEditColumns={false}
    allowEditRows={false}
    allowSelectRows={true}
    allowClickRows={false}
    bind:selectedRows
  />
</Layout>

<Modal bind:this={createModal}>
  <ModalContent
    title="Create service API key"
    confirmText="Create key"
    onConfirm={createServiceApiKey}
    size="M"
  >
    <Input label="Name" bind:value={name} />
    <RadioGroup
      label="Access level"
      options={accessOptions}
      bind:value={accessLevel}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      getOptionSubtitle={option => option.subtitle}
    />
    <RadioGroup
      label="Workspace access"
      options={workspaceAccessOptions}
      bind:value={workspaceAccessType}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      getOptionSubtitle={option => option.subtitle}
    />
    {#if workspaceAccessType === "selected"}
      <Multiselect
        label="Workspaces"
        bind:value={selectedWorkspaceIds}
        options={workspaceOptions}
        getOptionLabel={option => option.label}
        getOptionValue={option => option.value}
        autocomplete
      />
    {:else}
      <div class="toggle-row">
        <div>
          <Body>Tenant administration</Body>
          <Body size="S">
            Allow users, roles, metrics, and tenant-wide workspace operations.
          </Body>
        </div>
        <Toggle text="" bind:value={tenantAdmin} />
      </div>
    {/if}
  </ModalContent>
</Modal>

<Modal bind:this={credentialModal}>
  <ModalContent
    title="Copy your API key"
    confirmText="Done"
    showCancelButton={false}
  >
    <Body>
      This credential is shown once. Store it securely before closing this
      dialog.
    </Body>
    <CopyInput value={createdApiKey} />
  </ModalContent>
</Modal>

<style>
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
    width: 100%;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-l);
  }
</style>
