<script>
  import { Button, DropdownMenu } from "@budibase/bbui"
  import EventEditorModal from "./EventEditorModal.svelte"
  import { getContext } from "svelte"

  export let value
  export let name

  let button
  let dropdown
</script>

<div bind:this={button}>
  <Button secondary small on:click={dropdown.show}>Define Actions</Button>
</div>
<DropdownMenu bind:this={dropdown} align="right" anchor={button}>
  <EventEditorModal
    event={value}
    eventType={name}
    on:change
    on:close={dropdown.hide} />
</DropdownMenu>

<style>

</style>
