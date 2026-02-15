<script lang="ts">
  import {
    ActionButton,
    Body,
    Modal,
    ModalContent,
    Toggle,
  } from "@budibase/bbui"
  import type { Agent, DeploymentRow } from "@budibase/types"
  import { selectedAgent } from "@/stores/portal"
  import DiscordConfig from "./DeploymentChannels/DiscordConfig.svelte"
  import TeamsConfig from "./DeploymentChannels/TeamsConfig.svelte"
  import DiscordLogo from "assets/discord.svg"
  import TeamsLogo from "assets/rest-template-icons/microsoft-teams.svg"

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let discordModal: Modal
  let teamsModal: Modal

  const discordConfigured = $derived.by(() => {
    const integration = currentAgent?.discordIntegration
    return !!(
      integration?.applicationId?.trim() &&
      integration?.publicKey?.trim() &&
      integration?.botToken?.trim() &&
      integration?.guildId?.trim()
    )
  })

  const teamsConfigured = $derived.by(() => {
    const integration = currentAgent?.teamsIntegration
    return !!(
      integration?.appId?.trim() &&
      integration?.appPassword?.trim() &&
      integration?.messagingEndpointUrl?.trim()
    )
  })

  const channels = $derived.by<DeploymentRow[]>(() => [
    {
      id: "discord",
      name: "Discord",
      logo: DiscordLogo,
      status: discordConfigured ? "Enabled" : "Disabled",
      details: "Allow this agent to respond in Discord channels and threads",
      configurable: true,
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      logo: TeamsLogo,
      status: teamsConfigured ? "Enabled" : "Disabled",
      details: "Configure this agent for Teams personal, group, and team chats",
      configurable: true,
    },
  ])

  const onConfigureChannel = (channel: DeploymentRow) => {
    if (channel.id === "discord") {
      discordModal?.show()
      return
    }
    if (channel.id === "teams") {
      teamsModal?.show()
      return
    }
  }
</script>

<div class="deployment-root">
  <section class="section">
    <div class="agent-node">
      <div>
        <Body
          color={"var(--spectrum-global-color-gray-900);"}
          weight="500"
          size="XS">Agent in automations</Body
        >
        <Body color={"var(--spectrum-global-color-gray-700);"} size="XS"
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
            <Toggle value={channel.status === "Enabled" ? true : false}
            ></Toggle>
          </div>
        </div>
      {/each}
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

<Modal bind:this={teamsModal}>
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
          src={TeamsLogo}
          class="modal-header-logo"
        />
        <div class="modal-header-copy">
          <Body color={"var(--spectrum-global-color-gray-900)"} weight="500"
            >Microsoft Teams</Body
          >
        </div>
      </div>
    </svelte:fragment>
    <TeamsConfig agent={currentAgent} />
  </ModalContent>
</Modal>

<style>
  .deployment-root {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    min-height: 0;
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
    height: 40px;
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
