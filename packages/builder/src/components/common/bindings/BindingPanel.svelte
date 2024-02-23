<script>
  import { DrawerContent, ActionButton, Icon } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    isValid,
    decodeJSBinding,
    encodeJSBinding,
    convertToJS,
    processStringSync,
  } from "@budibase/string-templates"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "dataBinding"
  import CodeEditor from "../CodeEditor/CodeEditor.svelte"
  import {
    getHelperCompletions,
    jsAutocomplete,
    hbAutocomplete,
    EditorModes,
    bindingsToCompletions,
  } from "../CodeEditor"
  import BindingSidePanel from "./BindingSidePanel.svelte"
  import EvaluationSidePanel from "./EvaluationSidePanel.svelte"
  import { BindingHelpers } from "./utils"
  import formatHighlight from "json-format-highlight"
  import { capitalise } from "helpers"

  const dispatch = createEventDispatcher()

  export let bindings
  export let value = ""
  export let valid
  export let allowJS = false
  export let allowHelpers = true
  export let context = null
  export let autofocusEditor = false

  const Modes = {
    Text: "Text",
    JavaScript: "JavaScript",
  }
  const SidePanels = {
    Bindings: "FlashOn",
    Evaluation: "Play",
  }

  let initialValueJS = value?.startsWith?.("{{ js ")
  let mode = initialValueJS ? Modes.JavaScript : Modes.Text
  let sidePanel = null

  let getCaretPosition
  let insertAtPos
  let jsValue = initialValueJS ? value : null
  let hbsValue = initialValueJS ? null : value
  let targetMode = null
  let expressionResult

  $: editorTabs = allowJS ? [Modes.Text, Modes.JavaScript] : [Modes.Text]
  $: sideTabs = [SidePanels.Evaluation, SidePanels.Bindings]
  $: enrichedBindings = enrichBindings(bindings, context)
  $: usingJS = mode === Modes.JavaScript
  $: editorMode =
    mode === Modes.JavaScript ? EditorModes.JS : EditorModes.Handlebars
  $: bindingCompletions = bindingsToCompletions(enrichedBindings, editorMode)
  $: runtimeExpression = readableToRuntimeBinding(enrichedBindings, value)
  $: expressionResult = processStringSync(runtimeExpression || "", context)
  $: bindingHelpers = new BindingHelpers(getCaretPosition, insertAtPos)

  const getBindingValue = (binding, context) => {
    const hbs = `{{ literal ${binding.runtimeBinding} }}`
    const res = processStringSync(hbs, context)
    return JSON.stringify(res, null, 2)
  }

  const highlightJSON = json => {
    return formatHighlight(json, {
      keyColor: "#e06c75",
      numberColor: "#e5c07b",
      stringColor: "#98c379",
      trueColor: "#d19a66",
      falseColor: "#d19a66",
      nullColor: "#c678dd",
    })
  }

  const enrichBindings = (bindings, context) => {
    return bindings.map(binding => {
      const value = getBindingValue(binding, context)
      return {
        ...binding,
        value,
        valueHTML: highlightJSON(value),
      }
    })
  }

  const updateValue = val => {
    const runtimeExpression = readableToRuntimeBinding(enrichedBindings, val)
    valid = isValid(runtimeExpression)
    if (valid) {
      dispatch("change", val)
      expressionResult = processStringSync(runtimeExpression || "", context)
    }
  }

  const onSelectHelper = (helper, js) => {
    bindingHelpers.onSelectHelper(js ? jsValue : hbsValue, helper, { js })
  }

  const onSelectBinding = (binding, { forceJS } = {}) => {
    const js = usingJS || forceJS
    bindingHelpers.onSelectBinding(js ? jsValue : hbsValue, binding, { js })
  }

  const changeMode = newMode => {
    mode = newMode
    updateValue(newMode === Modes.JavaScript ? jsValue : hbsValue)
  }

  const changeSidePanel = newSidePanel => {
    sidePanel = newSidePanel === sidePanel ? null : newSidePanel
  }

  const onChangeHBSValue = e => {
    hbsValue = e.detail
    updateValue(hbsValue)
  }

  const onChangeJSValue = e => {
    jsValue = encodeJSBinding(e.detail)
    updateValue(jsValue)
  }

  const switchMode = () => {
    if (targetMode === "Text") {
      jsValue = null
      updateValue(jsValue)
    } else {
      hbsValue = null
      updateValue(hbsValue)
    }
    mode = targetMode + ""
    targetMode = null
  }

  const convert = () => {
    const runtime = readableToRuntimeBinding(enrichedBindings, hbsValue)
    const runtimeJs = encodeJSBinding(convertToJS(runtime))
    jsValue = runtimeToReadableBinding(enrichedBindings, runtimeJs)
    hbsValue = null
    mode = "JavaScript"
    onSelectBinding("", { forceJS: true })
  }

  onMount(() => {
    valid = isValid(readableToRuntimeBinding(enrichedBindings, value))
  })
