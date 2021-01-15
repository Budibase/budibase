<script>
  import groupBy from "lodash/fp/groupBy"
  import { Button, TextArea, Body, Heading, Spacer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  export let bindableProperties
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
  $: hasBindableProperties = !!bindableProperties?.length
</script>

<div class="container" data-cy="binding-dropdown-modal">
  <div class="list">
    {#if hasBindableProperties}
      {#if context}
        <Heading extraSmall>Datasources</Heading>
        <Spacer small />
        <ul>
          {#each context as { readableBinding }}
            <li on:click={() => addToText(readableBinding)}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      {/if}
      {#if instance}
        <Spacer medium />
        <Heading extraSmall>Components</Heading>
        <Spacer small />
        <ul>
          {#each instance as { readableBinding }}
            <li on:click={() => addToText(readableBinding)}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      {/if}
    {:else}
      <div class="empty">There aren't any bindable properties available.</div>
    {/if}
  </div>
  <div class="text">
    <Heading extraSmall>Data Binding</Heading>
    <Spacer small />
    <Body extraSmall lh>
      Binding connects one piece of data to another and makes it dynamic. Click
      the objects on the left to add them to the extbox.
    </Body>
    <Spacer large />
    <TextArea
      thin
      bind:value
      placeholder="Add text, or click the objects on the left to add them to the textbox." />
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
    align-items: center;
    grid-gap: var(--spacing-l);
    grid-template-columns: 1fr auto auto;
  }
  .list {
    width: 200px;
    border-right: 1.5px solid var(--grey-4);
    padding: var(--spacing-xl);
    max-height: 300px;
    overflow: auto;
  }
  .text {
    width: 600px;
    padding: var(--spacing-xl);
    font-family: var(--font-sans);
  }
  .text :global(p) {
    margin: 0;
  }
  .text :global(textarea) {
    min-height: 50px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--grey-7);
    padding: var(--spacing-xs) 0;
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  li:hover {
    color: var(--ink);
  }

  li:active {
    color: var(--blue);
  }

  div.empty {
    font-size: var(--font-size-xs);
    color: var(--grey-5);
  }
</style>
