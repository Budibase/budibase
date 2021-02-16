<script>
  import groupBy from "lodash/fp/groupBy"
  import { Input, TextArea, Heading, Spacer, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { isValid } from "@budibase/string-templates"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
  } from "builderStore/dataBinding"
  import { currentAsset, store } from "../../../builderStore"
  import { handlebarsCompletions } from "constants/completions"

  const dispatch = createEventDispatcher()

  export let bindableProperties
  export let value = ""
  export let bindingDrawer
  export let valid = true

  let originalValue = value
  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""

  $: value && checkValid()
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: dispatch("update", value)
  $: ({ instance, context } = groupBy("type", bindableProperties))
  $: searchRgx = new RegExp(search, "ig")

  function checkValid() {
    // TODO: need to convert the value to the runtime binding
    const runtimeBinding = readableToRuntimeBinding(bindableProperties, value)
    valid = isValid(runtimeBinding)
  }

  function addToText(readableBinding) {
    const position = getCaretPosition()
    const toAdd = `{{ ${readableBinding} }}`
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

  function updateValue({ detail }) {
    value = detail.value
  }
</script>

<div class="drawer-contents">
  <div class="container" data-cy="binding-dropdown-modal">
    <div class="list">
      <Input extraThin placeholder="Search" bind:value={search} />
      <Spacer medium />
      {#if context}
        <Heading extraSmall>Columns</Heading>
        <Spacer small />
        <ul>
          {#each context.filter(context =>
            context.readableBinding.match(searchRgx)
          ) as { readableBinding }}
            <li on:click={() => addToText(readableBinding)}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      {/if}
      <Spacer small />
      {#if instance}
        <Heading extraSmall>Components</Heading>
        <Spacer small />
        <ul>
          {#each instance.filter(instance =>
            instance.readableBinding.match(searchRgx)
          ) as { readableBinding }}
            <li on:click={() => addToText(readableBinding)}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      {/if}
      <Spacer small />
      <Heading extraSmall>Helpers</Heading>
      <Spacer small />
      <ul>
        {#each helpers.filter(helper => helper.label.match(searchRgx) || helper.description.match(searchRgx)) as helper}
          <li on:click={() => addToText(helper.text)}>
            <div>
              <Label extraSmall>{helper.displayText}</Label>
              <div class="description">
                {@html helper.description}
              </div>
              <pre>{helper.example || ''}</pre>
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="text">
      <TextArea
        bind:getCaretPosition
        thin
        bind:value
        placeholder="Add text, or click the objects on the left to add them to
        the textbox." />
      {#if !valid}
        <p class="syntax-error">
          Current Handlebars syntax is invalid, please check the guide
          <a href="https://handlebarsjs.com/guide/">here</a>
          for more details.
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    height: 100%;
    display: grid;
    grid-template-columns: 260px 1fr;
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
    padding: var(--spacing-m) 0;
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
    border: var(--border-light);
    border-width: 1px 0 1px 0;
  }

  pre,
  .description {
    white-space: normal;
  }

  li:hover {
    color: var(--ink);
    font-weight: 500;
  }

  li:active {
    color: var(--blue);
  }

  .drawer-contents {
    height: 40vh;
    overflow-y: auto;
  }

  .syntax-error {
    padding-top: var(--spacing-m);
    color: var(--red);
    font-size: 12px;
  }

  .syntax-error a {
    color: var(--red);
    text-decoration: underline;
  }

  .description :global(p) {
    color: var(--grey-7);
  }

  .description :global(p:hover) {
    color: var(--ink);
  }

  .description :global(p a) {
    color: var(--grey-7);
  }
</style>