</script>

<DrawerContent padding={false}>
  <div class="binding-panel">
    <div class="main">
      <div class="tabs">
        <div class="editor-tabs">
          {#each editorTabs as tab}
            <ActionButton
              size="M"
              quiet
              selected={mode === tab}
              on:click={() => changeMode(tab)}
            >
              {capitalise(tab)}
            </ActionButton>
          {/each}
        </div>
        <div class="side-tabs">
          {#each sideTabs as tab}
            <ActionButton
              size="M"
              quiet
              selected={sidePanel === tab}
              on:click={() => changeSidePanel(tab)}
            >
              <Icon name={tab} size="S" />
            </ActionButton>
          {/each}
        </div>
      </div>
      <div class="editor">
        {#if mode === Modes.Text}
          <CodeEditor
            value={hbsValue}
            on:change={onChangeHBSValue}
            bind:getCaretPosition
            bind:insertAtPos
            completions={[
              hbAutocomplete([
                ...bindingCompletions,
                ...getHelperCompletions(editorMode),
              ]),
            ]}
            height="100%"
            autofocus={autofocusEditor}
            placeholder="Add bindings by typing &#123;&#123; or use the menu on the right"
          />
        {:else if mode === Modes.JavaScript}
          <CodeEditor
            value={decodeJSBinding(jsValue)}
            on:change={onChangeJSValue}
            completions={[
              jsAutocomplete([
                ...bindingCompletions,
                ...getHelperCompletions(editorMode),
              ]),
            ]}
            mode={EditorModes.JS}
            bind:getCaretPosition
            bind:insertAtPos
            height="100%"
            autofocus={autofocusEditor}
            placeholder="Add bindings by typing $ or use the menu on the right"
          />
        {/if}
      </div>
    </div>
    <div class="side" class:visible={!!sidePanel}>
      {#if sidePanel === SidePanels.Bindings}
        <BindingSidePanel
          bindings={enrichedBindings}
          {allowHelpers}
          {context}
          addHelper={onSelectHelper}
          addBinding={onSelectBinding}
          mode={editorMode}
        />
      {:else if sidePanel === SidePanels.Evaluation}
        <EvaluationSidePanel {expressionResult} />
      {/if}
    </div>
  </div>
</DrawerContent>

<style>
  .binding-panel {
    height: 100%;
  }
  .binding-panel,
  .tabs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
  }
  .main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .side {
    flex: 0 0 360px;
    margin-right: -360px;
    transition: margin-right 130ms ease-out;
  }
  .side.visible {
    margin-right: 0;
  }

  /* Tabs */
  .tabs {
    padding: var(--spacing-m);
    border-bottom: 2px solid transparent;
  }
  .editor-tabs,
  .side-tabs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .side-tabs :global(.icon) {
    width: 16px;
    display: flex;
  }

  /* Editor */
  .editor {
    flex: 1 1 auto;
    height: 0;
  }
  .editor :global(.code-editor),
  .editor :global(.code-editor > div),
  .editor :global(.cm-editor) {
    height: 100%;
  }
  .editor :global(.cm-editor) {
    border: none;
    border-radius: 0;
  }
</style>
