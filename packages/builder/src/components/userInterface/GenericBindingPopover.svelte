<script>
  import groupBy from "lodash/fp/groupBy"
  import { TextArea, Label, Body, Button, Popover } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let value
  export let bindings = []
  export let anchor
  export let align
  export let popover

  $: categories = Object.entries(groupBy("category", bindings))

  function onClickBinding(binding) {
    value += `{{ ${binding.path} }}`
  }
</script>

<Popover {anchor} {align} bind:this={popover}>
  <div class="container">
    <div class="bindings">
      <Label large>Available bindings</Label>
      <div class="bindings__wrapper">
        <div class="bindings__list">
          {#each categories as [categoryName, bindings]}
            <Label small>{categoryName}</Label>
            {#each bindings as binding}
              <div class="binding" on:click={() => onClickBinding(binding)}>
                <span class="binding__label">{binding.label}</span>
                <span class="binding__type">{binding.type}</span>
                <br />
                <div class="binding__description">{binding.description}</div>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    </div>
    <div class="editor">
      <Label large>Data binding</Label>
      <Body small>
        Binding connects one piece of data to another and makes it dynamic.
        Click the objects on the left to add them to the textbox.
      </Body>
      <TextArea thin bind:value placeholder="..." />
      <div class="controls">
        <a href="#">
          <Body small color="light">Learn more about binding</Body>
        </a>
        <Button on:click={popover.hide} primary>Done</Button>
      </div>
    </div>
  </div>
</Popover>

<style>
  .container {
    display: grid;
    grid-template-columns: 280px 1fr;
    width: 800px;
  }

  .bindings {
    border-right: 1px solid var(--grey-4);
    flex: 0 0 240px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding-right: var(--spacing-l);
  }
  .bindings :global(label) {
    margin: var(--spacing-m) 0;
  }
  .bindings :global(label:first-child) {
    margin-top: 0;
  }
  .bindings__wrapper {
    overflow-y: auto;
    position: relative;
    flex: 1 1 auto;
  }
  .bindings__list {
    position: absolute;
    width: 100%;
  }

  .binding {
    font-size: 12px;
    padding: var(--spacing-s);
    border-radius: var(--border-radius-m);
  }
  .binding:hover {
    background-color: var(--grey-2);
    cursor: pointer;
  }
  .binding__label {
    font-weight: 500;
    text-transform: capitalize;
  }
  .binding__description {
    color: var(--grey-8);
    margin-top: 2px;
  }
  .binding__type {
    font-family: monospace;
    background-color: var(--grey-2);
    border-radius: var(--border-radius-m);
    padding: 2px;
    margin-left: 2px;
    font-weight: 500;
  }

  .editor {
    padding-left: var(--spacing-l);
  }
  .editor :global(textarea) {
    min-height: 60px;
  }

  .controls {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: var(--spacing-l);
    align-items: center;
    margin-top: var(--spacing-m);
  }
</style>
