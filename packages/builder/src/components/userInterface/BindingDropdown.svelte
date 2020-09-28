<script>
  import groupBy from "lodash/fp/groupBy"
  import {
    Button,
    TextArea,
    Label,
    Body,
    Heading,
    Spacer,
  } from "@budibase/bbui"
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
    <Heading extraSmall>Objects</Heading>
    <Spacer medium />
    {#if context}
      <Heading extraSmall>Tables</Heading>
      <ul>
        {#each context as { readableBinding }}
          <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
        {/each}
      </ul>
    {/if}
    {#if instance}
      <Heading extraSmall>Components</Heading>
      <ul>
        {#each instance as { readableBinding }}
          <li on:click={() => addToText(readableBinding)}>{readableBinding}</li>
        {/each}
      </ul>
    {/if}
  </div>
  <div class="text">
    <Heading extraSmall>Data binding</Heading>
    <Spacer small />
    <Body extraSmall lh>
      Binding connects one piece of data to another and makes it dynamic. Click
      the objects on the left, to add them to the textbox.
    </Body>
    <Spacer large />
    <TextArea
      thin
      bind:value
      placeholder="Add text, or lick the objects on the left to add them to the
      textbox." />
    <div class="controls">
      <a href="https://docs.budibase.com/design/binding">
        <Body small grey>Learn more about binding</Body>
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
    align-items: baseline;
    grid-gap: var(--spacing-l);
    grid-template-columns: 1fr auto auto;
  }
  .list {
    width: 150px;
    border-right: 1.5px solid var(--grey-4);
    padding: var(--spacing-xl);
  }
  .text {
    width: 600px;
    padding: var(--spacing-xl);
    font-family: var(--font-sans);
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
    color: var(--grey-7);
    padding: var(--spacing-s) 0;
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  li:hover {
    color: var(--ink);
    font-weight: 500;
  }

  li:active {
    color: var(--blue);
  }
</style>
