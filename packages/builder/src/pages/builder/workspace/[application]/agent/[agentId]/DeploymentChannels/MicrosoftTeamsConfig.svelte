<script lang="ts">
  import { Body, CopyInput, Input, notifications } from "@budibase/bbui"
  import type {
    Agent,
    ProvisionAgentMSTeamsChannelResponse,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import { toOptionalIdleTimeout, toOptionalValue } from "./utils"

  const MS_TEAMS_NEW_COMMAND = "new"
  const MS_TEAMS_ASK_COMMAND = "ask"
  const DEFAULT_IDLE_TIMEOUT_MINUTES = 45

  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    appId: "",
    appPassword: "",
    tenantId: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let provisioning = $state(false)
  let provisionResult = $state<
    ProvisionAgentMSTeamsChannelResponse | undefined
  >()

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.MSTeamsIntegration?.messagingEndpointUrl ||
      ""
  )

  const hasRequiredCredentials = $derived.by(
    () => !!(draft.appId.trim() && draft.appPassword.trim())
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
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

  const provisionMSTeamsChannel = async () => {
    if (!agent?._id || provisioning) {
      return
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        MSTeamsIntegration: {
          appId: toOptionalValue(draft.appId),
          appPassword: toOptionalValue(draft.appPassword),
          tenantId: toOptionalValue(draft.tenantId),
          chatAppId: agent.MSTeamsIntegration?.chatAppId,
          messagingEndpointUrl: agent.MSTeamsIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      provisionResult = await agentsStore.provisionMSTeamsChannel(agent._id)
      await agentsStore.fetchAgents()
      notifications.success("Microsoft Teams channel settings saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Microsoft Teams channel settings")
    } finally {
      provisioning = false
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
>
  {#snippet fields()}
    <Input label="App ID (client ID)" bind:value={draft.appId} />
    <Input
      label="Client secret (value)"
      type="password"
      bind:value={draft.appPassword}
    />
    <Input
      label="Directory (tenant) ID (optional)"
      bind:value={draft.tenantId}
    />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  {/snippet}

  {#snippet response()}
    <Body size="S">
      Use `{MS_TEAMS_ASK_COMMAND}` to ask a question.
    </Body>
    <Body size="S">
      Use `{MS_TEAMS_NEW_COMMAND}` to start a new conversation.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  {/snippet}
</ChannelConfigLayout>
