<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { webpageStore } from "@/stores/builder"
  import { ActionButton, Tab, Tabs } from "@budibase/bbui"

  async function onAppClick(appId: string) {
    const screenId = await webpageStore.select(appId)

    if (screenId) {
      $redirect(`./${appId}/${screenId}`)
    } else {
      $redirect(`./${appId}/new`)
    }
  }

  function addNew() {
    const appId = webpageStore.add()
    $redirect(`./${appId}/new`)
  }
</script>

<Tabs selected={$webpageStore.selected?.name || ""}>
  {#each $webpageStore.items as app}
    <Tab id={app._id} title={app.name} on:click={() => onAppClick(app._id)} />
  {/each}
  <ActionButton icon="Add" on:click={addNew}>Add new app</ActionButton>
</Tabs>
