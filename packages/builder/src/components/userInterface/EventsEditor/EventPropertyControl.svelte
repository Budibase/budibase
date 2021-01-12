<script>
  import { Button, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import EventEditor from "./EventEditor.svelte"
  import BottomDrawer from "components/common/BottomDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let name

  let drawerVisible

  function showDrawer() {
    drawerVisible = true
  }

  const saveEventData = () => {
    dispatch("change", value)
    notifier.success("Component actions saved.")
  }
</script>

<Button secondary small on:click={showDrawer}>Define Actions</Button>

{#if drawerVisible}
  <BottomDrawer title={'Actions'} onClose={() => (drawerVisible = false)}>
    <heading slot="buttons">
      <Button thin blue on:click={saveEventData}>Save</Button>
    </heading>
    <div slot="body">
      <EventEditor event={value} eventType={name} />
    </div>
  </BottomDrawer>
{/if}
