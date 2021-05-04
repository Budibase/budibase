<script>
  import groupBy from "lodash/fp/groupBy"
  import { Search, TextArea, Heading, Label, DrawerContent, Layout } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { isValid } from "@budibase/string-templates"
  import {
    getBindableProperties,
    readableToRuntimeBinding,
  } from "builderStore/dataBinding"
  import { currentAsset, store } from "../../../builderStore"
  import { handlebarsCompletions } from "constants/completions"
  import { addToText } from "./utils"

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

  export function cancel() {
    dispatch("update", originalValue)
    bindingDrawer.close()
  }
</script>

<DrawerContent>
  <svelte:fragment slot="sidebar">
  <Layout>
    <Search placeholder="Search" bind:value={search} />
    {#if context}
      <section>
        <Heading size="XS">Columns</Heading>
        <ul>
          {#each context.filter((context) =>
            context.readableBinding.match(searchRgx)
          ) as { readableBinding }}
            <li
              on:click={() => {
                value = addToText(value, getCaretPosition(), readableBinding)
              }}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
    {#if instance}
      <section>
        <Heading size="XS">Components</Heading>
        <ul>
          {#each instance.filter((instance) =>
            instance.readableBinding.match(searchRgx)
          ) as { readableBinding }}
            <li
              on:click={() => {
                value = addToText(value, getCaretPosition(), readableBinding)
              }}>
              {readableBinding}
            </li>
          {/each}
        </ul>
      </section>
    {/if}
    <section>
      <Heading size="XS">Helpers</Heading>
      <ul>
        {#each helpers.filter((helper) => helper.label.match(searchRgx) || helper.description.match(searchRgx)) as helper}
          <li
            on:click={() => {
              value = addToText(value, getCaretPosition(), helper.text)
            }}>
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
    </section>
  </Layout>
  </svelte:fragment>
  <div class="main">
    <TextArea
      bind:getCaretPosition
      bind:value
      placeholder="Add text, or click the objects on the left to add them to the textbox."
    />
    {#if !valid}
      <p class="syntax-error">
        Current Handlebars syntax is invalid, please check the guide
        <a href="https://handlebarsjs.com/guide/">here</a>
        for more details.
      </p>
    {/if}
  </div>
</DrawerContent>

<style>
  .main {
    padding: var(--spacing-m);
  }

  .main :global(textarea) {
    min-height: 150px !important;
  }

  section {
    display: grid;
    grid-gap: var(--spacing-s);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    color: var(--grey-7);
    padding: var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
    border-top: var(--border-light);
    border-width: 1px 0 1px 0;
    border-radius: 4px;
  }

  pre,
  .description {
    white-space: normal;
  }

  li:hover {
    background-color: var(--grey-2);
    cursor: pointer;
  }

  li:active {
    color: var(--blue);
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
