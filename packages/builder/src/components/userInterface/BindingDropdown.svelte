<script>
  import groupBy from "lodash/fp/groupBy"
  import { Button, TextArea, Label, Body } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  export let bindableProperties
  console.log("Bindable Props: ", bindableProperties)
  export let value = ""
  export let close

  function addToText(readableBinding) {
    value = value + `{{ ${readableBinding} }}`
  }
  let originalValue = value

  $: dispatch("update", value)

  function cancel() {
    dispatch("update", originalValue)
    close()
  }

  $: ({ instance, context } = groupBy("type", bindableProperties))
</script>

<div class="container" data-cy="binding-dropdown-modal">
  <div class="list">
    <Label size="l" color="dark">Objects</Label>
    {#if context}
      <Label size="s" color="dark">Table</Label>
      <ul>
        {#each context as { readableBinding }}
          <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
        {/each}
      </ul>
    {/if}
    {#if instance}
      <Label size="s" color="dark">Components</Label>
      <ul>
        {#each instance as { readableBinding }}
          <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="text">
    <Label size="l" color="dark">Data binding</Label>
    <Body size="s" color="dark">
      Binding connects one piece of data to another and makes it dynamic. Click
      the objects on the left, to add them to the textbox.
    </Body>
    <TextArea bind:value placeholder="" />
    <div class="controls">
      <a href="#">
        <Body size="s" color="light">Learn more about binding</Body>
      </a>
      <Button on:click={cancel} secondary>Cancel</Button>
      <Button on:click={close} primary>Done</Button>
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
  .controls {
    margin-top: var(--spacing-m);
    display: grid;
    align-items: center;
    grid-gap: var(--spacing-l);
    grid-template-columns: 1fr auto auto;
  }
  .list {
    width: 150px;
    border-right: 1.5px solid var(--grey-4);
  }
  .text {
    width: 600px;
    display: grid;
  }
  .text :global(p) {
    margin: 0;
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
