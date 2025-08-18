<script lang="ts">
  import { onMount } from "svelte"
  import NewScreen from "../../_components/NewScreen/index.svelte"
  import { workspaceAppStore } from "@/stores/builder"
  import TopBar from "@/components/common/TopBar.svelte"
  import { params } from "@roxi/routify"

  let newScreenModal: NewScreen

  $: workspaceAppId = $params.workspaceAppId
  $: workspaceApp = $workspaceAppStore.workspaceApps.find(
    a => a._id === workspaceAppId
  )

  onMount(() => {
    newScreenModal.open()
  })
</script>

<TopBar
  breadcrumbs={[
    { text: "Apps", url: "../../.." },
    { text: workspaceApp?.name },
  ]}
  icon="browser"
></TopBar>
<div class="new-screen-picker">
  <NewScreen bind:this={newScreenModal} inline submitOnClick {workspaceAppId} />
</div>

<style>
  .new-screen-picker {
    display: flex;
    justify-content: center;
    flex: 1 1 auto;
    padding-top: 40px;
  }

  .new-screen-picker :global(.spectrum-Modal) {
    border: none;
    background: none;
  }
</style>
