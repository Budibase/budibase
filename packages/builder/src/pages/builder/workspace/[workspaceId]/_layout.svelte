<script lang="ts">
  import {
    getWorkspaceIdFromUrl,
    getWorkspaceUrlId,
    redirectLegacyWorkspaceUrl,
  } from "@/helpers/workspaceUrls"
  import WorkspaceLayout from "./_layout.workspace.svelte"

  export let workspaceId: string

  $: workspaceUrlId = getWorkspaceUrlId(workspaceId)
  $: internalWorkspaceId = getWorkspaceIdFromUrl(workspaceId)
  $: isLegacyWorkspaceUrl = workspaceUrlId !== workspaceId

  $: if (isLegacyWorkspaceUrl) {
    redirectLegacyWorkspaceUrl(workspaceId)
  }
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#if !isLegacyWorkspaceUrl}
  {#key internalWorkspaceId}
    <WorkspaceLayout workspaceId={internalWorkspaceId}>
      <slot />
    </WorkspaceLayout>
  {/key}
{/if}
