<script lang="ts">
  import { Body, CopyInput, Input, notifications } from "@budibase/bbui"
  import type {
    Agent,
    ProvisionAgentSlackChannelResponse,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import {
    DEFAULT_IDLE_TIMEOUT_MINUTES,
    toOptionalIdleTimeout,
    toOptionalValue,
  } from "./utils"

  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    botToken: "",
    signingSecret: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
  })

  let provisioning = $state(false)
  let provisionResult = $state<ProvisionAgentSlackChannelResponse | undefined>()

  const messagingEndpointUrl = $derived(
    provisionResult?.messagingEndpointUrl ||
      agent?.slackIntegration?.messagingEndpointUrl ||
      ""
  )

  const hasRequiredCredentials = $derived.by(
    () => !!(draft.botToken.trim() && draft.signingSecret.trim())
  )

  const isProvisioned = $derived.by(
    () => messagingEndpointUrl.trim().length > 0
  )

  $effect(() => {
    const currentAgent = agent
    if (!currentAgent || currentAgent._id === draftAgentId) {
      return
    }

    const integration = currentAgent.slackIntegration
    draft = {
      botToken: integration?.botToken || "",
      signingSecret: integration?.signingSecret || "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

  const provisionSlackChannel = async () => {
    if (!agent?._id || provisioning) {
      return
    }

    provisioning = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        slackIntegration: {
          botToken: toOptionalValue(draft.botToken),
          signingSecret: toOptionalValue(draft.signingSecret),
          chatAppId: agent.slackIntegration?.chatAppId,
          messagingEndpointUrl: agent.slackIntegration?.messagingEndpointUrl,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
        },
      })
      provisionResult = await agentsStore.provisionSlackChannel(agent._id)
      notifications.success("Slack channel settings saved")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Slack channel settings")
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
  onAction={provisionSlackChannel}
>
  {#snippet fields()}
    <Input label="Bot token" type="password" bind:value={draft.botToken} />
    <Input
      label="Signing secret"
      type="password"
      bind:value={draft.signingSecret}
    />
    <Input
      label="Idle timeout (minutes)"
      type="number"
      bind:value={draft.idleTimeoutMinutes}
    />
  {/snippet}

  {#snippet response()}
    <Body size="S">
      Mention the bot in a channel or send it a DM. Slack threads are used as
      the conversation boundary automatically.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
  {/snippet}
</ChannelConfigLayout>
