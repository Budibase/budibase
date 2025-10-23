<script>
  import WorkspaceLayout from "./_layout.workspace.svelte"

  export let application

  let currentAppId = application

  $: if (application !== currentAppId) {
    currentAppId = application
  }
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#key currentAppId}
  <WorkspaceLayout application={currentAppId}>
    <slot />
  </WorkspaceLayout>
{/key}
