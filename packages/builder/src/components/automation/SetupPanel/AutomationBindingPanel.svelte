<script>
  import groupBy from "lodash/fp/groupBy"
  import { Input, TextArea, Heading, Spacer, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { isValid } from "@budibase/string-templates"
  import { handlebarsCompletions } from "constants/completions"

  const dispatch = createEventDispatcher()

  export let value = ""
  export let bindingDrawer
  export let bindableProperties = []

  let originalValue = value
  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""
  let validity = true

  $: categories = Object.entries(groupBy("category", bindableProperties))
  $: value && checkValid()
  $: dispatch("update", value)
  $: searchRgx = new RegExp(search, "ig")

  function checkValid() {
    validity = isValid(value)
  }

  function addToText(binding) {
    const position = getCaretPosition()
    const toAdd = `{{ ${binding.path} }}`
    if (position.start) {
      value =
        value.substring(0, position.start) +
        toAdd +
        value.substring(position.end, value.length)
    } else {
      value += toAdd
    }
  }
  export function cancel() {
    dispatch("update", originalValue)
    bindingDrawer.close()
  }
</script>

<div class="container">
  <div class="list">
    <Heading small>Available bindings</Heading>
    <Spacer medium />
    <Input extraThin placeholder="Search" bind:value={search} />
    <Spacer medium />
    {#each categories as [categoryName, bindings]}
      <Heading extraSmall>{categoryName}</Heading>
      <Spacer extraSmall />
      {#each bindableProperties.filter(binding =>
        binding.label.match(searchRgx)
      ) as binding}
        <div class="binding" on:click={() => addToText(binding)}>
          <span class="binding__label">{binding.label}</span>
          <span class="binding__type">{binding.type}</span>
          <br />
          <div class="binding__description">{binding.description || ''}</div>
        </div>
      {/each}
    {/each}
    <Heading extraSmall>Helpers</Heading>
    <Spacer extraSmall />
    {#each helpers.filter(helper => helper.label.match(searchRgx) || helper.description.match(searchRgx)) as helper}
      <div class="binding" on:click={() => addToText(helper)}>
        <span class="binding__label">{helper.label}</span>
        <br />
        <div class="binding__description">
          {@html helper.description || ''}
        </div>
        <pre>{helper.example || ''}</pre>
      </div>
    {/each}
  </div>
  <div class="text">
    <TextArea
      bind:getCaretPosition
      thin
      bind:value
      placeholder="Add text, or click the objects on the left to add them to the textbox." />
    {#if !validity}
      <p class="syntax-error">
        Current Handlebars syntax is invalid, please check the guide
        <a href="https://handlebarsjs.com/guide/">here</a>
        for more details.
      </p>
    {/if}
  </div>
</div>

<style>
  .container {
    height: 40vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 280px 1fr;
  }

  .list {
    border-right: var(--border-light);
    padding: var(--spacing-l);
    overflow: auto;
  }
  .list {
    border-right: var(--border-light);
    padding: var(--spacing-l);
    overflow: auto;
  }

  .list::-webkit-scrollbar {
    display: none;
  }

  .text {
    padding: var(--spacing-l);
    font-family: var(--font-sans);
  }
  .text :global(textarea) {
    min-height: 100px;
  }
  .text :global(p) {
    margin: 0;
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
    white-space: normal;
  }

  pre {
    white-space: normal;
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

  .syntax-error {
    color: var(--red);
    font-size: 12px;
  }

  .syntax-error a {
    color: var(--red);
    text-decoration: underline;
  }
</style>
