<script>
  import { Button, TextArea, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  export let bindableProperties
  console.log("Bindable Props: ", bindableProperties)
  export let value = ""

  function addToText(readableBinding) {
    value = value + `{{ ${readableBinding} }}`
  }

  $: dispatch("update", value)
</script>

<div class="container">
  <div class="list">
    <Label size="l" color="dark">Objects</Label>
    <ul>
      {#each bindableProperties as { readableBinding }}
        <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
      {/each}
    </ul>
  </div>
  <div class="text">
    <Label size="l" color="dark">Data binding</Label>
    <TextArea bind:value placeholder="" />
    <div class="controls">
      <a href="#">
        <Label size="s" color="light">Objects</Label>
      </a>
      <Button>Test</Button>
      <Button>Test</Button>
    </div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: auto auto;
  }
  .list,
  .text {
    padding: var(--spacing-m);
  }
  .list {
    width: 150px;
    border-right: 1.5px solid blue;
  }
  .text {
    width: 600px;
    display: grid;
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }
</style>
