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
    configToken: "",
    idleTimeoutMinutes: DEFAULT_IDLE_TIMEOUT_MINUTES,
    requireUserLink: true,
  })

  let provisioning = $state(false)
  let creatingSlackApp = $state(false)
  let copyingManifest = $state(false)
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
      configToken: "",
      idleTimeoutMinutes:
        integration?.idleTimeoutMinutes || DEFAULT_IDLE_TIMEOUT_MINUTES,
      requireUserLink: integration?.requireUserLink !== false,
    }
    provisionResult = undefined
    draftAgentId = currentAgent._id
  })

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

  const saveSlackChannel = async () => {
    await provisionSlackChannel()
  }

  const copySlackManifest = async () => {
    if (!agent?._id || copyingManifest || !hasRequiredCredentials) {
      return
    }

    copyingManifest = true
    try {
      const saved = await provisionSlackChannel(false)
      if (!saved) {
        return
      }
      const manifest = await agentsStore.downloadSlackManifest(agent._id)
      await navigator.clipboard.writeText(manifest)
      notifications.success("Slack manifest copied to clipboard")
    } catch (error) {
      console.error(error)
      notifications.error("Failed to copy Slack manifest")
    } finally {
      copyingManifest = false
    }
  }

  const createSlackApp = async () => {
    if (!agent?._id || creatingSlackApp || !draft.configToken.trim()) {
      return
    }

    creatingSlackApp = true
    try {
      await agentsStore.updateAgent({
        ...agent,
        slackIntegration: {
          ...agent.slackIntegration,
          idleTimeoutMinutes: toOptionalIdleTimeout(draft.idleTimeoutMinutes),
          requireUserLink: draft.requireUserLink,
        },
      })
      const result = await agentsStore.createSlackApp(agent._id, {
        configToken: draft.configToken.trim(),
      })
      window.location.href = result.oauthAuthorizeUrl
    } catch (error) {
      console.error(error)
      notifications.error("Failed to create Slack app")
    } finally {
      creatingSlackApp = false
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
  onAction={saveSlackChannel}
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
    <div class="guided-setup">
      <Body size="S">
        To create the Slack app automatically, generate a Slack app
        configuration token from Slack app settings and paste it here. Budibase
        uses it once and does not store it.
      </Body>
      <Input
        label="Slack app configuration token"
        type="password"
        bind:value={draft.configToken}
      />
      <Button
        secondary
        on:click={createSlackApp}
        disabled={creatingSlackApp || !draft.configToken.trim()}
      >
        {creatingSlackApp ? "Creating app..." : "Create Slack app"}
      </Button>
    </div>
    <div class="manifest-action">
      <Button
        secondary
        on:click={copySlackManifest}
        disabled={provisioning || copyingManifest || !hasRequiredCredentials}
      >
        {copyingManifest ? "Copying..." : "Copy manifest"}
      </Button>
    </div>
  {/snippet}
</ChannelConfigLayout>

<style>
  .manifest-action {
    display: flex;
    justify-content: flex-start;
  }

  .guided-setup {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .guided-setup :global(button) {
    align-self: flex-start;
  }
</style>
