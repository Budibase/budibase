<script lang="ts">
  import {
    Body,
    Button,
    Checkbox,
    CopyInput,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { ChatCommands } from "@budibase/shared-core"
  import type {
    Agent,
    ProvisionAgentMSTeamsChannelResponse,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import {
    DEFAULT_IDLE_TIMEOUT_MINUTES,
    toOptionalIdleTimeout,
    toOptionalValue,
  } from "./utils"

  const MS_TEAMS_NEW_COMMAND = ChatCommands.NEW
  const MS_TEAMS_LINK_COMMAND = ChatCommands.LINK
  const SECRET_MASK = "********"
  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    appId: "",
    appPassword: "",
    tenantId: "",
    teamId: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
    requireUserLink: true,
  })

  let provisioning = $state(false)
  let creatingTeamsApp = $state(false)
  let downloadingPackage = $state(false)
  let loadingTeamsAppConfig = $state(false)
  let teamsAppConfigConfigured = $state(false)
  let provisionResult = $state<
    ProvisionAgentMSTeamsChannelResponse | undefined
  >()

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.MSTeamsIntegration?.messagingEndpointUrl ||
      ""
  )

  const hasRequiredCredentials = $derived.by(
    () =>
      !!(
        draft.appId.trim() &&
        draft.appPassword.trim() &&
        draft.tenantId.trim()
      )
  )

  const isProvisioned = $derived.by(
    () => messagingEndpointUrl.trim().length > 0
  )

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.MSTeamsIntegration
    draft = {
      appId: integration?.appId || "",
      appPassword: integration?.appPassword || "",
      tenantId: integration?.tenantId || "",
      teamId: integration?.teamId || "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
      requireUserLink: integration?.requireUserLink !== false,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

  $effect(() => {
    const loadTeamsAppConfig = async () => {
      loadingTeamsAppConfig = true
      try {
        const config = await agentsStore.fetchMSTeamsAppConfig()
        teamsAppConfigConfigured = config.configured
      } catch (error) {
        console.error(error)
        teamsAppConfigConfigured = false
      } finally {
        loadingTeamsAppConfig = false
      }
    }

    loadTeamsAppConfig()
  })

  const provisionMSTeamsChannel = async (showNotification = true) => {
    if (!agent?._id || provisioning) {
      return false
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        MSTeamsIntegration: {
          appId: toOptionalValue(draft.appId),
          appPassword: toOptionalValue(draft.appPassword),
          tenantId: toOptionalValue(draft.tenantId),
          teamId: toOptionalValue(draft.teamId),
          chatAppId: agent.MSTeamsIntegration?.chatAppId,
          messagingEndpointUrl: agent.MSTeamsIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
          requireUserLink: draft.requireUserLink,
        },
      })
      provisionResult = await agentsStore.provisionMSTeamsChannel(agent._id)
      if (agent.live) {
        await deploymentStore.publishApp()
      }
      if (showNotification) {
        notifications.success("Microsoft Teams channel settings saved")
      }
      return true
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Microsoft Teams channel settings")
      return false
    } finally {
      provisioning = false
    }
  }

  const downloadMSTeamsPackage = async () => {
    if (!agent?._id || downloadingPackage || !hasRequiredCredentials) {
      return
    }

    downloadingPackage = true
    try {
      const saved = await provisionMSTeamsChannel(false)
      if (!saved) {
        return
      }
      const blob = await agentsStore.downloadMSTeamsPackage(agent._id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "budibase-teams-app-package.zip"
      link.click()
      URL.revokeObjectURL(url)
      notifications.success("Microsoft Teams app package downloaded")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to download Microsoft Teams app package")
    } finally {
      downloadingPackage = false
    }
  }

  const createMSTeamsApp = async () => {
    if (!agent?._id || creatingTeamsApp || !teamsAppConfigConfigured) {
      return
    }

    creatingTeamsApp = true
    try {
      provisionResult = await agentsStore.createMSTeamsApp(agent._id, {
        teamId: toOptionalValue(draft.teamId),
        idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        requireUserLink: draft.requireUserLink,
      })
      draft = {
        ...draft,
        appId: provisionResult.appId,
        appPassword: SECRET_MASK,
        tenantId: provisionResult.tenantId,
      }
      if (agent.live) {
        await deploymentStore.publishApp()
      }
      notifications.success("Microsoft Teams app created")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to create Microsoft Teams app")
    } finally {
      creatingTeamsApp = false
    }
  }
</script>

<ChannelConfigLayout
  statusPositive={isProvisioned}
  positiveStatusLabel="Configured"
  negativeStatusLabel="Not configured"
  actionLabel={provisioning
    ? "Saving..."
    : isProvisioned
      ? "Save changes"
      : "Save channel"}
  actionDisabled={provisioning || !hasRequiredCredentials}
  onAction={provisionMSTeamsChannel}
  secondaryActionLabel={downloadingPackage
    ? "Downloading..."
    : "Download app package"}
  secondaryActionDisabled={provisioning ||
    downloadingPackage ||
    !hasRequiredCredentials}
  onSecondaryAction={downloadMSTeamsPackage}
>
  {#snippet fields()}
    <Input label="App ID (client ID)" bind:value={draft.appId} />
    <Input
      label="Client secret (value)"
      type="password"
      bind:value={draft.appPassword}
    />
    <Input
      label="Directory (tenant) ID (Azure AD tenant ID)"
      bind:value={draft.tenantId}
    />
    <Input label="Default team ID (optional)" bind:value={draft.teamId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
    <div class="field-grid-leading">
      <Checkbox
        bind:value={draft.requireUserLink}
        text="Require users to link a Budibase account"
      />
    </div>
  {/snippet}

  {#snippet response()}
    <Body size="S">Send a normal message to ask a question.</Body>
    <Body size="S">
      Use `{MS_TEAMS_NEW_COMMAND}` to start a new conversation.
    </Body>
    <Body size="S">
      Use `{MS_TEAMS_LINK_COMMAND}` or `/{MS_TEAMS_LINK_COMMAND}` to link or
      refresh your Budibase account.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
    <div class="guided-setup">
      <Body size="S">
        Teams app creation uses the tenant Microsoft Teams provisioning settings
        managed in tenant settings.
      </Body>
      <Button
        secondary
        on:click={createMSTeamsApp}
        disabled={creatingTeamsApp ||
          loadingTeamsAppConfig ||
          !teamsAppConfigConfigured}
      >
        {creatingTeamsApp ? "Creating app..." : "Create Teams app"}
      </Button>
      {#if !loadingTeamsAppConfig && !teamsAppConfigConfigured}
        <Body size="S">
          Configure Microsoft Teams provisioning settings before creating a
          Teams app automatically.
        </Body>
      {/if}
    </div>
  {/snippet}
</ChannelConfigLayout>

<style>
  .guided-setup {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-s);
  }
</style>
