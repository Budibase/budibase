<script lang="ts">
  import WorkspaceLayout from "./_layout.workspace.svelte"

  export let application: string
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#key application}
  <WorkspaceLayout {application}>
    <slot />
  </WorkspaceLayout>
{/key}
