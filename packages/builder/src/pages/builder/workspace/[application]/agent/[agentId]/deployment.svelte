<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import {
    AgentChannelProvider,
    DEPLOYMENT_CHANNEL_IDS,
    DEPLOYMENT_ID_TO_PROVIDER,
    FeatureFlag,
    type Agent,
    type DeploymentRow,
  } from "@budibase/types"
  import { selectedAgent, agentsStore, featureFlags } from "@/stores/portal"
  import { deploymentStore } from "@/stores/builder"
  import AgentChatChannel from "./DeploymentChannels/AgentChatChannel.svelte"
  import DiscordConfig from "./DeploymentChannels/DiscordConfig.svelte"
  import MicrosoftTeamsConfig from "./DeploymentChannels/MicrosoftTeamsConfig.svelte"
  import SlackConfig from "./DeploymentChannels/SlackConfig.svelte"
  import DiscordLogo from "assets/discord.svg"
  import MSTeamsLogo from "assets/rest-template-icons/microsoft-teams.svg"
  import SlackLogo from "assets/slack.svg"

  const AI_CONFIG_REQUIRED_MESSAGE =
    "Select an AI model in Agent config before enabling this channel."

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let discordModal: Modal
  let MSTeamsModal: Modal
  let slackModal: Modal
  let toggling = $state(false)

  const discordConfigured = $derived.by(() => {
    const integration = currentAgent?.discordIntegration
    return !!(
      integration?.applicationId?.trim() &&
      integration?.publicKey?.trim() &&
      integration?.botToken?.trim() &&
      integration?.guildId?.trim()
    )
  })

  const MSTeamsConfigured = $derived.by(() => {
    const integration = currentAgent?.MSTeamsIntegration
    return !!(
      integration?.appId?.trim() &&
      integration?.appPassword?.trim() &&
      integration?.tenantId?.trim()
    )
  })

  const slackConfigured = $derived.by(() => {
    const integration = currentAgent?.slackIntegration
    return !!(
      integration?.botToken?.trim() && integration?.signingSecret?.trim()
    )
  })

  const MSTeamsEnabled = $derived(
    !!currentAgent?.MSTeamsIntegration?.messagingEndpointUrl?.trim()
  )

  const discordEnabled = $derived(
    !!currentAgent?.discordIntegration?.interactionsEndpointUrl
  )

  const slackEnabled = $derived(
    !!currentAgent?.slackIntegration?.messagingEndpointUrl?.trim()
  )

  const hasAiConfig = $derived.by(() => !!currentAgent?.aiconfig?.trim())
  const agentChatEnabled = $derived(!!$featureFlags[FeatureFlag.AI_AGENTS])

  const channelMetadata: Record<
    AgentChannelProvider,
    { name: string; logo: string; details: string }
  > = {
    [AgentChannelProvider.DISCORD]: {
      name: "Discord",
      logo: DiscordLogo,
      details: "Allow this agent to respond in Discord channels and threads",
    },
    [AgentChannelProvider.MSTEAMS]: {
      name: "Microsoft Teams",
      logo: MSTeamsLogo,
      details:
        "Configure this agent for Microsoft Teams personal, group, and team chats",
    },
    [AgentChannelProvider.SLACK]: {
      name: "Slack",
      logo: SlackLogo,
      details:
        "Allow this agent to respond in Slack channels, threads, and DMs",
    },
  }

  const channelStatus = $derived.by(
    () =>
      ({
        [AgentChannelProvider.DISCORD]: discordEnabled ? "Enabled" : "Disabled",
        [AgentChannelProvider.MSTEAMS]: MSTeamsEnabled ? "Enabled" : "Disabled",
        [AgentChannelProvider.SLACK]: slackEnabled ? "Enabled" : "Disabled",
      }) as const
  )

  const channels = $derived.by<DeploymentRow[]>(() =>
    (
      [
        AgentChannelProvider.DISCORD,
        AgentChannelProvider.MSTEAMS,
        AgentChannelProvider.SLACK,
      ] as const
    ).map(provider => ({
      id: DEPLOYMENT_CHANNEL_IDS[provider],
      name: channelMetadata[provider].name,
      logo: channelMetadata[provider].logo,
      status: channelStatus[provider],
      details: channelMetadata[provider].details,
      configurable: true,
    }))
  )

  const onConfigureChannel = (channel: DeploymentRow) => {
    const provider = DEPLOYMENT_ID_TO_PROVIDER[channel.id]
    if (provider === AgentChannelProvider.DISCORD) {
      discordModal?.show()
      return
    }
    if (provider === AgentChannelProvider.MSTEAMS) {
      MSTeamsModal?.show()
      return
    }
    if (provider === AgentChannelProvider.SLACK) {
      slackModal?.show()
      return
    }
  }

  const onToggleChannel = async (channel: DeploymentRow) => {
    if (!currentAgent?._id) {
      return
    }
    const isChannelEnabled = channel.status === "Enabled"
    if (!isChannelEnabled && !hasAiConfig) {
      notifications.error(AI_CONFIG_REQUIRED_MESSAGE)
      return
    }
    toggling = true
    try {
      const provider = DEPLOYMENT_ID_TO_PROVIDER[channel.id]
      let channelUpdated = false
      if (provider === AgentChannelProvider.DISCORD) {
        if (isChannelEnabled) {
          await agentsStore.toggleDiscordDeployment(currentAgent._id, false)
          channelUpdated = true
          notifications.success("Discord channel disabled")
        } else if (discordConfigured) {
          await agentsStore.toggleDiscordDeployment(currentAgent._id, true)
          channelUpdated = true
          notifications.success("Discord channel enabled")
        } else {
          discordModal?.show()
        }
      } else if (provider === AgentChannelProvider.MSTEAMS) {
        if (isChannelEnabled) {
          await agentsStore.toggleMSTeamsDeployment(currentAgent._id, false)
          channelUpdated = true
          notifications.success("Microsoft Teams channel disabled")
        } else if (MSTeamsConfigured) {
          await agentsStore.toggleMSTeamsDeployment(currentAgent._id, true)
          channelUpdated = true
          notifications.success("Microsoft Teams channel enabled")
        } else {
          MSTeamsModal?.show()
        }
      } else if (provider === AgentChannelProvider.SLACK) {
        if (isChannelEnabled) {
          await agentsStore.toggleSlackDeployment(currentAgent._id, false)
          channelUpdated = true
          notifications.success("Slack channel disabled")
        } else if (slackConfigured) {
          await agentsStore.toggleSlackDeployment(currentAgent._id, true)
          channelUpdated = true
          notifications.success("Slack channel enabled")
        } else {
          slackModal?.show()
        }
      }

      if (channelUpdated && currentAgent.live) {
        await deploymentStore.publishApp()
      }
    } catch (e) {
      notifications.error(
        isChannelEnabled
          ? `Failed to disable ${channel.name} channel`
          : `Failed to enable ${channel.name} channel`
      )
    } finally {
      toggling = false
    }
  }
