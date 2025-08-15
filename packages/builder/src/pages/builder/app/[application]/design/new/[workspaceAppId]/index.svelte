<script lang="ts">
  import { onMount } from "svelte"
  import NewScreen from "../../_components/NewScreen/index.svelte"
  import { params } from "@roxi/routify"
  import { workspaceAppStore } from "@/stores/builder"
  import TopBar from "@/components/common/TopBar.svelte"

  let newScreenModal: NewScreen

  onMount(() => {
    newScreenModal.open()
  })
  $: workspaceAppId =
    $params.workspaceAppId || $workspaceAppStore.workspaceApps[0]._id
  $: workspaceApp = $workspaceAppStore.workspaceApps.find(
    a => a._id === workspaceAppId
  )
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
