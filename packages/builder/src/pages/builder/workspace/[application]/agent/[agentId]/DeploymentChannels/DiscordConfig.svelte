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
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let syncing = $state(false)
  let saving = $state(false)
  let syncResult = $state<SyncAgentDiscordCommandsResponse | undefined>()

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

  const webhookUrl = $derived(
    syncResult?.interactionsEndpointUrl ||
      agent?.discordIntegration?.interactionsEndpointUrl ||
      ""
  )

  const inviteUrl = $derived.by(() => {
    if (syncResult?.inviteUrl) {
      return syncResult.inviteUrl
    }
    const appId = draft.applicationId.trim()
    if (appId) {
      return `https://discord.com/oauth2/authorize?client_id=${appId}&scope=bot+applications.commands&permissions=0`
    }
    return ""
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

  const saveDiscordIntegration = async () => {
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
          chatAppId: agent.discordIntegration?.chatAppId,
          interactionsEndpointUrl:
            agent.discordIntegration?.interactionsEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      await agentsStore.fetchAgents()
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
      await saveDiscordIntegration()
      syncResult = await agentsStore.syncDiscordCommands(agent._id)
      notifications.success("Discord channel enabled")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync Discord commands")
    } finally {
      syncing = false
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
    {#if syncResult}
      <div class="synced-info">
        <Body size="S">
          Commands synced: /{syncResult.askCommandName} and /{syncResult.newCommandName}
        </Body>
      </div>
    {/if}

    <CopyInput label="Webhook URL" value={webhookUrl} />

    {#if inviteUrl}
      <CopyInput label="Discord invite URL" value={inviteUrl} />
    {/if}
  </div>

  <div class="actions">
    <Button cta on:click={syncCommands} disabled={saving || syncing}>
      {syncing
        ? "Enabling..."
        : isConnected
          ? "Update channel"
          : "Enable channel"}
    </Button>
  </div>
</div>

<style>
  .discord-config {
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

  .synced-info {
    color: var(--spectrum-global-color-gray-700);
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
