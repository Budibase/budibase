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
  import DiscordLogo from "assets/discord.svg"

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
      details: "Allow this agent to respond in Discord channels and threads",
      configurable: true,
    },
  ])

  const onConfigureChannel = (channel: DeploymentRow) => {
    if (channel.id === "discord") {
      discordModal?.show()
      return
    }
  }
</script>

<div class="deployment-root">
  <section class="section">
    <div>
      <Body
        color={"var(--spectrum-global-color-gray-900);"}
        weight="500"
        size="XS">Agent in automations</Body
      >
    </div>
    <div style="display: flex; justify-content:space-between">
      <Body color={"var(--spectrum-global-color-gray-700);"} size="XS"
        >This agent can be triggered from within Budibase Agents via the Agent
        node</Body
      >
      <Toggle value={true} disabled={true} />
    </div>
  </section>

  <section class="section">
    <div>
      <Body
        color={"var(--spectrum-global-color-gray-900)"}
        weight="500"
        size="XS">Messaging Channels</Body
      >
    </div>
    <div>
      <Body color={"var(--spectrum-global-color-gray-700)"} size="XS"
        >Deploy your agent to the following messagging channels.</Body
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
            <div
              style="display: flex: flex-direction: column; margin-left: var(--spacing-m)"
            >
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
    gap: 10px;
    margin-left: 0px;
  }
</style>
