<script lang="ts">
  import { StatusLight } from "@budibase/bbui"
  import { workspaceDeploymentStore } from "@/stores/builder"
  import { selectedAgent } from "@/stores/portal"

  let currentAgent = $derived($selectedAgent)

  let visible = $derived.by(() => {
    if (!currentAgent?._id) {
      return false
    }
    if (!currentAgent.live) {
      return false
    }
    const publishStatus = $workspaceDeploymentStore.agents[currentAgent._id]
    if (!publishStatus?.publishedAt) {
      return false
    }

    return publishStatus.unpublishedChanges === true
  })
</script>

{#if visible}
  <div class="unpublished-changes-indicator">
    <StatusLight color="var(--spectrum-global-color-blue-600)" size="L" />
    <span>Unpublished changes</span>
  </div>
{/if}

<style>
  .unpublished-changes-indicator {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
    font-size: var(--font-size-s);
    font-weight: 500;
    white-space: nowrap;
  }
</style>
