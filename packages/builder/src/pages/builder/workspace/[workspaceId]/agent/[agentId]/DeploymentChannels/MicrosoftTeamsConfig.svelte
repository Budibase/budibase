<script lang="ts">
  import { validate as isValidUUID } from "uuid"
  import {
    Body,
    Button,
    Checkbox,
    CopyInput,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { downloadStream } from "@budibase/frontend-core"
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
  const MS_TEAMS_UNLINK_COMMAND = ChatCommands.UNLINK
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
  let downloadingPackage = $state(false)
  let provisionResult = $state<
    ProvisionAgentMSTeamsChannelResponse | undefined
  >()

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.MSTeamsIntegration?.messagingEndpointUrl ||
      ""
  )

  const appIdError = $derived.by(() => {
    const appId = draft.appId.trim()
    return appId && !isValidUUID(appId)
      ? "App ID must be a valid UUID"
      : undefined
  })

  const hasRequiredCredentials = $derived.by(() => {
    return !!(
      draft.appId.trim() &&
      !appIdError &&
      draft.appPassword.trim() &&
      draft.tenantId.trim()
    )
  })

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

  const provisionMSTeamsChannel = async () => {
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
          messagingEndpointUrl: agent.MSTeamsIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
          requireUserLink: draft.requireUserLink,
        },
      })
      provisionResult = await agentsStore.provisionMSTeamsChannel(agent._id)
      if (agent.live) {
        await deploymentStore.publishApp()
      }
      notifications.success("Microsoft Teams channel settings saved")
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
    if (!agent?._id || downloadingPackage || !isProvisioned) {
      return
    }

    downloadingPackage = true
    try {
      const response = await agentsStore.downloadMSTeamsPackage(agent._id)
      await downloadStream(response)
      notifications.success("Microsoft Teams app package downloaded")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to download Microsoft Teams app package")
    } finally {
      downloadingPackage = false
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
  actionDisabled={provisioning || downloadingPackage || !hasRequiredCredentials}
  onAction={async () => {
    await provisionMSTeamsChannel()
  }}
>
  {#snippet fields()}
    <Input
      label="App ID (client ID)"
      bind:value={draft.appId}
      error={appIdError}
    />
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
      refresh your Budibase account, and `{MS_TEAMS_UNLINK_COMMAND}` or `/{MS_TEAMS_UNLINK_COMMAND}`
      to disconnect it.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  {/snippet}

  {#snippet additionalActions()}
    <Button
      secondary
      on:click={downloadMSTeamsPackage}
      disabled={provisioning || downloadingPackage || !isProvisioned}
    >
      {downloadingPackage ? "Downloading..." : "Download app package"}
    </Button>
  {/snippet}
</ChannelConfigLayout>
