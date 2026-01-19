<script lang="ts">
  import { Body, Icon, Toggle } from "@budibase/bbui"
  import type { Agent } from "@budibase/types"

  type AgentListItem = Agent & {
    agentId: string
    default?: boolean
  }

  export let resolvedDefaultAgent: AgentListItem | undefined
  export let otherAgents: AgentListItem[] = []
  export let isAgentAvailable: (_agentId: string) => boolean
  export let onToggleEnabled: (_agentId: string, _enabled: boolean) => void
  export let onOpenSettings: (_agent: AgentListItem) => void
</script>

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
        <button
          class="settings-gear"
          type="button"
          on:click={() => onOpenSettings(resolvedDefaultAgent)}
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
            on:change={event => onToggleEnabled(agent.agentId, event.detail)}
          />
          <button
            class="settings-gear"
            type="button"
            on:click={() => onOpenSettings(agent)}
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

<style>
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
