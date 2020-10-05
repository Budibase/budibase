<script>
  import { Button, Modal } from "@budibase/bbui"
  import EventEditorModal from "./EventEditorModal.svelte"
  import { createEventDispatcher, onMount } from "svelte"
  const dispatch = createEventDispatcher()

  export let value
  export let name

  let modalVisible = false
</script>

<Button secondary small on:click={() => (modalVisible = true)}>
  Define Actions
</Button>

{#if modalVisible}
  <EventEditorModal
    bind:visible={modalVisible}
    event={value}
    eventType={name}
    on:change />
{/if}
