<script lang="ts">
  import { Body, Button, Input, notifications } from "@budibase/bbui"
  import type { Agent, SyncAgentDiscordCommandsResponse } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"

  const DEFAULT_ASK_COMMAND = "ask"
  const DEFAULT_NEW_COMMAND = "new"
  const DEFAULT_IDLE_TIMEOUT_MINUTES = 45

  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    applicationId: "",
    publicKey: "",
    botToken: "",
    guildId: "",
    askCommandName: DEFAULT_ASK_COMMAND,
    newCommandName: DEFAULT_NEW_COMMAND,
    chatAppId: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let saving = $state(false)
  let syncing = $state(false)
  let syncResult = $state<SyncAgentDiscordCommandsResponse | undefined>()
  let webhookUrl = $state("")

  const isConnected = $derived.by(() => {
    if (syncResult?.success) {
      return true
    }
    return !!(
      draft.applicationId.trim() &&
      draft.botToken.trim() &&
      draft.guildId.trim()
    )
  })

  $effect(() => {
    webhookUrl = syncResult?.interactionsEndpointUrl || ""
  })

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.discordIntegration
    draft = {
      applicationId: integration?.applicationId || "",
      publicKey: integration?.publicKey || "",
      botToken: integration?.botToken || "",
      guildId: integration?.guildId || "",
      askCommandName: integration?.askCommandName || DEFAULT_ASK_COMMAND,
      newCommandName: integration?.newCommandName || DEFAULT_NEW_COMMAND,
      chatAppId: integration?.chatAppId || "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
    }
    syncResult = undefined
    draftAgentId = currentAgent._id
  })

  const toOptionalValue = (value: string) => {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  const toOptionalCommandName = (value: string, fallback: string) => {
    const trimmed = value.trim().toLowerCase()
    return trimmed.length > 0 ? trimmed : fallback
  }

  const toOptionalIdleTimeout = (value: number) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return undefined
    }
    return Math.floor(parsed)
  }

  const saveDiscordIntegration = async (showToast = true) => {
    if (!agent?._id || saving) {
      return
    }

    saving = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        discordIntegration: {
          applicationId: toOptionalValue(draft.applicationId),
          publicKey: toOptionalValue(draft.publicKey),
          botToken: toOptionalValue(draft.botToken),
          guildId: toOptionalValue(draft.guildId),
          askCommandName: toOptionalCommandName(
            draft.askCommandName,
            DEFAULT_ASK_COMMAND
          ),
          newCommandName: toOptionalCommandName(
            draft.newCommandName,
            DEFAULT_NEW_COMMAND
          ),
          chatAppId: toOptionalValue(draft.chatAppId),
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      await agentsStore.fetchAgents()
      if (showToast) {
        notifications.success("Discord integration saved")
      }
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Discord integration")
      throw error
    } finally {
      saving = false
    }
  }

  const syncCommands = async () => {
    if (!agent?._id || syncing) {
      return
    }

    syncing = true
    try {
      await saveDiscordIntegration(false)
      syncResult = await agentsStore.syncDiscordCommands(
        agent._id,
        toOptionalValue(draft.chatAppId)
      )
      notifications.success("Discord channel enabled")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync Discord commands")
    } finally {
      syncing = false
    }
  }

  const copyWebhookUrl = async () => {
    if (!webhookUrl) {
      return
    }
    try {
      await navigator.clipboard.writeText(webhookUrl)
      notifications.success("Webhook URL copied")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to copy webhook URL")
    }
  }
</script>

<div class="discord-config">
  <div class="field-grid">
    <Input label="Application ID" bind:value={draft.applicationId} />
    <Input label="Public key" bind:value={draft.publicKey} />
    <Input label="Bot token" type="password" bind:value={draft.botToken} />
    <Input label="Guild ID" bind:value={draft.guildId} />
    <Input label="Ask command" bind:value={draft.askCommandName} />
    <Input label="New command" bind:value={draft.newCommandName} />
    <Input label="Chat app ID (optional)" bind:value={draft.chatAppId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  </div>

  <div class="response-card">
    <div class="response-title">
      <Body size="S">Response</Body>
    </div>
    <div class="response-status">
      <span class="status-dot" class:connected={isConnected}></span>
      <Body size="S">{isConnected ? "Connected" : "Not connected"}</Body>
    </div>

    <div class="webhook-row">
      <Input label="Webhook URL" bind:value={webhookUrl} disabled />
      <Button
        quiet
        size="S"
        icon="copy"
        on:click={copyWebhookUrl}
        disabled={!webhookUrl}
      >
        Copy
      </Button>
    </div>

    {#if syncResult}
      <div class="response-info">
        <Body size="S">
          Commands synced: /{syncResult.askCommandName} and /{syncResult.newCommandName}
        </Body>
      </div>
      <div class="response-info">
        <Body size="S">
          <a
            href={syncResult.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Discord invite link
          </a>
        </Body>
      </div>
    {/if}
  </div>

  <div class="modal-actions">
    <Button
      secondary
      on:click={() => saveDiscordIntegration()}
      disabled={saving || syncing}
    >
      Save
    </Button>
    <Button primary on:click={syncCommands} disabled={saving || syncing}>
      {syncing ? "Enabling..." : "Enable channel"}
    </Button>
  </div>
</div>

<style>
  .discord-config {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }

  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-s) var(--spacing-m);
  }

  .response-card {
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    padding-top: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .response-title {
    font-weight: 500;
  }

  .response-status {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--spectrum-global-color-gray-400);
  }

  .status-dot.connected {
    background: var(--spectrum-semantic-positive-status-color);
  }

  .webhook-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: var(--spacing-s);
  }

  .response-info {
    color: var(--spectrum-global-color-gray-700);
    overflow-wrap: anywhere;
  }

  .response-info a {
    color: var(--spectrum-global-color-blue-600);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
  }

  @media (max-width: 900px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
