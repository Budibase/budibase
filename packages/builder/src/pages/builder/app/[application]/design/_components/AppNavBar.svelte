<script lang="ts">
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"
  import { ActionButton, Tab, Tabs } from "@budibase/bbui"

  $: apps = [
    { name: "Default app", id: "app_default" },
    { name: "App 1", id: "app_1" },
  ]

  function onAppClick(id: string) {
    if ($screenStore.screens.length > 0) {
      $redirect(`./${id}/${$screenStore.screens[0]._id}`)
    } else {
      $redirect(`./${id}/new`)
    }
  }
</script>

<Tabs selected="TODO">
  {#each apps as app}
    <Tab title={app.name} on:click={() => onAppClick(app.id)} />
  {/each}
  <ActionButton icon="Add">Add new app</ActionButton>
</Tabs>
