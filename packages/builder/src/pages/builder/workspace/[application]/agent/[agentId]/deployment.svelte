<script lang="ts">
  import {
    Body,
    Button,
    Heading,
    Icon,
    Modal,
    ModalContent,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import { selectedAgent } from "@/stores/portal"
  import DiscordConfig from "./DeploymentChannels/DiscordConfig.svelte"
  import DiscordLogo from "assets/discord.svg"
  interface DeploymentRow {
    id: string
    name: string
    logo: string
    status: "Enabled" | "Disabled"
    details: string
    configurable?: boolean
  }

  let currentAgent: Agent | undefined = $derived($selectedAgent)
  let discordModal: Modal

  const discordConfigured = $derived.by(() => {
    const integration = currentAgent?.discordIntegration
    return !!(
      integration?.applicationId?.trim() &&
      integration?.botToken?.trim() &&
      integration?.guildId?.trim()
    )
  })
  const channels = $derived.by<DeploymentRow[]>(() => [
    {
      id: "discord",
      name: "Discord",
      logo: DiscordLogo,
      status: discordConfigured ? "Enabled" : "Disabled",
      details: discordConfigured ? "Active 2 days ago" : "Not configured",
      configurable: true,
    },
  ])

  const onAddChannel = () => {
    notifications.info("More deployment channels are coming soon")
  }

  const onConfigureChannel = (channel: DeploymentRow) => {
    if (channel.id === "discord") {
      discordModal?.show()
      return
    }
    notifications.info(`${channel.name} configuration is coming soon`)
  }
</script>

<div class="deployment-root">
  <section class="deployment-section">
    <div class="section-title">
      <Heading size="XS">Agent in automations</Heading>
    </div>
    <div style="display: flex; justify-content:space-between">
      <Body size="S"
        >This agent can be triggered from within Budibase Agents via the Agent
        node</Body
      >
      <Toggle value={true} disabled={true} />
    </div>
  </section>

  <section class="deployment-section">
    <div class="section-header">
      <div class="section-title">
        <Heading size="XS">Channels</Heading>
        <Body size="S"
          >Select the channels and services you would like to deploy your agent
          to.</Body
        >
      </div>
      <div>
        <Button quiet size="S" on:click={onAddChannel}>Add channel</Button>
      </div>
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
            <Body size="S">{channel.name}</Body>
          </div>
          <div
            class="status-chip"
            class:enabled={channel.status === "Enabled"}
            class:disabled={channel.status === "Disabled"}
          >
            <Body size="S">{channel.status}</Body>
          </div>
          <div class="channel-details">
            <Body size="S">{channel.details}</Body>
          </div>
          <div class="row-action">
            <Icon
              hoverable
              size="M"
              name="gear"
              on:click={() => onConfigureChannel(channel)}
            ></Icon>
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
    title="Discord"
    size="L"
    showCloseIcon
    showConfirmButton={false}
    showCancelButton={false}
  >
    <DiscordConfig agent={currentAgent} />
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

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .section-title {
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }

  .integration-list {
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 10px;
    overflow: hidden;
    background: var(--background);
  }

  .integration-row {
    display: grid;
    grid-template-columns: minmax(0, 220px) 90px minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-s) var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .integration-row:last-child {
    border-bottom: none;
  }

  .channel-main {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-s);
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
    color: var(--spectrum-global-color-gray-700);
    min-width: 0;
  }

  .row-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 110px;
    gap: 20px;
  }

  @media (max-width: 1100px) {
    .integration-row {
      grid-template-columns: minmax(0, 1fr) auto;
      row-gap: var(--spacing-xs);
    }

    .channel-details,
    .status-chip {
      grid-column: 1 / 2;
    }

    .row-action {
      grid-column: 2 / 3;
      grid-row: 1 / 4;
      align-self: center;
    }
  }
</style>
