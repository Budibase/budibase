<script lang="ts">
  import { Body, CopyInput, Input, notifications } from "@budibase/bbui"
  import { DiscordCommands } from "@budibase/shared-core"
  import type { Agent, SyncAgentDiscordCommandsResponse } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import { toOptionalIdleTimeout, toOptionalValue } from "./utils"

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

  const hasRequiredConfig = $derived.by(
    () =>
      !!(
        draft.applicationId.trim() &&
        draft.publicKey.trim() &&
        draft.botToken.trim() &&
        draft.guildId.trim()
      )
  )

  const hasAiConfig = $derived.by(() => !!agent?.aiconfig?.trim())

  const isConnected = $derived.by(() => {
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

  const syncCommands = async () => {
    if (!agent?._id || syncing || !hasRequiredConfig) {
      return
    }

    if (!hasAiConfig) {
      try {
        await saveDiscordIntegration()
        notifications.success("Discord configuration saved")
      } catch (error) {
        console.error(error)
        notifications.error("Failed to save Discord configuration")
      }
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

<ChannelConfigLayout
  statusPositive={isConnected}
  positiveStatusLabel="Connected"
  negativeStatusLabel="Not connected"
  actionLabel={!hasAiConfig
    ? saving
      ? "Saving..."
      : "Save configuration"
    : syncing
      ? "Enabling..."
      : isConnected
        ? "Update channel"
        : "Enable channel"}
  actionDisabled={saving || syncing || !hasRequiredConfig}
  onAction={syncCommands}
>
  {#snippet fields()}
    <Input label="Application ID" bind:value={draft.applicationId} />
    <div class="secret-input">
      <Input
        label="Public key"
        type="password"
        autocomplete="new-password"
        bind:value={draft.publicKey}
      />
    </div>
    <div class="secret-input">
      <Input
        label="Bot token"
        type="password"
        autocomplete="new-password"
        bind:value={draft.botToken}
      />
    </div>
    <Input label="Guild ID" bind:value={draft.guildId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  {/snippet}

  {#snippet response()}
    {#if !hasAiConfig}
      <Body size="S">{AI_CONFIG_REQUIRED_MESSAGE}</Body>
    {/if}

    {#if inviteUrl}
      <CopyInput label="Discord invite URL" value={inviteUrl} disabled />
    {/if}

    {#if isConnected}
      <div class="synced-info">
        <Body size="S"
          >Commands synced: /{DISCORD_ASK_COMMAND} and /{DISCORD_NEW_COMMAND}</Body
        >
      </div>
      <CopyInput label="Webhook URL" value={webhookUrl} disabled />
    {/if}
  {/snippet}
</ChannelConfigLayout>

<style>
  .synced-info {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
