<script lang="ts">
  import { screenComponentErrorList } from "@/stores/builder"
  import { ActionButton, Popover } from "@budibase/bbui"

  let button: any
  let popover: any
</script>

<div bind:this={button}>
  <ActionButton selected quiet on:click={() => popover.show()}
    >Errors ({$screenComponentErrorList.length})</ActionButton
  >
</div>
<Popover bind:this={popover} anchor={button} align={"right"}>TODO</Popover>
