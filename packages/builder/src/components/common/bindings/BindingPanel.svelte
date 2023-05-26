<script>
  import groupBy from "lodash/fp/groupBy"
  import {
    Search,
    Input,
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
  import { convertToJS } from "@budibase/string-templates"
  import { admin } from "stores/portal"
  import CodeEditor from "../CodeEditor/CodeEditor.svelte"
  import {
    getHelperCompletions,
    jsAutocomplete,
    hbAutocomplete,
    EditorModes,
    bindingsToCompletions,
    hbInsert,
    jsInsert,
  } from "../CodeEditor"
  import { getContext } from "svelte"

  import BindingPicker from "./BindingPicker.svelte"

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

  const drawerActions = getContext("drawer-actions")
  const bindingDrawerActions = getContext("binding-drawer-actions")

  let helpers = handlebarsCompletions()
  let getCaretPosition
  let insertAtPos
  let search = ""
  let initialValueJS = typeof value === "string" && value?.startsWith("{{ js ")
  let mode = initialValueJS ? "JavaScript" : "Text"
  let jsValue = initialValueJS ? value : null
  let hbsValue = initialValueJS ? null : value
  let sidebar = true
  let selectedCategory = null

  let popover
  let popoverAnchor
  let hoverTarget

  $: usingJS = mode === "JavaScript"
  $: searchRgx = new RegExp(search, "ig")
  $: categories = Object.entries(groupBy("category", bindings))

  $: editorMode = mode == "JavaScript" ? EditorModes.JS : EditorModes.Handlebars
  $: bindingCompletions = bindingsToCompletions(bindings, editorMode)

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
  const onSelectHelper = (helper, js) => {
    const pos = getCaretPosition()
    const { start, end } = pos
    if (js) {
      let js = decodeJSBinding(jsValue)
      const insertVal = jsInsert(js, start, end, helper.text, { helper: true })
      insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(hbsValue, start, end, helper.text)
      insertAtPos({ start, end, value: insertVal })
    }
  }

  // Adds a data binding to the expression
  const onSelectBinding = (binding, { forceJS } = {}) => {
    const { start, end } = getCaretPosition()
    if (usingJS || forceJS) {
      let js = decodeJSBinding(jsValue)
      const insertVal = jsInsert(js, start, end, binding.readableBinding)
      insertAtPos({ start, end, value: insertVal })
    } else {
      const insertVal = hbInsert(hbsValue, start, end, binding.readableBinding)
      insertAtPos({ start, end, value: insertVal })
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
    onSelectBinding("", { forceJS: true })
  }

  onMount(() => {
    valid = isValid(readableToRuntimeBinding(bindings, value))
  })
</script>

<DrawerContent>
  <div class="main">
    <Tabs selected={mode} on:select={onChangeMode}>
      <Tab title="Text">
        <div class="main-content" class:binding-panel={sidebar}>
          <div class="editor">
            <CodeEditor
              value={hbsValue}
              on:change={onChangeHBSValue}
              bind:getCaretPosition
              bind:insertAtPos
              completions={[
                hbAutocomplete([
                  ...bindingCompletions,
                  ...getHelperCompletions(),
                ]),
              ]}
              placeholder="Add text, or click the objects on the left to add them to the textbox."
            />
            <div class="binding-footer">
              <div class="messaging">
                {#if !valid}
                  <p class="syntax-error">
                    Current Handlebars syntax is invalid, please check the guide
                    <a href="https://handlebarsjs.com/guide/">here</a>
                    for more details.
                  </p>
                {/if}
              </div>
              <div class="actions">
                {#if $admin.isDev && allowJS}
                  <ActionButton secondary>Convert To JS</ActionButton>
                {/if}
                <ActionButton
                  secondary
                  icon={sidebar ? "RailRightClose" : "RailRightOpen"}
                  on:click={() => {
                    sidebar = !sidebar
                  }}
                />
              </div>
            </div>
          </div>

          {#if sidebar}
            <div class="binding-picker">
              <BindingPicker
                {bindings}
                {allowHelpers}
                addHelper={onSelectHelper}
                addBinding={onSelectBinding}
                mode={editorMode}
              />
            </div>
          {/if}
        </div>
      </Tab>
      {#if allowJS}
        <Tab title="JavaScript">
          <div class="main-content" class:binding-panel={sidebar}>
            <div class="editor">
              <CodeEditor
                value={decodeJSBinding(jsValue)}
                on:change={onChangeJSValue}
                completions={[
                  jsAutocomplete([
                    ...bindingCompletions,
                    ...getHelperCompletions(),
                  ]),
                ]}
                mode={EditorModes.JS}
                bind:getCaretPosition
                bind:insertAtPos
              />
              <Body size="S">
                JavaScript expressions are executed as functions, so ensure that
                your expression returns a value.
              </Body>
            </div>

            {#if sidebar}
              <div class="binding-picker">
                <BindingPicker
                  {bindings}
                  {allowHelpers}
                  addHelper={onSelectHelper}
                  addBinding={onSelectBinding}
                  mode={editorMode}
                />
              </div>
            {/if}
          </div>
        </Tab>
      {/if}
      <div class="drawer-actions">
        <Button
          secondary
          quiet
          on:click={() => {
            console.log(drawerActions)
            drawerActions.hide()
          }}
        >
          Cancel
        </Button>
        <Button
          cta
          on:click={() => {
            bindingDrawerActions.save()
          }}
        >
          Save
        </Button>
      </div>
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

  .main :global(.spectrum-Tabs div.drawer-actions) {
    display: flex;
    gap: var(--spacing-m);
    margin-left: auto;
  }

  .main :global(.spectrum-Tabs-content),
  .main :global(.spectrum-Tabs-content .main-content) {
    margin-top: 0px;
    padding: 0px;
  }

  .main :global(.spectrum-Tabs) {
    display: flex;
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

  .binding-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: var(--spacing-m);
  }
  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 270px;
  }
  .main-content.binding-panel {
    grid-template-columns: 1fr 320px;
  }
  .binding-picker {
    overflow-y: auto;
    border-left: 2px solid var(--border-light);
    border-left: var(--border-light);
  }
  .editor {
    padding: var(--spacing-xl);
    padding-bottom: 0px;
  }
</style>
