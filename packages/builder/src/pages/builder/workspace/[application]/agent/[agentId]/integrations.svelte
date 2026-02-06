<script lang="ts">
  import { Body, Button, Input, notifications } from "@budibase/bbui"
  import type { Agent, SyncAgentDiscordCommandsResponse } from "@budibase/types"
  import { agentsStore, selectedAgent } from "@/stores/portal"
  import { onMount } from "svelte"

  const DEFAULT_ASK_COMMAND = "ask"
  const DEFAULT_NEW_COMMAND = "new"
  const DEFAULT_IDLE_TIMEOUT_MINUTES = 45

  let currentAgent: Agent | undefined = $derived($selectedAgent)
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

  $effect(() => {
    const agent = currentAgent
    if (!agent || agent._id === draftAgentId) {
      return
    }

    const integration = agent.discordIntegration
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
    draftAgentId = agent._id
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
    if (!currentAgent?._id) {
      return
    }
    if (saving) {
      return
    }

    saving = true
    try {
      await agentsStore.updateAgent({
        ...currentAgent,
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
    if (!currentAgent?._id) {
      return
    }
    if (syncing) {
      return
    }

    syncing = true
    try {
      await saveDiscordIntegration(false)
      syncResult = await agentsStore.syncDiscordCommands(
        currentAgent._id,
        toOptionalValue(draft.chatAppId)
      )
      notifications.success("Discord commands synced")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to sync Discord commands")
    } finally {
      syncing = false
    }
  }

  onMount(async () => {
    if (!$agentsStore.agentsLoaded) {
      await agentsStore.init()
    }
  })
</script>

<div class="section">
  <Body size="S">
    Configure Discord command registration for this agent, then sync commands to
    your Discord guild.
  </Body>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Application ID"
      labelPosition="left"
      bind:value={draft.applicationId}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Public key"
      labelPosition="left"
      bind:value={draft.publicKey}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Bot token"
      labelPosition="left"
      type="password"
      bind:value={draft.botToken}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input label="Guild ID" labelPosition="left" bind:value={draft.guildId} />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Ask command"
      labelPosition="left"
      bind:value={draft.askCommandName}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="New command"
      labelPosition="left"
      bind:value={draft.newCommandName}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Chat app ID (optional)"
      labelPosition="left"
      bind:value={draft.chatAppId}
    />
  </div>
</div>

<div class="form-row">
  <div class="form-field">
    <Input
      label="Idle timeout (minutes)"
      labelPosition="left"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  </div>
</div>

<div class="actions">
  <Button secondary on:click={() => saveDiscordIntegration()} disabled={saving}>
    Save integration
  </Button>
  <Button primary on:click={syncCommands} disabled={saving || syncing}>
    {syncing ? "Syncing..." : "Sync Discord commands"}
  </Button>
</div>

{#if syncResult}
  <div class="sync-result">
    <Body size="S"><strong>Chat app ID:</strong> {syncResult.chatAppId}</Body>
    <Body size="S">
      <strong>Interactions endpoint:</strong>
      {syncResult.interactionsEndpointUrl}
    </Body>
    <Body size="S"><strong>Invite URL:</strong> {syncResult.inviteUrl}</Body>
    <Body size="S">
      <strong>Commands:</strong> /{syncResult.askCommandName}, /{syncResult.newCommandName}
    </Body>
  </div>
{/if}

<style>
  .section {
    margin-bottom: var(--spacing-m);
  }

  .actions {
    display: flex;
    gap: var(--spacing-s);
    margin-top: var(--spacing-m);
  }

  .sync-result {
    margin-top: var(--spacing-m);
    padding: var(--spacing-m);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    background: var(--background-alt);
    display: grid;
    gap: var(--spacing-xs);
  }
</style>
