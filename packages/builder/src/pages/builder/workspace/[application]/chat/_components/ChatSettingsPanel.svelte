<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Button, ActionMenu, MenuItem } from "@budibase/bbui"
  import type { Agent, ConversationStarter } from "@budibase/types"
  import AgentList from "./AgentList.svelte"
  import AgentSettingsModal from "./AgentSettingsModal.svelte"
  import type { AgentListItem } from "./types"

  type ChatAgentConfig = {
    agentId: string
    isEnabled: boolean
    isDefault: boolean
    conversationStarters?: ConversationStarter[]
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
  export let handleUpdateConversationStarters: (
    _agentId: string,
    _starters: ConversationStarter[]
  ) => void

  let selectedAgentId: string | undefined
  let selectedAgent: AgentListItem | undefined
  let selectedAgentConfig: ChatAgentConfig | undefined
  let isModalOpen = false

  $: selectedAgent = agentList.find(agent => agent.agentId === selectedAgentId)
  $: selectedAgentConfig = agents.find(
    agent => agent.agentId === selectedAgentId
  )

  $: agentList = agents.map(agentConfig => {
    const details = namedAgents.find(agent => agent._id === agentConfig.agentId)
    return {
      agentId: agentConfig.agentId,
      name: details?.name!,
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

<div class="settings-panel">
  <Panel customWidth={260} noHeaderBorder>
    <div class="settings-container">
      <div class="settings-header">
        <Body size="S" color="var(--spectrum-global-color-gray-800)"
          >Settings</Body
        >
      </div>

      <div class="settings-section">
        <Body size="S" color="var(--spectrum-global-color-gray-700)"
          >Agents</Body
        >
        <Body size="XS" color="var(--spectrum-global-color-gray-600)">
          Use the button below to add agents. After adding them, they’ll appear
          in the chat side panel. The New chat button opens a new conversation
          with the default agent.
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
      </div>

      <div class="settings-section">
        <AgentList
          {resolvedDefaultAgent}
          {otherAgents}
          {isAgentAvailable}
          onToggleEnabled={handleAvailabilityToggle}
          onOpenSettings={openAgentSettings}
        />
      </div>
    </div>
  </Panel>
</div>

<AgentSettingsModal
  open={isModalOpen}
  {selectedAgent}
  {selectedAgentConfig}
  defaultAgentId={resolvedDefaultAgent?.agentId}
  {isAgentAvailable}
  onSetDefault={handleDefaultToggle}
  onUpdateConversationStarters={handleUpdateConversationStarters}
  onClose={() => {
    isModalOpen = false
    selectedAgentId = undefined
  }}
/>

<style>
  .settings-panel {
    display: flex;
    margin: var(--spacing-xl) 0 var(--spacing-xl) var(--spacing-xl);
    border-radius: 24px;
    border: var(--border-light);
    overflow: hidden;
  }

  .settings-container {
    padding: var(--spacing-m);
    gap: 32px;
    display: flex;
    flex-direction: column;
  }

  .settings-header {
    padding: var(--spacing-m);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }

  .settings-options {
    display: flex;
    justify-content: flex-start;
  }
</style>
