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

  const isConnected = $derived.by(() => {
    if (syncResult?.success) {
      return true
    }
    return !!(
      draft.applicationId.trim() &&
      draft.publicKey.trim() &&
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

<ChannelConfigLayout
  statusPositive={isConnected}
  positiveStatusLabel="Connected"
  negativeStatusLabel="Not connected"
  actionLabel={syncing
    ? "Enabling..."
    : isConnected
      ? "Update channel"
      : "Enable channel"}
  actionDisabled={saving || syncing}
  onAction={syncCommands}
>
  {#snippet fields()}
    <Input label="Application ID" bind:value={draft.applicationId} />
    <Input label="Public key" type="password" bind:value={draft.publicKey} />
    <Input label="Bot token" type="password" bind:value={draft.botToken} />
    <Input label="Guild ID" bind:value={draft.guildId} />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  {/snippet}

  {#snippet response()}
    {#if syncResult}
      <div class="synced-info">
        <Body size="S"
          >Commands synced: /{DISCORD_ASK_COMMAND} and /{DISCORD_NEW_COMMAND}</Body
        >
      </div>
    {/if}

    <CopyInput label="Webhook URL" value={webhookUrl} disabled />

    {#if inviteUrl}
      <CopyInput label="Discord invite URL" value={inviteUrl} disabled />
    {/if}
  {/snippet}
</ChannelConfigLayout>

<style>
  .synced-info {
    color: var(--spectrum-global-color-gray-700);
  }
</style>
