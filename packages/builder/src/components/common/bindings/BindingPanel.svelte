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
    ActionButton,
    Icon,
    Popover,
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
  export let allowHelpers = true

  let helpers = handlebarsCompletions()
  let getCaretPosition
  let search = ""
  let initialValueJS = typeof value === "string" && value?.startsWith("{{ js ")
  let mode = initialValueJS ? "JavaScript" : "Handlebars"
  let jsValue = initialValueJS ? value : null
  let hbsValue = initialValueJS ? null : value

  let selectedCategory = null

  let popover
  let popoverAnchor
  let hoverTarget

  $: usingJS = mode === "JavaScript"
  $: searchRgx = new RegExp(search, "ig")
  $: categories = Object.entries(groupBy("category", bindings))

  $: bindingIcons = bindings?.reduce((acc, ele) => {
    if (ele.icon) {
      acc[ele.category] = acc[ele.category] || ele.icon
    }
    return acc
  }, {})

  $: categoryIcons = { ...bindingIcons, Helpers: "MagicWand" }

  $: filteredCategories = categories
    .map(([name, categoryBindings]) => ({
      name,
      bindings: categoryBindings?.filter(binding => {
        return binding.readableBinding.match(searchRgx)
      }),
    }))
    .filter(category => {
      return (
        category.bindings?.length > 0 &&
        (!selectedCategory ? true : selectedCategory === category.name)
      )
    })

  $: filteredHelpers = helpers?.filter(helper => {
    return helper.label.match(searchRgx) || helper.description.match(searchRgx)
  })

  $: categoryNames = getCategoryNames(categories)

  $: codeMirrorHints = bindings?.map(x => `$("${x.readableBinding}")`)

  const updateValue = val => {
    valid = isValid(readableToRuntimeBinding(bindings, val))
    if (valid) {
      dispatch("change", val)
    }
  }

  const getCategoryNames = categories => {
    let names = [...categories.map(cat => cat[0])]
    if (allowHelpers) {
      names.push("Helpers")
    }
    return names
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

<span class="detailPopover">
  <Popover
    align="right-outside"
    bind:this={popover}
    anchor={popoverAnchor}
    maxWidth={300}
  >
    <Layout gap="S">
      <div class="helper">
        {#if hoverTarget.title}
          <div class="helper__name">{hoverTarget.title}</div>
        {/if}
        {#if hoverTarget.description}
          <div class="helper__description">
            {@html hoverTarget.description}
          </div>
        {/if}
        {#if hoverTarget.example}
          <pre class="helper__example">{hoverTarget.example}</pre>
        {/if}
      </div>
    </Layout>
  </Popover>
</span>

<DrawerContent>
  <svelte:fragment slot="sidebar">
    <Layout noPadding gap="S">
      {#if selectedCategory}
        <div>
          <ActionButton
            secondary
            icon={"ArrowLeft"}
            on:click={() => {
              selectedCategory = null
            }}
          >
            Back
          </ActionButton>
        </div>
      {/if}

      {#if !selectedCategory}
        <div class="heading">Search</div>
        <Search placeholder="Search" bind:value={search} />
      {/if}

      {#if !selectedCategory && !search}
        <ul class="category-list">
          {#each categoryNames as categoryName}
            <li
              on:click={() => {
                selectedCategory = categoryName
              }}
            >
              <Icon name={categoryIcons[categoryName]} />
              <span class="category-name">{categoryName} </span>
              <span class="category-chevron"><Icon name="ChevronRight" /></span>
            </li>
          {/each}
        </ul>
      {/if}

      {#if selectedCategory || search}
        {#each filteredCategories as category}
          {#if category.bindings?.length}
            <div class="cat-heading">
              <Icon name={categoryIcons[category.name]} />{category.name}
            </div>
            <ul>
              {#each category.bindings as binding}
                <li
                  class="binding"
                  on:mouseenter={e => {
                    popoverAnchor = e.target
                    if (!binding.description) {
                      return
                    }
                    hoverTarget = {
                      title: binding.display?.name || binding.fieldSchema?.name,
                      description: binding.description,
                    }
                    popover.show()
                    e.stopPropagation()
                  }}
                  on:mouseleave={() => {
                    popover.hide()
                    popoverAnchor = null
                    hoverTarget = null
                  }}
                  on:focus={() => {}}
                  on:blur={() => {}}
                  on:click={() => addBinding(binding)}
                >
                  <span class="binding__label">
                    {#if binding.display?.name}
                      {binding.display.name}
                    {:else if binding.fieldSchema?.name}
                      {binding.fieldSchema?.name}
                    {:else}
                      {binding.readableBinding}
                    {/if}
                  </span>

                  {#if binding.display?.type || binding.fieldSchema?.type}
                    <span class="binding__typeWrap">
                      <span class="binding__type">
                        {binding.display?.type || binding.fieldSchema?.type}
                      </span>
                    </span>
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {/each}

        {#if selectedCategory === "Helpers" || search}
          {#if filteredHelpers?.length}
            <div class="heading">Helpers</div>
            <ul class="helpers">
              {#each filteredHelpers as helper}
                <li
                  class="binding"
                  on:click={() => addHelper(helper, usingJS)}
                  on:mouseenter={e => {
                    popoverAnchor = e.target
                    if (!helper.displayText && helper.description) {
                      return
                    }
                    hoverTarget = {
                      title: helper.displayText,
                      description: helper.description,
                      example: getHelperExample(helper, usingJS),
                    }
                    popover.show()
                    e.stopPropagation()
                  }}
                  on:mouseleave={() => {
                    popover.hide()
                    popoverAnchor = null
                    hoverTarget = null
                  }}
                  on:focus={() => {}}
                  on:blur={() => {}}
                >
                  <span class="binding__label">{helper.displayText}</span>
                  <span class="binding__typeWrap">
                    <span class="binding__type">function</span>
                  </span>
                </li>
              {/each}
            </ul>
          {/if}
        {/if}
      {/if}
    </Layout>
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
          {#if $admin.isDev && allowJS}
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
  ul.helpers li * {
    pointer-events: none;
  }
  ul.category-list li {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }
  ul.category-list .category-name {
    font-weight: 600;
    text-transform: capitalize;
  }
  ul.category-list .category-chevron {
    flex: 1;
    text-align: right;
  }
  ul.category-list .category-chevron :global(div.icon),
  .cat-heading :global(div.icon) {
    display: inline-block;
  }
  li.binding {
    display: flex;
    align-items: center;
  }
  li.binding .binding__typeWrap {
    flex: 1;
    text-align: right;
    text-transform: capitalize;
  }
  .main :global(textarea) {
    min-height: 202px !important;
  }
  .main {
    margin: calc(-1 * var(--spacing-xl));
  }
  .main-content {
    padding: var(--spacing-s) var(--spacing-xl);
  }

  .heading,
  .cat-heading {
    font-size: var(--font-size-s);
    font-weight: 600;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
  }

  .cat-heading {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
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
    background-color: var(--spectrum-global-color-gray-200);
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
    cursor: pointer;
  }

  .binding__label {
    font-weight: 600;
    text-transform: capitalize;
  }

  .binding__type {
    font-family: var(--font-mono);
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
