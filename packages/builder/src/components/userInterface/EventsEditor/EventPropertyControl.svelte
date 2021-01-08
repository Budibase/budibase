<script>
  import { Button, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import EventEditorModal from "./EventEditorModal.svelte"
  import BottomDrawer from "components/common/BottomDrawer.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let name

  let drawerVisible

  function showDrawer() {
    drawerVisible = true
  }
</script>

<Button secondary small on:click={showDrawer}>Define Actions</Button>

{#if drawerVisible}
  <BottomDrawer>
    <EventEditorModal event={value} eventType={name} on:change />
  </BottomDrawer>
{/if}
