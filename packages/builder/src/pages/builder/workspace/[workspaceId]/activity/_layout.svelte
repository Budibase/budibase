<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import { FeatureFlag } from "@budibase/types"
  import { goto, isActive } from "@roxi/routify"
  import AgentTabList from "../agent/[agentId]/AgentTabList.svelte"

  $goto

  let activityEnabled = $derived($featureFlags[FeatureFlag.AI_AGENT_ACTIVITY])

  const tabs = [
    { label: "Requests", url: "./requests" },
    { label: "Actions", url: "./actions" },
  ]

  $effect(() => {
    if (!activityEnabled) {
      $goto("../home")
    }
  })
</script>

{#if activityEnabled}
  <div class="activity-layout">
    <AgentTabList ariaLabel="Activity" bordered>
      {#each tabs as tab}
        <button
          class:active={$isActive(tab.url)}
          aria-current={$isActive(tab.url) ? "page" : undefined}
          onclick={() => $goto(tab.url)}
        >
          {tab.label}
        </button>
      {/each}
    </AgentTabList>
    <div class="activity-content">
      <!-- svelte-ignore slot_element_deprecated -->
      <slot />
    </div>
  </div>
{/if}

<style>
  .activity-layout {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    background: var(--background-alt);
  }

  .activity-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
</style>
