<script lang="ts">
  import WorkspaceLayout from "./_layout.workspace.svelte"

  export let workspaceId: string
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#key workspaceId}
  <WorkspaceLayout {workspaceId}>
    <slot />
  </WorkspaceLayout>
{/key}
