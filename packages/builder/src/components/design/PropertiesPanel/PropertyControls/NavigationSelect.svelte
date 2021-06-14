<script>
  import { ActionButton } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"

  let flipDurationMs = 150

  // This should be the screens and any external links the user has added
  let items = [
    { text: "Test", id: 0 },
    { text: "First", id: 1 },
    { text: "Second", id: 2 },
  ]
</script>

<div class="container">
  <ul
    use:dndzone={{
      items,
      flipDurationMs,
      dropTargetStyle: { outline: "none" },
    }}
  >
    {#each items as item (item)}
      <li animate:flip={{ duration: flipDurationMs }}>{item}</li>
    {/each}
  </ul>
  <ActionButton icon="Add">Add External Link</ActionButton>
</div>

<style>
  .container {
    display: grid;
  }
  ul {
    display: grid;
    grid-template-columns: 1fr;
    list-style-type: none;
  }
</style>