</script>

<div class="deployment-root">
  <section class="section">
    <div class="agent-node">
      <div>
        <Body
          color={"var(--spectrum-global-color-gray-900)"}
          weight="500"
          size="XS">Agent in automations</Body
        >
        <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
          >This agent can be triggered from within Budibase Automations via the
          Agent node</Body
        >
      </div>
      <Toggle value={true} disabled={true} />
    </div>
  </section>

  <section class="section">
    <div>
      <Body
        color={"var(--spectrum-global-color-gray-900)"}
        weight="500"
        size="XS">Messaging channels</Body
      >
    </div>
    <div>
      <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
        >Deploy your agent to the following messaging channels.</Body
      >
    </div>
    <div class="integration-list">
      {#each channels as channel (channel.id)}
        <div class="integration-row">
          <div class="channel-main">
            <img
              alt={channel.name}
              width="22px"
              height="22px"
              src={channel.logo}
            />
            <div class="channel-details">
              <Body color={"var(--spectrum-global-color-gray-900)"} size="XS"
                >{channel.name}</Body
              >
              <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
                >{channel.details}</Body
              >
            </div>
          </div>
          <div class="row-action">
            <ActionButton
              size="S"
              icon="gear"
              accentColor="Blue"
              on:click={() => onConfigureChannel(channel)}>Manage</ActionButton
            >
            <Toggle
              value={channel.status === "Enabled"}
              disabled={toggling}
              on:change={() => onToggleChannel(channel)}
            />
          </div>
        </div>
      {/each}
      {#if agentChatEnabled && currentAgent?._id}
        <AgentChatChannel
          agentId={currentAgent._id}
          agentName={currentAgent.name || "Agent"}
          agentLive={!!currentAgent.live}
        />
      {/if}
    </div>
  </section>
</div>

<Modal bind:this={discordModal}>
  <ModalContent
    size="L"
    showCloseIcon
    showConfirmButton={false}
    showCancelButton={false}
  >
    <svelte:fragment slot="header">
      <div class="modal-header">
        <img
          alt="Discord"
          width="24px"
          height="24px"
          src={DiscordLogo}
          class="modal-header-logo"
        />
        <div class="modal-header-copy">
          <Body color={"var(--spectrum-global-color-gray-900)"} weight="500"
            >Discord</Body
          >
        </div>
      </div>
    </svelte:fragment>
    <DiscordConfig agent={currentAgent} />
  </ModalContent>
</Modal>

<Modal bind:this={MSTeamsModal}>
  <ModalContent
    size="L"
    showCloseIcon
    showConfirmButton={false}
    showCancelButton={false}
  >
    <svelte:fragment slot="header">
      <div class="modal-header">
        <img
          alt="Microsoft Teams"
          width="24px"
          height="24px"
          src={MSTeamsLogo}
          class="modal-header-logo"
        />
        <div class="modal-header-copy">
          <Body color={"var(--spectrum-global-color-gray-900)"} weight="500"
            >Microsoft Teams</Body
          >
        </div>
      </div>
    </svelte:fragment>
    <MicrosoftTeamsConfig agent={currentAgent} />
  </ModalContent>
</Modal>

<Modal bind:this={slackModal}>
  <ModalContent
    size="L"
    showCloseIcon
    showConfirmButton={false}
    showCancelButton={false}
  >
    <svelte:fragment slot="header">
      <div class="modal-header">
        <img
          alt="Slack"
          width="24px"
          height="24px"
          src={SlackLogo}
          class="modal-header-logo"
        />
        <div class="modal-header-copy">
          <Body color={"var(--spectrum-global-color-gray-900)"} weight="500"
            >Slack</Body
          >
        </div>
      </div>
    </svelte:fragment>
    <SlackConfig agent={currentAgent} />
  </ModalContent>
</Modal>

<style>
  .deployment-root {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    min-height: 0;
  }

  .deployment-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .section {
    display: flex;
    gap: var(--spacing-xs);
  }

  .integration-list {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    overflow: hidden;
    background: var(--background);
    margin-top: var(--spacing-m);
  }

  .integration-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-s);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    min-height: 40px;
  }

  .integration-row:last-child {
    border-bottom: none;
  }

  .channel-main {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
  }

  .channel-main :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-700);
  }

  .status-chip {
    font-weight: 500;
  }

  .status-chip.enabled {
    color: var(--spectrum-semantic-positive-status-color);
  }

  .status-chip.disabled {
    color: var(--spectrum-global-color-gray-600);
  }

  .channel-details {
    display: flex;
    flex-direction: column;
    margin-left: var(--spacing-m);
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 110px;
    gap: 10px;
    margin-left: 0px;
  }

  .agent-node {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .agent-node > :first-child {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .modal-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .modal-header-logo {
    flex-shrink: 0;
  }

  .modal-header-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
