<script lang="ts">
  import Panel from "@/components/design/Panel.svelte"
  import { Body, Toggle } from "@budibase/bbui"

  type NamedAgent = {
    _id?: string
    name?: string
  }

  export let namedAgents: NamedAgent[] = []
  export let isAgentAvailable: (_agentId: string) => boolean
  export let handleAvailabilityToggle: (
    _agentId: string,
    _enabled: boolean
  ) => void
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

    {#if namedAgents.length}
      {#each namedAgents as agent (agent._id)}
        <div class="settings-agent">
          <div class="settings-agent-info">
            <Body size="S">{agent.name}</Body>
          </div>
          {#if agent._id}
            <Toggle
              value={isAgentAvailable(agent._id)}
              on:change={event =>
                handleAvailabilityToggle(agent._id, event.detail)}
            />
          {/if}
        </div>
      {/each}
    {:else}
      <Body size="S" color="var(--spectrum-global-color-gray-500)">
        No agents found
      </Body>
    {/if}
  </div>
</Panel>

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
</style>
