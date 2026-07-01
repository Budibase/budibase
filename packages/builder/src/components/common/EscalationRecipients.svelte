<script lang="ts">
  import {
    type ChatIdentityLink,
    EscalationNotificationChannel,
  } from "@budibase/types"
  import { API } from "@/api"
  import type {
    SlackChannel,
    MSTeamsChannel,
  } from "@budibase/frontend-core/src/api/chatLinks"
  import {
    ActionButton,
    Button,
    Select,
    Tag,
    Tags,
    Input,
    notifications,
  } from "@budibase/bbui"

  type Recipient = { type: string; config: Record<string, any> }

  export let recipients: Recipient[] = []
  export let agentId: string | undefined = undefined
  export let onChange: (recipients: Recipient[]) => void = () => {}
  // Single mode: cap at one recipient (still stored as an array). Once chosen,
  // the add button is replaced by a clear-recipient affordance.
  export let single: boolean = false

  const PROVIDER_OPTIONS = [
    { value: EscalationNotificationChannel.SLACK, label: "Slack" },
    { value: EscalationNotificationChannel.DISCORD, label: "Discord" },
    { value: EscalationNotificationChannel.MSTEAMS, label: "Teams" },
    { value: EscalationNotificationChannel.TELEGRAM, label: "Telegram" },
  ]

  const PROVIDER_LABELS: Record<string, string> = Object.fromEntries(
    PROVIDER_OPTIONS.map(o => [o.value, o.label])
  )

  interface PendingRecipient {
    provider: EscalationNotificationChannel | ""
    targetType: "user" | "channel"
    userId: string
    channelId: string
    discordChannelId: string
    teamsInputMode: "lookup" | "url" | "manual"
    teamsUrl: string
    teamsChannelId: string
    teamsTeamId: string
    teamsChannelName: string
  }

  const DEFAULT_PENDING: PendingRecipient = {
    provider: "",
    targetType: "user",
    userId: "",
    channelId: "",
    discordChannelId: "",
    teamsInputMode: "lookup",
    teamsUrl: "",
    teamsChannelId: "",
    teamsTeamId: "",
    teamsChannelName: "",
  }

  let identityLinks: ChatIdentityLink[] = []
  let slackChannels: SlackChannel[] = []
  let teamsChannels: MSTeamsChannel[] = []

  let isAdding = false
  let pending: PendingRecipient = { ...DEFAULT_PENDING }

  // Reset all pending fields; optionally keep the chosen provider.
  const resetPending = (keepProvider = false) => {
    pending = {
      ...DEFAULT_PENDING,
      provider: keepProvider ? pending.provider : "",
    }
  }

  // Switch Teams input mode, clearing the other modes' fields.
  const setTeamsMode = (teamsInputMode: PendingRecipient["teamsInputMode"]) => {
    pending = {
      ...pending,
      teamsInputMode,
      teamsUrl: "",
      teamsChannelId: "",
      teamsTeamId: "",
      teamsChannelName: "",
    }
  }

  $: recipientLabels = recipients.map(r => getRecipientLabel(r, identityLinks))

  $: {
    API.fetchChatIdentityLinks().then((links: ChatIdentityLink[]) => {
      identityLinks = links
    })
  }

  $: filteredIdentityLinks = identityLinks.filter(
    l => (l.provider as string) === (pending.provider as string)
  )

  $: supportsChannel =
    pending.provider === EscalationNotificationChannel.SLACK ||
    pending.provider === EscalationNotificationChannel.DISCORD ||
    pending.provider === EscalationNotificationChannel.MSTEAMS

  $: if (
    pending.provider === EscalationNotificationChannel.SLACK &&
    pending.targetType === "channel" &&
    agentId
  ) {
    API.fetchSlackChannels(agentId).then((channels: SlackChannel[]) => {
      slackChannels = channels
    })
  }

  $: if (
    pending.provider === EscalationNotificationChannel.MSTEAMS &&
    pending.targetType === "channel" &&
    pending.teamsInputMode === "lookup" &&
    agentId
  ) {
    API.fetchMSTeamsChannels(agentId)
      .then((channels: MSTeamsChannel[]) => {
        teamsChannels = channels
      })
      .catch(() =>
        notifications.error(
          "Couldn't load Teams channels — check the bot's Graph permissions"
        )
      )
  }

  $: canAdd = (() => {
    if (!pending.provider) return false
    if (pending.targetType === "user") return !!pending.userId
    if (pending.provider === EscalationNotificationChannel.SLACK)
      return !!pending.channelId
    if (pending.provider === EscalationNotificationChannel.DISCORD)
      return !!pending.discordChannelId
    if (pending.provider === EscalationNotificationChannel.MSTEAMS) {
      if (pending.teamsInputMode === "url")
        return !!parseTeamsChannelUrl(pending.teamsUrl)
      return !!pending.teamsChannelId && !!pending.teamsTeamId
    }
    return false
  })()

  const parseTeamsChannelUrl = (
    url: string
  ): { channelId: string; teamId: string; channelName?: string } | null => {
    try {
      const parsed = new URL(url)
      const parts = parsed.pathname.split("/")
      const idx = parts.indexOf("channel")
      if (idx === -1 || !parts[idx + 1]) return null
      const channelId = decodeURIComponent(parts[idx + 1])
      const teamId = parsed.searchParams.get("groupId")
      if (!channelId || !teamId) return null
      const channelName = parts[idx + 2]
        ? decodeURIComponent(parts[idx + 2])
        : undefined
      return { channelId, teamId, channelName }
    } catch {
      return null
    }
  }

  const getRecipientLabel = (
    r: Recipient,
    links: ChatIdentityLink[]
  ): string => {
    if (r.config?.channelName) return `#${r.config.channelName}`
    if (r.config?.channelId) return r.config.channelId
    const link = links.find(l => l.globalUserId === r.config?.globalUserId)
    return (
      link?.externalUserName ||
      link?.externalUserId ||
      r.config?.globalUserId ||
      "Unknown"
    )
  }

  const addRecipient = () => {
    if (!canAdd) return

    let recipient: Recipient | undefined

    if (pending.targetType === "user") {
      const link = identityLinks.find(
        l =>
          l.globalUserId === pending.userId &&
          (l.provider as string) === (pending.provider as string)
      )
      if (!link) return
      recipient = {
        type: pending.provider,
        config: {
          globalUserId: link.globalUserId,
          externalUserId: link.externalUserId,
          ...(link.teamId && { teamId: link.teamId }),
          ...(link.guildId && { guildId: link.guildId }),
        },
      }
    } else if (pending.provider === EscalationNotificationChannel.SLACK) {
      const channel = slackChannels.find(c => c.id === pending.channelId)
      if (!channel) return
      recipient = {
        type: EscalationNotificationChannel.SLACK,
        config: { channelId: channel.id, channelName: channel.name },
      }
    } else if (pending.provider === EscalationNotificationChannel.DISCORD) {
      recipient = {
        type: EscalationNotificationChannel.DISCORD,
        config: { channelId: pending.discordChannelId },
      }
    } else if (pending.provider === EscalationNotificationChannel.MSTEAMS) {
      if (pending.teamsInputMode === "url") {
        const parsed = parseTeamsChannelUrl(pending.teamsUrl)
        if (!parsed) return
        recipient = {
          type: EscalationNotificationChannel.MSTEAMS,
          config: {
            channelId: parsed.channelId,
            teamId: parsed.teamId,
            ...(parsed.channelName && { channelName: parsed.channelName }),
          },
        }
      } else {
        recipient = {
          type: EscalationNotificationChannel.MSTEAMS,
          config: {
            channelId: pending.teamsChannelId,
            teamId: pending.teamsTeamId,
            ...(pending.teamsChannelName && {
              channelName: pending.teamsChannelName,
            }),
          },
        }
      }
    }

    if (recipient) {
      onChange(single ? [recipient] : [...recipients, recipient])
    }

    resetAddFlow()
  }

  const removeRecipient = (index: number) => {
    onChange(recipients.filter((_, i) => i !== index))
  }

  const resetAddFlow = () => {
    isAdding = false
    resetPending()
  }
