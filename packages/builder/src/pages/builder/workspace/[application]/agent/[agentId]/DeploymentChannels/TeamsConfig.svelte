<script lang="ts">
  import {
    Body,
    Button,
    CopyInput,
    Input,
    Label,
    StatusLight,
    notifications,
  } from "@budibase/bbui"
  import type { Agent, ProvisionAgentTeamsChannelResponse } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"

  const TEAMS_NEW_COMMAND = "new"
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
  let provisionResult = $state<ProvisionAgentTeamsChannelResponse | undefined>()

  const isConnected = $derived.by(() => {
    if (provisionResult?.success) {
      return true
    }
    return !!(draft.appId.trim() && draft.appPassword.trim())
  })

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.teamsIntegration?.messagingEndpointUrl ||
      ""
  )

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.teamsIntegration
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

  const toOptionalValue = (value: string) => {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  const toOptionalIdleTimeout = (value: number) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return undefined
    }
    return Math.floor(parsed)
  }

  const provisionTeamsChannel = async () => {
    if (!agent?._id || provisioning) {
      return
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        teamsIntegration: {
          appId: toOptionalValue(draft.appId),
          appPassword: toOptionalValue(draft.appPassword),
          tenantId: toOptionalValue(draft.tenantId),
          chatAppId: agent.teamsIntegration?.chatAppId,
          messagingEndpointUrl: agent.teamsIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      provisionResult = await agentsStore.provisionTeamsChannel(agent._id)
      await agentsStore.fetchAgents()
      notifications.success("Microsoft Teams channel enabled")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to enable Microsoft Teams channel")
    } finally {
      provisioning = false
    }
  }
</script>

<div class="teams-config">
  <div class="field-grid">
    <Input label="App ID (client ID)" bind:value={draft.appId} />
    <Input
      label="Client secret (value)"
      type="password"
      bind:value={draft.appPassword}
    />
    <Input label="Directory (tenant) ID (optional)" bind:value={draft.tenantId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  </div>

  <div class="response-section">
    <Label size="L">Response</Label>
    <div class="status-light">
      <StatusLight positive={isConnected} neutral={!isConnected}>
        {isConnected ? "Connected" : "Not connected"}
      </StatusLight>
    </div>

    <Body size="S">
      Users can send any message to chat. Add `{TEAMS_NEW_COMMAND}` as a command
      to start a new conversation.
    </Body>
    <Body size="S">
      Supported scopes: personal chat, group chat, and team channel chat.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  </div>

  <div class="actions">
    <Button cta on:click={provisionTeamsChannel} disabled={provisioning}>
      {provisioning
        ? "Enabling..."
        : isConnected
          ? "Update channel"
          : "Enable channel"}
    </Button>
  </div>
</div>

<style>
  .teams-config {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-s) var(--spacing-m);
  }

  .response-section {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .status-light :global(.spectrum-StatusLight) {
    justify-content: flex-start;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 900px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
