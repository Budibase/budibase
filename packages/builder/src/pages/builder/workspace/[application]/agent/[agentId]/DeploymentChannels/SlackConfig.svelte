<script lang="ts">
  import {
    Body,
    Button,
    Checkbox,
    CopyInput,
    Input,
    notifications,
  } from "@budibase/bbui"
  import { ChatCommands } from "@budibase/shared-core"
  import type {
    Agent,
    ProvisionAgentSlackChannelResponse,
  } from "@budibase/types"
  import { agentsStore } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import ChannelConfigLayout from "./ChannelConfigLayout.svelte"
  import {
    DEFAULT_IDLE_TIMEOUT_MINUTES,
    toOptionalIdleTimeout,
    toOptionalValue,
  } from "./utils"

  const SLACK_LINK_COMMAND = ChatCommands.LINK
  let { agent }: { agent?: Agent } = $props()

  let draftAgentId: string | undefined = $state()
  let draft = $state({
    botToken: "",
    signingSecret: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
    requireUserLink: true,
  })

  let provisioning = $state(false)
  let downloadingManifest = $state(false)
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
      requireUserLink: integration?.requireUserLink !== false,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

  const getManifestFilename = () => {
    const safeName = (agent?.name || "agent")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    return `budibase-slack-${safeName || "agent"}-manifest.json`
  }

  const downloadTextFile = (contents: string, filename: string) => {
    const url = URL.createObjectURL(
      new Blob([contents], { type: "application/json" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const provisionSlackChannel = async (showNotification = true) => {
    if (!agent?._id || provisioning) {
      return false
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
          requireUserLink: draft.requireUserLink,
        },
      })
      provisionResult = await agentsStore.provisionSlackChannel(agent._id)
      if (agent.live) {
        await deploymentStore.publishApp()
      }
      if (showNotification) {
        notifications.success("Slack channel settings saved")
      }
      return true
    } catch (error) {
      console.error(error)
      notifications.error("Failed to save Slack channel settings")
      return false
    } finally {
      provisioning = false
    }
  }

  const downloadSlackManifest = async () => {
    if (!agent?._id || downloadingManifest || !hasRequiredCredentials) {
      return
    }

    downloadingManifest = true
    try {
      const saved = await provisionSlackChannel(false)
      if (!saved) {
        return
      }
      const manifest = await agentsStore.downloadSlackManifest(agent._id)
      downloadTextFile(manifest, getManifestFilename())
      notifications.success("Slack manifest downloaded")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to download Slack manifest")
    } finally {
      downloadingManifest = false
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
    <div class="field-grid-leading">
      <Checkbox
        bind:value={draft.requireUserLink}
        text="Require users to link a Budibase account"
      />
    </div>
  {/snippet}

  {#snippet response()}
    <Body size="S">
      Mention the bot in a channel or send it a DM to ask a question. Slack
      threads are used as the conversation boundary automatically.
    </Body>
    <Body size="S">
      Use `/{SLACK_LINK_COMMAND}` to link or refresh your Budibase account.
    </Body>

    <CopyInput
      label="Messaging endpoint URL"
      value={messagingEndpointUrl}
      disabled
    />
    <div class="manifest-action">
      <Button
        secondary
        on:click={downloadSlackManifest}
        disabled={provisioning ||
          downloadingManifest ||
          !hasRequiredCredentials}
      >
        {downloadingManifest ? "Downloading..." : "Download manifest"}
      </Button>
    </div>
  {/snippet}
</ChannelConfigLayout>

<style>
  .manifest-action {
    display: flex;
    justify-content: flex-start;
  }
</style>
