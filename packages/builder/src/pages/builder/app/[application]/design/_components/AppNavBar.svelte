<script lang="ts">
  import { ActionButton, Tab, Tabs } from "@budibase/bbui"

  $: apps = [{ name: "Default app" }]
</script>

<Tabs selected="TODO">
  {#each apps as view}
    <Tab title={view.name} />
  {/each}
  <ActionButton icon="Add">Add new app</ActionButton>
</Tabs>
