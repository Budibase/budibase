<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Icon, Modal, ModalContent, Toggle } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"

  type EnabledAgent = {
    agentId: string
    default?: boolean
  }

  type AgentListItem = Agent & {
    agentId: string
    default?: boolean
  }

  export let namedAgents: Agent[] = []
  export let enabledAgents: EnabledAgent[] = []
  export let isAgentAvailable: (_agentId: string) => boolean
  export let handleAvailabilityToggle: (
    _agentId: string,
    _enabled: boolean
  ) => void

  let settingsModal: Modal | undefined
  let selectedAgent: AgentListItem | undefined

  $: agentList = namedAgents
    .filter(agent => agent._id)
    .map(agent => ({
      ...agent,
      agentId: agent._id!,
      default: enabledAgents.find(enabled => enabled.agentId === agent._id)
        ?.default,
    }))

  $: enabledAgentList = agentList.filter(agent =>
    isAgentAvailable(agent.agentId)
  )
  $: resolvedDefaultAgent =
    enabledAgentList.find(agent => agent.default) || enabledAgentList[0]
  $: otherAgents = agentList.filter(
    agent => agent.agentId !== resolvedDefaultAgent?.agentId
  )

  const openAgentSettings = (agent: AgentListItem) => {
    selectedAgent = agent
    settingsModal?.show()
  }
</script>

<Panel customWidth={260} borderRight noHeaderBorder>
  <div class="settings-header">
    <Body size="S" color="var(--spectrum-global-color-gray-800)">Settings</Body>
  </div>

  <div class="settings-section">
    <Body size="S" color="var(--spectrum-global-color-gray-700)">Agents</Body>
    <Body size="XS" color="var(--spectrum-global-color-gray-600)">
      Use the button below to add agents. After adding them, they’ll appear in
      the chat side panel. The New chat button opens a new conversation with the
      default agent.
    </Body>

    <div class="settings-group">
      <Body size="XS" color="var(--spectrum-global-color-gray-500)">
        Default agent
      </Body>
      {#if resolvedDefaultAgent?.agentId}
        <div class="settings-agent">
          <div class="settings-agent-info">
            <Body size="S">
              {resolvedDefaultAgent.name || "Unknown agent"}
            </Body>
          </div>
          <div class="settings-agent-actions">
            <Toggle
              value={isAgentAvailable(resolvedDefaultAgent.agentId)}
              on:change={event =>
                handleAvailabilityToggle(
                  resolvedDefaultAgent.agentId,
                  event.detail
                )}
            />
            <button
              class="settings-gear"
              type="button"
              on:click={() => openAgentSettings(resolvedDefaultAgent)}
              aria-label="Open agent settings"
            >
              <Icon name="gear" size="S" />
            </button>
          </div>
        </div>
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-500)">
          No default agent
        </Body>
      {/if}
    </div>

    <div class="settings-group">
      <Body size="XS" color="var(--spectrum-global-color-gray-500)">
        Other agents
      </Body>
      {#if otherAgents.length}
        {#each otherAgents as agent (agent.agentId)}
          <div class="settings-agent">
            <div class="settings-agent-info">
              <Body size="S">{agent.name}</Body>
            </div>
            <div class="settings-agent-actions">
              <Toggle
                value={isAgentAvailable(agent.agentId)}
                on:change={event =>
                  handleAvailabilityToggle(agent.agentId, event.detail)}
              />
              <button
                class="settings-gear"
                type="button"
                on:click={() => openAgentSettings(agent)}
                aria-label="Open agent settings"
              >
                <Icon name="gear" size="S" />
              </button>
            </div>
          </div>
        {/each}
      {:else}
        <Body size="S" color="var(--spectrum-global-color-gray-500)">
          No other agents
        </Body>
      {/if}
    </div>
  </div>
</Panel>

<Modal bind:this={settingsModal}>
  <ModalContent
    size="M"
    title={`${selectedAgent?.name || "Agent"} settings`}
    showConfirmButton={false}
  />
</Modal>

<style>
  .settings-header {
    padding: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .settings-section {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .settings-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .settings-agent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-s);
  }

  .settings-agent-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
  }

  .settings-agent-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .settings-gear {
    border: none;
    background: transparent;
    padding: 0;
    color: var(--spectrum-global-color-gray-600);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .settings-gear:hover {
    color: var(--spectrum-global-color-gray-800);
  }
</style>
