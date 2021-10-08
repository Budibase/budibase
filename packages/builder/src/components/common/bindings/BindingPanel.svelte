<script>
  import groupBy from "lodash/fp/groupBy"
  import { Search, TextArea, DrawerContent, Tabs, Tab } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { isValid } from "@budibase/string-templates"
  import { readableToRuntimeBinding } from "builderStore/dataBinding"
  import { handlebarsCompletions } from "constants/completions"
  import { addHBSBinding, addJSBinding } from "./utils"
  import CodeMirrorEditor from "components/common/CodeMirrorEditor.svelte"

  const dispatch = createEventDispatcher()

  export let bindableProperties
  export let value = ""
  export let valid
  export let allowJS = true

  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""
  let mode = "Handlebars"

  $: usingJS = mode === "JavaScript"
  $: valid = isValid(readableToRuntimeBinding(bindableProperties, value))
  $: dispatch("change", value)
  $: ({ context } = groupBy("type", bindableProperties))
  $: searchRgx = new RegExp(search, "ig")
  $: filteredBindings = context?.filter(context => {
    return context.readableBinding.match(searchRgx)
  })
  $: filteredHelpers = helpers?.filter(helper => {
    return helper.label.match(searchRgx) || helper.description.match(searchRgx)
  })

  const addHelper = helper => {
    value = addHBSBinding(value, getCaretPosition(), helper.text)
  }

  const addBinding = binding => {
    const fn = usingJS ? addJSBinding : addHBSBinding
    value = fn(value, getCaretPosition(), binding.readableBinding)
  }
</script>

<DrawerContent>
  <svelte:fragment slot="sidebar">
    <div class="container">
      <section>
        <div class="heading">Search</div>
        <Search placeholder="Search" bind:value={search} />
      </section>
      {#if filteredBindings?.length}
        <section>
          <div class="heading">Bindable Values</div>
          <ul>
            {#each filteredBindings as binding}
              <li on:click={() => addBinding(binding)}>
                {binding.readableBinding}
              </li>
            {/each}
          </ul>
        </section>
      {/if}
      {#if filteredHelpers?.length && !usingJS}
        <section>
          <div class="heading">Helpers</div>
          <ul>
            {#each filteredHelpers as helper}
              <li on:click={() => addHelper(helper)}>
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
    <Tabs selected="Handlebars" on:select={e => (mode = e.detail)}>
      <Tab title="Handlebars">
        <div class="main-content">
          <TextArea
            bind:getCaretPosition
            {value}
            on:change={e => (value = e.detail)}
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
      </Tab>
      {#if allowJS}
        <Tab title="JavaScript">
          <div class="main-content">
            <CodeMirrorEditor
              bind:getCaretPosition
              height={200}
              {value}
              on:change={e => (value = e.detail)}
              hints={context?.map(x => `$("${x.readableBinding}")`)}
            />
          </div>
        </Tab>
      {/if}
    </Tabs>
  </div>
</DrawerContent>

<style>
  .main :global(textarea) {
    min-height: 202px !important;
  }
  .main {
    margin: calc(-1 * var(--spacing-xl));
  }
  .main-content {
    padding: var(--spacing-s) var(--spacing-xl);
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
</style>
