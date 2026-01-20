<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"
  import AgentList from "./AgentList.svelte"
  import AgentSettingsModal from "./AgentSettingsModal.svelte"

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
  export let handleDefaultToggle: (_agentId: string) => void

  let selectedAgentId: string | undefined
  let selectedAgent: AgentListItem | undefined
  let isModalOpen = false

  $: selectedAgent = agentList.find(agent => agent.agentId === selectedAgentId)

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
    selectedAgentId = agent.agentId
    isModalOpen = true
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
</style>
