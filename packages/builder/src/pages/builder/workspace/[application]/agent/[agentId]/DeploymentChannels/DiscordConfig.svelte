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
  import { DiscordCommands } from "@budibase/shared-core"
  import type { Agent, SyncAgentDiscordCommandsResponse } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"

  const DISCORD_ASK_COMMAND = DiscordCommands.ASK
  const DISCORD_NEW_COMMAND = DiscordCommands.NEW
  const DEFAULT_IDLE_TIMEOUT_MINUTES = 45
  const AI_CONFIG_REQUIRED_MESSAGE =
    "Select an AI model in Agent config before enabling Discord."

  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    applicationId: "",
    publicKey: "",
    botToken: "",
    guildId: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let syncing = $state(false)
  let saving = $state(false)
  let syncResult = $state<SyncAgentDiscordCommandsResponse | undefined>()

  const hasConfig = $derived.by(() => {
    const integration = agent?.discordIntegration
    return !!(
      integration?.applicationId &&
      integration?.publicKey &&
      integration?.botToken &&
      integration?.guildId
    )
  })

  const hasAiConfig = $derived.by(() => !!agent?.aiconfig?.trim())

  const isEnabled = $derived.by(() => {
    if (syncResult?.success) {
      return true
    }
    return !!agent?.discordIntegration?.interactionsEndpointUrl
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
          chatAppId: agent.discordIntegration?.chatAppId,
          interactionsEndpointUrl:
            agent.discordIntegration?.interactionsEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      await agentsStore.fetchAgents()
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      saving = false
    }
  }

  const connect = async () => {
    try {
      await saveDiscordIntegration()
      notifications.success("Discord configuration saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Discord configuration")
    }
  }

  const enableChannel = async () => {
    if (!agent?._id || syncing) {
      return
    }
    if (!hasAiConfig) {
      notifications.error(AI_CONFIG_REQUIRED_MESSAGE)
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
    <Input label="Public key" type="password" bind:value={draft.publicKey} />
    <Input label="Bot token" type="password" bind:value={draft.botToken} />
    <Input label="Guild ID" bind:value={draft.guildId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  </div>

  <div class="response-section">
    <Label size="L">Response</Label>
    <div class="status-light">
      <StatusLight positive={isEnabled} neutral={!isEnabled}>
        {isEnabled ? "Connected" : "Not connected"}
      </StatusLight>
    </div>

    {#if hasConfig}
      <CopyInput label="Discord invite URL" value={inviteUrl} disabled />
    {/if}

    {#if hasConfig && !isEnabled}
      <Body size="S">
        Invite the bot to your server using the URL above, then enable the
        channel below.
      </Body>
      {#if !hasAiConfig}
        <Body size="S">{AI_CONFIG_REQUIRED_MESSAGE}</Body>
      {/if}
    {/if}

    {#if isEnabled}
      <div class="synced-info">
        <Body size="S"
          >Commands synced: /{DISCORD_ASK_COMMAND} and /{DISCORD_NEW_COMMAND}</Body
        >
      </div>
      <CopyInput label="Webhook URL" value={webhookUrl} disabled />
    {/if}
  </div>

  <div class="actions">
    {#if !hasConfig}
      <Button cta on:click={connect} disabled={saving}>
        {saving ? "Connecting..." : "Connect"}
      </Button>
    {:else}
      <Button secondary on:click={connect} disabled={saving || syncing}>
        {saving ? "Saving..." : "Save"}
      </Button>
      <Button
        cta
        on:click={enableChannel}
        disabled={saving || syncing || !hasAiConfig}
      >
        {syncing
          ? "Enabling..."
          : isEnabled
            ? "Update channel"
            : "Enable channel"}
      </Button>
    {/if}
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
    gap: var(--spacing-m);
  }

  @media (max-width: 900px) {
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
