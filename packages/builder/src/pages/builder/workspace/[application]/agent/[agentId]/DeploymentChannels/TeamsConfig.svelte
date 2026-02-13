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

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.teamsIntegration?.messagingEndpointUrl ||
      ""
  )

  const hasRequiredCredentials = $derived.by(
    () => !!(draft.appId.trim() && draft.appPassword.trim())
  )

  const isProvisioned = $derived.by(() => messagingEndpointUrl.trim().length > 0)

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
      notifications.success("Microsoft Teams channel settings saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Microsoft Teams channel settings")
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
      <StatusLight positive={isProvisioned} neutral={!isProvisioned}>
        {isProvisioned ? "Configured" : "Not configured"}
      </StatusLight>
    </div>

    <Body size="S">
      Settings are saved when the endpoint URL is available.
    </Body>
    <Body size="S">
      In team channels, users may need to mention the bot unless message-read
      permissions are configured in Teams.
    </Body>
    <Body size="S">
      Use `{TEAMS_NEW_COMMAND}` to start a new conversation.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  </div>

  <div class="actions">
    <Button
      cta
      on:click={provisionTeamsChannel}
      disabled={provisioning || !hasRequiredCredentials}
    >
      {provisioning
        ? "Saving..."
        : isProvisioned
          ? "Save changes"
          : "Save channel"}
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