</script>

<div class="recipients">
  {#if recipients.length > 0}
    <Tags>
      {#each recipients as recipient, i}
        <Tag closable on:remove={() => removeRecipient(i)}>
          <span class="recipient-provider"
            >{PROVIDER_LABELS[recipient.type] ?? recipient.type}</span
          >
          <span class="recipient-sep">·</span>
          {recipientLabels[i]}
        </Tag>
      {/each}
    </Tags>
  {/if}

  {#if isAdding}
    <div class="add-flow">
      <Select
        options={PROVIDER_OPTIONS}
        value={pending.provider}
        placeholder="Provider..."
        getOptionLabel={o => o.label}
        getOptionValue={o => o.value}
        on:change={e => {
          pending = { ...DEFAULT_PENDING, provider: e.detail || "" }
        }}
      />

      {#if pending.provider}
        {#if supportsChannel}
          <div class="target-type">
            <ActionButton
              selected={pending.targetType === "user"}
              on:click={() => resetPending(true)}
            >
              User DM
            </ActionButton>
            <ActionButton
              selected={pending.targetType === "channel"}
              on:click={() => {
                pending = {
                  ...DEFAULT_PENDING,
                  provider: pending.provider,
                  targetType: "channel",
                }
              }}
            >
              Channel
            </ActionButton>
          </div>
        {/if}

        {#if pending.targetType === "user"}
          <Select
            options={filteredIdentityLinks}
            value={pending.userId}
            placeholder="Select user..."
            getOptionLabel={l => l.externalUserName || l.externalUserId}
            getOptionValue={l => l.globalUserId}
            on:change={e => (pending.userId = e.detail ?? "")}
          />
        {:else if pending.provider === EscalationNotificationChannel.SLACK}
          <Select
            options={slackChannels}
            value={pending.channelId}
            placeholder="Select channel..."
            getOptionLabel={c => `#${c.name}`}
            getOptionValue={c => c.id}
            on:change={e => (pending.channelId = e.detail ?? "")}
          />
        {:else if pending.provider === EscalationNotificationChannel.DISCORD}
          <Input
            value={pending.discordChannelId}
            placeholder="Discord channel ID..."
            on:change={e => (pending.discordChannelId = e.detail)}
          />
        {:else if pending.provider === EscalationNotificationChannel.MSTEAMS}
          <div class="target-type">
            <ActionButton
              selected={pending.teamsInputMode === "lookup"}
              on:click={() => setTeamsMode("lookup")}
            >
              Lookup
            </ActionButton>
            <ActionButton
              selected={pending.teamsInputMode === "url"}
              on:click={() => setTeamsMode("url")}
            >
              Paste URL
            </ActionButton>
            <ActionButton
              selected={pending.teamsInputMode === "manual"}
              on:click={() => setTeamsMode("manual")}
            >
              Manual
            </ActionButton>
          </div>
          {#if pending.teamsInputMode === "lookup"}
            <Select
              options={teamsChannels}
              value={pending.teamsChannelId}
              placeholder="Select channel..."
              getOptionLabel={c => `${c.teamName} / ${c.name}`}
              getOptionValue={c => c.id}
              on:change={e => {
                const channel = teamsChannels.find(c => c.id === e.detail)
                pending = {
                  ...pending,
                  teamsChannelId: channel?.id ?? "",
                  teamsTeamId: channel?.teamId ?? "",
                  teamsChannelName: channel?.name ?? "",
                }
              }}
            />
          {:else if pending.teamsInputMode === "url"}
            <Input
              value={pending.teamsUrl}
              placeholder="Paste Teams channel link..."
              on:change={e => (pending.teamsUrl = e.detail)}
            />
          {:else}
            <Input
              value={pending.teamsChannelId}
              placeholder="Channel ID (19:abc...@thread.tacv2)"
              on:change={e => (pending.teamsChannelId = e.detail)}
            />
            <Input
              value={pending.teamsTeamId}
              placeholder="Team ID (groupId)"
              on:change={e => (pending.teamsTeamId = e.detail)}
            />
          {/if}
        {/if}
      {/if}

      <div class="add-actions">
        <Button cta disabled={!canAdd} on:click={addRecipient}>Add</Button>
        <Button secondary on:click={resetAddFlow}>Cancel</Button>
      </div>
    </div>
  {:else if single && recipients.length > 0}
    <ActionButton icon="Delete" on:click={() => onChange([])}>
      Clear recipient
    </ActionButton>
  {:else}
    <ActionButton icon="Add" on:click={() => (isAdding = true)}>
      Add recipient
    </ActionButton>
  {/if}
</div>

<style>
  .recipients {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .recipients :global(.spectrum-Tags-item) {
    max-width: 200px;
  }

  .add-flow {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .target-type {
    display: flex;
    gap: var(--spacing-xs);
  }

  .add-actions {
    display: flex;
    gap: var(--spacing-s);
  }

  .recipient-provider {
    font-weight: 600;
    opacity: 0.7;
    font-size: 11px;
    text-transform: uppercase;
  }

  .recipient-sep {
    opacity: 0.4;
    margin: 0 2px;
  }
</style>
