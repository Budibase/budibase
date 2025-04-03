<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { screenStore, webpageStore } from "@/stores/builder"
  import { ActionButton, Tab, Tabs } from "@budibase/bbui"

  function onAppClick(appId: string) {
    webpageStore.select(appId)

    if ($screenStore.screens.length > 0) {
      $redirect(`./${appId}/${$screenStore.screens[0]._id}`)
    } else {
      $redirect(`./${appId}/new`)
    }
  }

  function addNew() {
    webpageStore.add()
  }
</script>

<Tabs selected={$webpageStore.selected?.name || ""}>
  {#each $webpageStore.items as app}
    <Tab id={app._id} title={app.name} on:click={() => onAppClick(app._id)} />
  {/each}
  <ActionButton icon="Add" on:click={addNew}>Add new app</ActionButton>
</Tabs>
