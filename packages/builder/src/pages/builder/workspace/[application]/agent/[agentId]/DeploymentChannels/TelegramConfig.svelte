<script lang="ts">
  import {
    Body,
    CopyInput,
    InlineAlert,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { ChatCommands } from "@budibase/shared-core"
  import type {
    Agent,
    ProvisionAgentTelegramChannelResponse,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import {
    DEFAULT_IDLE_TIMEOUT_MINUTES,
    toOptionalIdleTimeout,
    toOptionalValue,
  } from "./utils"

  const TELEGRAM_LINK_COMMAND = ChatCommands.LINK
  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    botToken: "",
    webhookSecretToken: "",
    botUserName: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let provisioning = $state(false)
  let provisionResult = $state<
    ProvisionAgentTelegramChannelResponse | undefined
  >()

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.telegramIntegration?.messagingEndpointUrl ||
      ""
  )

  const hasRequiredCredentials = $derived.by(() => !!draft.botToken.trim())

  const isProvisioned = $derived.by(
    () => messagingEndpointUrl.trim().length > 0
  )

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.telegramIntegration
    draft = {
      botToken: integration?.botToken || "",
      webhookSecretToken: integration?.webhookSecretToken || "",
      botUserName: integration?.botUserName || "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

  const provisionTelegramChannel = async () => {
    if (!agent?._id || provisioning) {
      return
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        telegramIntegration: {
          botToken: toOptionalValue(draft.botToken),
          webhookSecretToken: toOptionalValue(draft.webhookSecretToken),
          botUserName: toOptionalValue(draft.botUserName),
          chatAppId: agent.telegramIntegration?.chatAppId,
          messagingEndpointUrl: agent.telegramIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      provisionResult = await agentsStore.provisionTelegramChannel(agent._id)
      notifications.success("Telegram channel settings saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Telegram channel settings")
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
  onAction={provisionTelegramChannel}
>
  {#snippet fields()}
    <Input label="Bot token" type="password" bind:value={draft.botToken} />
    <Input
      label="Webhook secret token (optional)"
      type="password"
      bind:value={draft.webhookSecretToken}
    />
    <Input
      label="Bot username (optional)"
      placeholder="my_bot"
      bind:value={draft.botUserName}
    />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  {/snippet}

  {#snippet response()}
    <Body size="S">
      Saving the channel automatically registers this endpoint with Telegram. If
      you set a webhook secret token, use the same value here so requests can be
      verified.
    </Body>
    <Body size="S">
      Use <code>/{TELEGRAM_LINK_COMMAND}</code> to link or refresh your Budibase
      account.
    </Body>

    {#if provisionResult?.warning}
      <InlineAlert
        type="negative"
        header="Webhook registration failed"
        message={provisionResult.warning}
      />
    {/if}
    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  {/snippet}
</ChannelConfigLayout>
