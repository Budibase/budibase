<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Button, ActionMenu, MenuItem } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import AgentList from "./AgentList.svelte"
  import AgentSettingsModal from "./AgentSettingsModal.svelte"

  type ChatAgentConfig = {
    agentId: string
    isEnabled: boolean
    isDefault: boolean
  }

  type AgentListItem = {
    agentId: string
    name?: string
    isDefault?: boolean
  }

  export let namedAgents: Agent[] = []
  export let agents: ChatAgentConfig[] = []
  export let isAgentAvailable: (_agentId: string) => boolean
  export let handleAvailabilityToggle: (
    _agentId: string,
    _enabled: boolean
  ) => void
  export let handleDefaultToggle: (_agentId: string) => void
  export let handleAddAgent: (_agentId: string) => void

  let selectedAgentId: string | undefined
  let selectedAgent: AgentListItem | undefined
  let isModalOpen = false

  $: selectedAgent = agentList.find(agent => agent.agentId === selectedAgentId)

  $: agentList = agents.map(agentConfig => {
    const details = namedAgents.find(agent => agent._id === agentConfig.agentId)
    return {
      agentId: agentConfig.agentId,
      name: details?.name,
      isDefault: agentConfig.isDefault,
    }
  })

  $: enabledAgentList = agentList.filter(agent =>
    isAgentAvailable(agent.agentId)
  )
  $: resolvedDefaultAgent =
    enabledAgentList.find(agent => agent.isDefault) || enabledAgentList[0]
  $: otherAgents = agentList.filter(
    agent => agent.agentId !== resolvedDefaultAgent?.agentId
  )
  $: liveAgents = namedAgents.filter(agent => agent._id && agent.live)

  const openAgentSettings = (agent: AgentListItem) => {
    selectedAgentId = agent.agentId
    isModalOpen = true
  }

  const isAgentEnabled = (agentId: string) => {
    return agents.some(
      enabled => enabled.agentId === agentId && enabled.isEnabled
    )
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

    <div class="settings-options">
      <ActionMenu align="left" roundedPopover>
        <div slot="control">
          <Button secondary size="M" icon="plus">Add agent</Button>
        </div>
        {#if liveAgents.length}
          {#each liveAgents as agent (agent._id)}
            <MenuItem
              icon="robot"
              disabled={isAgentEnabled(agent._id!)}
              on:click={() => handleAddAgent(agent._id!)}
            >
              {agent.name || "Unnamed agent"}
            </MenuItem>
          {/each}
        {:else}
          <MenuItem disabled>No live agents</MenuItem>
        {/if}
      </ActionMenu>
    </div>

    <AgentList
      {resolvedDefaultAgent}
      {otherAgents}
      {isAgentAvailable}
      onToggleEnabled={handleAvailabilityToggle}
      onOpenSettings={openAgentSettings}
    />
  </div>
</Panel>

<AgentSettingsModal
  open={isModalOpen}
  {selectedAgent}
  defaultAgentId={resolvedDefaultAgent?.agentId}
  {isAgentAvailable}
  onSetDefault={handleDefaultToggle}
  onClose={() => {
    isModalOpen = false
    selectedAgentId = undefined
  }}
/>

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

  .settings-options {
    display: flex;
    justify-content: flex-start;
  }
</style>
