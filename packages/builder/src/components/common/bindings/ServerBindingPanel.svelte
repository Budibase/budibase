<script>
  import groupBy from "lodash/fp/groupBy"
  import { Search, TextArea, DrawerContent } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { isValid } from "@budibase/string-templates"
  import { handlebarsCompletions } from "constants/completions"
  import { readableToRuntimeBinding } from "builderStore/dataBinding"
  import { addToText } from "./utils"

  const dispatch = createEventDispatcher()

  export let bindableProperties = []
  export let valid = true
  export let value = ""

  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""

  $: categories = Object.entries(groupBy("category", bindableProperties))
  $: valid = isValid(readableToRuntimeBinding(bindableProperties, value))
  $: dispatch("change", value)
  $: searchRgx = new RegExp(search, "ig")
  $: filteredCategories = categories.map(([categoryName, bindings]) => {
    const filteredBindings = bindings.filter(binding => {
      return binding.label.match(searchRgx)
    })
    return [categoryName, filteredBindings]
  })
  $: filteredHelpers = helpers?.filter(helper => {
    return helper.label.match(searchRgx) || helper.description.match(searchRgx)
  })
</script>

<DrawerContent>
  <svelte:fragment slot="sidebar">
    <div class="container">
      <section>
        <div class="heading">Search</div>
        <Search placeholder="Search" bind:value={search} />
      </section>
      {#each filteredCategories as [categoryName, bindings]}
        {#if bindings.length}
          <section>
            <div class="heading">{categoryName}</div>
            <ul>
              {#each bindings as binding}
                <li
                  on:click={() => {
                    value = addToText(value, getCaretPosition(), binding)
                  }}
                >
                  <span class="binding__label">{binding.label}</span>
                  <span class="binding__type">{binding.type}</span>
                  {#if binding.description}
                    <br />
                    <div class="binding__description">
                      {binding.description || ""}
                    </div>
                  {/if}
                </li>
              {/each}
            </ul>
          </section>
        {/if}
      {/each}
      {#if filteredHelpers?.length}
        <section>
          <div class="heading">Helpers</div>
          <ul>
            {#each filteredHelpers as helper}
              <li
                on:click={() => {
                  value = addToText(value, getCaretPosition(), helper.text)
                }}
              >
                <div class="helper">
                  <div class="helper__name">{helper.displayText}</div>
                  <div class="helper__description">
                    {@html helper.description}
                  </div>
                  <pre class="helper__example">{helper.example || ''}</pre>
                </div>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
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
  .main :global(textarea) {
    min-height: 150px !important;
  }

  .container {
    margin: calc(-1 * var(--spacing-xl));
  }
  .heading {
    font-size: var(--font-size-s);
    font-weight: 600;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
    padding: var(--spacing-xl) 0 var(--spacing-m) 0;
  }

  section {
    padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  }
  section:not(:first-child) {
    border-top: var(--border-light);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: var(--font-size-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    border: var(--border-light);
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
  }
  li:not(:last-of-type) {
    margin-bottom: var(--spacing-s);
  }
  li :global(*) {
    transition: color 130ms ease-in-out;
  }
  li:hover {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-global-color-gray-500);
    cursor: pointer;
  }
  li:hover :global(*) {
    color: var(--spectrum-global-color-gray-900) !important;
  }

  .helper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
  .helper__name {
    font-weight: bold;
  }
  .helper__description,
  .helper__description :global(*) {
    color: var(--spectrum-global-color-gray-700);
  }
  .helper__example {
    white-space: normal;
    margin: 0.5rem 0 0 0;
    font-weight: 700;
  }
  .helper__description :global(p) {
    margin: 0;
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

  .binding__label {
    font-weight: 600;
    text-transform: capitalize;
  }
  .binding__description {
    color: var(--spectrum-global-color-gray-700);
    margin: 0.5rem 0 0 0;
    white-space: normal;
  }
  .binding__type {
    font-family: monospace;
    background-color: var(--spectrum-global-color-gray-200);
    border-radius: var(--border-radius-s);
    padding: 2px 4px;
    margin-left: 2px;
    font-weight: 600;
  }
</style>
