<script lang="ts">
  import { featureFlags } from "@/stores/portal"
  import { goto, isActive, redirect } from "@roxi/routify"
  import AgentTabList from "../agent/[agentId]/AgentTabList.svelte"
  import { ACTIVITY_TABS, getEnabledActivityTabs } from "./activityTabs"

  $goto
  $redirect

  let tabs = $derived(getEnabledActivityTabs($featureFlags))
  let activityEnabled = $derived(tabs.length > 0)
  let disabledTabActive = $derived(
    ACTIVITY_TABS.some(tab => !tabs.includes(tab) && $isActive(tab.url))
  )

  $effect(() => {
    if (!activityEnabled) {
      $goto("../home")
    } else if (disabledTabActive) {
      $redirect(tabs[0].url)
    }
  })
</script>

{#if activityEnabled && !disabledTabActive}
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
