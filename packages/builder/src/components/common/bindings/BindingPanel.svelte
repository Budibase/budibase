<script>
  import groupBy from "lodash/fp/groupBy"
  import {
    Search,
    TextArea,
    DrawerContent,
    Tabs,
    Tab,
    Body,
    Layout,
    Button,
  } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    isValid,
    decodeJSBinding,
    encodeJSBinding,
  } from "@budibase/string-templates"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import { handlebarsCompletions } from "constants/completions"
  import { addHBSBinding, addJSBinding } from "./utils"
  import CodeMirrorEditor from "components/common/CodeMirrorEditor.svelte"
  import { convertToJS } from "@budibase/string-templates"
  import { admin } from "stores/portal"

  const dispatch = createEventDispatcher()

  export let bindings
  // jsValue/hbsValue are the state of the value that is being built
  // within this binding panel - the value should not be updated until
  // the binding panel is saved. This is the default value of the
  // expression when the binding panel is opened, but shouldn't be updated.
  export let value = ""
  export let valid
  export let allowJS = false

  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""
  let initialValueJS = value?.startsWith("{{ js ")
  let mode = initialValueJS ? "JavaScript" : "Handlebars"
  let jsValue = initialValueJS ? value : null
  let hbsValue = initialValueJS ? null : value

  $: usingJS = mode === "JavaScript"
  $: searchRgx = new RegExp(search, "ig")
  $: categories = Object.entries(groupBy("category", bindings))
  $: filteredCategories = categories
    .map(([name, categoryBindings]) => ({
      name,
      bindings: categoryBindings?.filter(binding => {
        return binding.readableBinding.match(searchRgx)
      }),
    }))
    .filter(category => category.bindings?.length > 0)
  $: filteredHelpers = helpers?.filter(helper => {
    return helper.label.match(searchRgx) || helper.description.match(searchRgx)
  })
  $: codeMirrorHints = bindings?.map(x => `$("${x.readableBinding}")`)

  const updateValue = val => {
    valid = isValid(readableToRuntimeBinding(bindings, val))
    if (valid) {
      dispatch("change", val)
    }
  }

  // Adds a JS/HBS helper to the expression
  const addHelper = (helper, js) => {
    let tempVal
    const pos = getCaretPosition()
    if (js) {
      const decoded = decodeJSBinding(jsValue)
      tempVal = jsValue = encodeJSBinding(
        addJSBinding(decoded, pos, helper.text, { helper: true })
      )
    } else {
      tempVal = hbsValue = addHBSBinding(hbsValue, pos, helper.text)
    }
    updateValue(tempVal)
  }

  // Adds a data binding to the expression
  const addBinding = (binding, { forceJS } = {}) => {
    if (usingJS || forceJS) {
      let js = decodeJSBinding(jsValue)
      js = addJSBinding(js, getCaretPosition(), binding.readableBinding)
      jsValue = encodeJSBinding(js)
      updateValue(jsValue)
    } else {
      hbsValue = addHBSBinding(
        hbsValue,
        getCaretPosition(),
        binding.readableBinding
      )
      updateValue(hbsValue)
    }
  }

  const onChangeMode = e => {
    mode = e.detail
    updateValue(mode === "JavaScript" ? jsValue : hbsValue)
  }

  const onChangeHBSValue = e => {
    hbsValue = e.detail
    updateValue(hbsValue)
  }

  const onChangeJSValue = e => {
    jsValue = encodeJSBinding(e.detail)
    updateValue(jsValue)
  }

  const convert = () => {
    const runtime = readableToRuntimeBinding(bindings, hbsValue)
    const runtimeJs = encodeJSBinding(convertToJS(runtime))
    jsValue = runtimeToReadableBinding(bindings, runtimeJs)
    hbsValue = null
    mode = "JavaScript"
    addBinding("", { forceJS: true })
  }

  const getHelperExample = (helper, js) => {
    let example = helper.example || ""
    if (js) {
      example = convertToJS(example).split("\n")[0].split("= ")[1]
      if (example === "null;") {
        example = ""
      }
    }
    return example || ""
  }

  onMount(() => {
    valid = isValid(readableToRuntimeBinding(bindings, value))
  })
</script>

<DrawerContent>
  <svelte:fragment slot="sidebar">
    <div class="container">
      <section>
        <div class="heading">Search</div>
        <Search placeholder="Search" bind:value={search} />
      </section>
      {#each filteredCategories as category}
        {#if category.bindings?.length}
          <section>
            <div class="heading">{category.name}</div>
            <ul>
              {#each category.bindings as binding}
                <li on:click={() => addBinding(binding)}>
                  <span class="binding__label">{binding.readableBinding}</span>
                  {#if binding.type}
                    <span class="binding__type">{binding.type}</span>
                  {/if}
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
              <li on:click={() => addHelper(helper, usingJS)}>
                <div class="helper">
                  <div class="helper__name">{helper.displayText}</div>
                  <div class="helper__description">
                    {@html helper.description}
                  </div>
                  <pre class="helper__example">{getHelperExample(
                      helper,
                      usingJS
                    )}</pre>
                </div>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    </div>
  </svelte:fragment>
  <div class="main">
    <Tabs selected={mode} on:select={onChangeMode}>
      <Tab title="Handlebars">
        <div class="main-content">
          <TextArea
            bind:getCaretPosition
            value={hbsValue}
            on:change={onChangeHBSValue}
            placeholder="Add text, or click the objects on the left to add them to the textbox."
          />
          {#if !valid}
            <p class="syntax-error">
              Current Handlebars syntax is invalid, please check the guide
              <a href="https://handlebarsjs.com/guide/">here</a>
              for more details.
            </p>
          {/if}
          {#if $admin.isDev}
            <div class="convert">
              <Button secondary on:click={convert}>Convert to JS</Button>
            </div>
          {/if}
        </div>
      </Tab>
      {#if allowJS}
        <Tab title="JavaScript">
          <div class="main-content">
            <Layout noPadding gap="XS">
              <CodeMirrorEditor
                bind:getCaretPosition
                height={200}
                value={decodeJSBinding(jsValue)}
                on:change={onChangeJSValue}
                hints={codeMirrorHints}
              />
              <Body size="S">
                JavaScript expressions are executed as functions, so ensure that
                your expression returns a value.
              </Body>
            </Layout>
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
    word-wrap: break-word;
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

  .convert {
    padding-top: var(--spacing-m);
  }
</style>
