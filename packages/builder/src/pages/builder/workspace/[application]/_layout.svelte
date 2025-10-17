<script>
  import WorkspaceLayout from "./_layout.workspace.svelte"

  export let application
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#key application}
  <WorkspaceLayout {application}>
    <slot />
  </WorkspaceLayout>
{/key}
