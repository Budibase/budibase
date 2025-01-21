<script lang="ts">
  import {
    DrawerContent,
    ActionButton,
    Icon,
    Heading,
    Body,
    Button,
  } from "@budibase/bbui"
  import { createEventDispatcher, onMount } from "svelte"
  import {
    decodeJSBinding,
    encodeJSBinding,
    processObjectSync,
    processStringSync,
  } from "@budibase/string-templates"
  import { readableToRuntimeBinding } from "@/dataBinding"
  import CodeEditor from "../CodeEditor/CodeEditor.svelte"
  import {
    getHelperCompletions,
    jsAutocomplete,
    hbAutocomplete,
    snippetAutoComplete,
    EditorModes,
    bindingsToCompletions,
  } from "../CodeEditor"
  import BindingSidePanel from "./BindingSidePanel.svelte"
  import EvaluationSidePanel from "./EvaluationSidePanel.svelte"
  import SnippetSidePanel from "./SnippetSidePanel.svelte"
  import { BindingHelpers } from "./utils"
  import { capitalise } from "@/helpers"
  import { Utils, JsonFormatter } from "@budibase/frontend-core"
  import { licensing } from "@/stores/portal"
  import { BindingMode, SidePanel } from "@budibase/types"
  import type {
    EnrichedBinding,
    BindingCompletion,
    Snippet,
    Helper,
    CaretPositionFn,
    InsertAtPositionFn,
    JSONValue,
  } from "@budibase/types"
  import type { CompletionContext } from "@codemirror/autocomplete"

  const dispatch = createEventDispatcher()

  export let bindings: EnrichedBinding[] = []
  export let value: string = ""
  export let allowHBS = true
  export let allowJS = false
  export let allowHelpers = true
  export let allowSnippets = true
  export let context = null
  export let snippets: Snippet[] | null = null
  export let autofocusEditor = false
  export let placeholder = null
  export let showTabBar = true

  let mode: BindingMode | null
  let sidePanel: SidePanel | null
  let initialValueJS = value?.startsWith?.("{{ js ")
  let jsValue: string | null = initialValueJS ? value : null
  let hbsValue: string | null = initialValueJS ? null : value
  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined
  let targetMode: BindingMode | null = null
  let expressionResult: string | undefined
  let expressionError: string | undefined
  let evaluating = false

  $: useSnippets = allowSnippets && !$licensing.isFreePlan
  $: editorModeOptions = getModeOptions(allowHBS, allowJS)
  $: sidePanelOptions = getSidePanelOptions(
    bindings,
    context,
    allowSnippets,
    mode
  )
  $: enrichedBindings = enrichBindings(bindings, context, snippets)
  $: usingJS = mode === BindingMode.JavaScript
  $: editorMode =
    mode === BindingMode.JavaScript ? EditorModes.JS : EditorModes.Handlebars
  $: editorValue = (editorMode === EditorModes.JS ? jsValue : hbsValue) as
    | string
    | null
  $: runtimeExpression = readableToRuntimeBinding(enrichedBindings, value)
  $: requestEval(runtimeExpression, context, snippets)
  $: bindingCompletions = bindingsToCompletions(enrichedBindings, editorMode)
  $: bindingHelpers = new BindingHelpers(getCaretPosition, insertAtPos)
  $: hbsCompletions = getHBSCompletions(bindingCompletions)
  $: jsCompletions = getJSCompletions(bindingCompletions, snippets, useSnippets)
  $: {
    // Ensure a valid side panel option is always selected
    if (sidePanel && !sidePanelOptions.includes(sidePanel)) {
      sidePanel = sidePanelOptions[0]
    }
  }

  const getHBSCompletions = (bindingCompletions: BindingCompletion[]) => {
    return [
      hbAutocomplete([
        ...bindingCompletions,
        ...getHelperCompletions(EditorModes.Handlebars),
      ]),
    ]
  }

  const getJSCompletions = (
    bindingCompletions: BindingCompletion[],
    snippets: Snippet[] | null,
    useSnippets?: boolean
  ) => {
    const completions: ((_: CompletionContext) => any)[] = [
      jsAutocomplete([
        ...bindingCompletions,
        ...getHelperCompletions(EditorModes.JS),
      ]),
    ]
    if (useSnippets && snippets) {
      completions.push(snippetAutoComplete(snippets))
    }
    return completions
  }

  const getModeOptions = (allowHBS: boolean, allowJS: boolean) => {
    let options = []
    if (allowHBS) {
      options.push(BindingMode.Text)
    }
    if (allowJS) {
      options.push(BindingMode.JavaScript)
    }
    return options
  }

  const getSidePanelOptions = (
    bindings: EnrichedBinding[],
    context: any,
    useSnippets: boolean,
    mode: BindingMode | null
  ) => {
    let options = []
    if (bindings?.length) {
      options.push(SidePanel.Bindings)
    }
    if (context && Object.keys(context).length > 0) {
      options.push(SidePanel.Evaluation)
    }
    if (useSnippets && mode === BindingMode.JavaScript) {
      options.push(SidePanel.Snippets)
    }
    return options
  }

  const debouncedEval = Utils.debounce(
    (expression: string | null, context: any, snippets: Snippet[]) => {
      try {
        expressionError = undefined
        expressionResult = processStringSync(
          expression || "",
          {
            ...context,
            snippets,
          },
          {
            noThrow: false,
          }
        )
      } catch (err: any) {
        expressionResult = undefined
        expressionError = err
      }
      evaluating = false
    },
    260
  )

  const requestEval = (
    expression: string | null,
    context: any,
    snippets: Snippet[] | null
  ) => {
    evaluating = true
    debouncedEval(expression, context, snippets)
  }

  const highlightJSON = (json: JSONValue) => {
    return JsonFormatter.format(json, {
      keyColor: "#e06c75",
      numberColor: "#e5c07b",
      stringColor: "#98c379",
      trueColor: "#d19a66",
      falseColor: "#d19a66",
      nullColor: "#c678dd",
    })
  }

  const enrichBindings = (
    bindings: EnrichedBinding[],
    context: any,
    snippets: Snippet[] | null
  ) => {
    // Create a single big array to enrich in one go
    const bindingStrings = bindings.map(binding => {
      if (binding.runtimeBinding.startsWith('trim "')) {
        // Account for nasty hardcoded HBS bindings for roles, for legacy
        // compatibility
        return `{{ ${binding.runtimeBinding} }}`
      } else {
        return `{{ literal ${binding.runtimeBinding} }}`
      }
    })
    const bindingEvaluations = processObjectSync(bindingStrings, {
      ...context,
      snippets,
    })

    // Enrich bindings with evaluations and highlighted HTML
    return bindings.map((binding, idx) => {
      if (!context || typeof bindingEvaluations !== "object") {
        return binding
      }
      const evalObj: Record<any, any> = bindingEvaluations
      const value = JSON.stringify(evalObj[idx], null, 2)
      return {
        ...binding,
        value,
        valueHTML: highlightJSON(value),
      }
    })
  }

  const updateValue = (val: any) => {
    const runtimeExpression = readableToRuntimeBinding(enrichedBindings, val)
    dispatch("change", val)
    requestEval(runtimeExpression, context, snippets)
  }

  const onSelectHelper = (helper: Helper, js?: boolean) => {
    bindingHelpers.onSelectHelper(js ? jsValue : hbsValue, helper, {
      js,
      dontDecode: undefined,
    })
  }

  const onSelectBinding = (
    binding: EnrichedBinding,
    { forceJS }: { forceJS?: boolean } = {}
  ) => {
    const js = usingJS || forceJS
    bindingHelpers.onSelectBinding(js ? jsValue : hbsValue, binding, {
      js,
      dontDecode: undefined,
    })
  }

  const changeMode = (newMode: BindingMode) => {
    if (targetMode || newMode === mode) {
      return
    }

    // Get the raw editor value to see if we are abandoning changes
    let rawValue = editorValue
    if (mode === BindingMode.JavaScript && rawValue) {
      rawValue = decodeJSBinding(rawValue)
    }

    if (rawValue?.length) {
      targetMode = newMode
    } else {
      mode = newMode
    }
  }

  const confirmChangeMode = () => {
    jsValue = null
    hbsValue = null
    updateValue(null)
    mode = targetMode
    targetMode = null
  }

  const changeSidePanel = (newSidePanel: SidePanel) => {
    sidePanel = newSidePanel === sidePanel ? null : newSidePanel
  }

  const onChangeHBSValue = (e: { detail: string }) => {
    hbsValue = e.detail
    updateValue(hbsValue)
  }

  const onChangeJSValue = (e: { detail: string }) => {
    jsValue = encodeJSBinding(e.detail)
    if (!e.detail?.trim()) {
      // Don't bother saving empty values as JS
      updateValue(null)
    } else {
      updateValue(jsValue)
    }
  }

  const addSnippet = (snippet: Snippet) =>
    bindingHelpers.onSelectSnippet(snippet)

  onMount(() => {
    // Set the initial mode appropriately
    const initialValueMode = initialValueJS
      ? BindingMode.JavaScript
      : BindingMode.Text
    if (editorModeOptions.includes(initialValueMode)) {
      mode = initialValueMode
    } else {
      mode = editorModeOptions[0]
    }

    // Set the initial side panel
    sidePanel = sidePanelOptions[0]
  })
