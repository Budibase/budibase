<script>
  import { onMount } from "svelte"
  import WorkspaceLayout from "./_layout.workspace.svelte"
  import { params } from "@roxi/routify"

  export let application
  let currentAppId = null

  $: if (currentAppId !== application) {
    console.log({ application, currentAppId, para: $params.application })
    currentAppId = application
  }

  onMount(() => {
    console.log("_layout mount")
  })
</script>

<!-- Needs to agressively re-render if the appId has changed -->
{#key application}
  <WorkspaceLayout {application}>
    <slot />
  </WorkspaceLayout>
{/key}