</script>

<DrawerContent padding={false}>
  <div class="binding-panel">
    <div class="main">
      {#if showTabBar}
        <div class="tabs">
          <div class="editor-tabs">
            {#each editorModeOptions as editorMode}
              <ActionButton
                size="M"
                quiet
                selected={mode === editorMode}
                on:click={() => changeMode(editorMode)}
              >
                {capitalise(editorMode)}
              </ActionButton>
            {/each}
          </div>
          <div class="side-tabs">
            {#each sidePanelOptions as panel}
              <ActionButton
                size="M"
                quiet
                selected={sidePanel === panel}
                on:click={() => changeSidePanel(panel)}
              >
                <Icon name={panel} size="S" />
              </ActionButton>
            {/each}
          </div>
        </div>
      {/if}
      <div class="editor">
        {#if mode === BindingMode.Text}
          {#key hbsCompletions}
            <CodeEditor
              value={hbsValue}
              on:change={onChangeHBSValue}
              bind:getCaretPosition
              bind:insertAtPos
              completions={hbsCompletions}
              autofocus={autofocusEditor}
              placeholder={placeholder ||
                "Add bindings by typing {{ or use the menu on the right"}
              jsBindingWrapping={false}
            />
          {/key}
        {:else if mode === BindingMode.JavaScript}
          {#key jsCompletions}
            <CodeEditor
              value={jsValue ? decodeJSBinding(jsValue) : jsValue}
              on:change={onChangeJSValue}
              completions={jsCompletions}
              mode={EditorModes.JS}
              bind:getCaretPosition
              bind:insertAtPos
              autofocus={autofocusEditor}
              placeholder={placeholder ||
                "Add bindings by typing $ or use the menu on the right"}
              jsBindingWrapping
            />
          {/key}
        {/if}
        {#if targetMode}
          <div class="mode-overlay">
            <div class="prompt-body">
              <Heading size="S">
                Switch to {targetMode}?
              </Heading>
              <Body>This will discard anything in your binding</Body>
              <div class="switch-actions">
                <Button
                  secondary
                  size="S"
                  on:click={() => {
                    targetMode = null
                  }}
                >
                  No - keep {mode}
                </Button>
                <Button cta size="S" on:click={confirmChangeMode}>
                  Yes - discard {mode}
                </Button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
    <div class="side" class:visible={!!sidePanel}>
      {#if sidePanel === SidePanel.Bindings}
        <BindingSidePanel
          bindings={enrichedBindings}
          {allowHelpers}
          {context}
          addHelper={onSelectHelper}
          addBinding={onSelectBinding}
          mode={editorMode}
        />
      {:else if sidePanel === SidePanel.Evaluation}
        <EvaluationSidePanel
          {expressionResult}
          {expressionError}
          {evaluating}
          expression={editorValue ? editorValue : ""}
        />
      {:else if sidePanel === SidePanel.Snippets}
        <SnippetSidePanel {addSnippet} {snippets} />
      {/if}
    </div>
  </div>
</DrawerContent>

<style>
  .binding-panel {
    height: 100%;
    overflow: hidden;
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
    overflow: hidden;
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
    border-bottom: var(--border-light);
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
    position: relative;
  }

  /* Overlay */
  .mode-overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border-radius: var(--border-radius-s);
  }
  .prompt-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-l);
  }
  .prompt-body .switch-actions {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
