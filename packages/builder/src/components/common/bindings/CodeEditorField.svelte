<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import {
    decodeJSBinding,
    encodeJSBinding,
    processObjectSync,
  } from "@budibase/string-templates"
  import { runtimeToReadableBinding } from "@/dataBinding"
  import CodeEditor, { DropdownPosition } from "../CodeEditor/CodeEditor.svelte"
  import {
    getHelperCompletions,
    jsAutocomplete,
    snippetAutoComplete,
    EditorModes,
    bindingsToCompletions,
  } from "../CodeEditor"
  import { JsonFormatter } from "@budibase/frontend-core"
  import { licensing } from "@/stores/portal"
  import { BindingMode } from "@budibase/types"
  import type {
    EnrichedBinding,
    BindingCompletion,
    Snippet,
    CaretPositionFn,
    InsertAtPositionFn,
    JSONValue,
  } from "@budibase/types"
  import type { CompletionContext } from "@codemirror/autocomplete"
  import { snippets } from "@/stores/builder"

  const dispatch = createEventDispatcher()

  export let bindings: EnrichedBinding[] = []
  export let value: string = ""
  export let allowHBS = true
  export let allowJS = false
  export let allowHelpers = true
  export let allowSnippets = true
  export let context = null
  export let autofocusEditor = false
  export let placeholder = null

  let mode: BindingMode | null
  let initialValueJS = value?.startsWith?.("{{ js ")
  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined

  // TO Switch the runtime
  $: readable = runtimeToReadableBinding(bindings, value || "")

  $: jsValue = decodeJSBinding(readable)

  $: useSnippets = allowSnippets && !$licensing.isFreePlan
  $: editorModeOptions = getModeOptions(allowHBS, allowJS)
  $: enrichedBindings = enrichBindings(bindings, context, $snippets)
  $: editorMode = EditorModes.JS
  $: bindingCompletions = bindingsToCompletions(enrichedBindings, editorMode)
  $: jsCompletions = getJSCompletions(
    bindingCompletions,
    $snippets,
    useSnippets
  )

  const getJSCompletions = (
    bindingCompletions: BindingCompletion[],
    snippets: Snippet[] | null,
    useSnippets?: boolean
  ) => {
    const completions: ((_: CompletionContext) => any)[] = [
      jsAutocomplete([
        ...bindingCompletions,
        ...(allowHelpers ? getHelperCompletions(EditorModes.JS) : []),
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
    dispatch("change", val)
  }

  const onChangeJSValue = (e: { detail: string }) => {
    // if(typeof onChange === "function"){

    // }
    if (!e.detail?.trim()) {
      // Don't bother saving empty values as JS
      updateValue(null)
    } else {
      updateValue(encodeJSBinding(e.detail))
    }
  }

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
  })
</script>

<div class="code-panel">
  <div class="editor">
    {#key jsCompletions}
      <CodeEditor
        value={jsValue}
        on:change={onChangeJSValue}
        on:blur
        completions={jsCompletions}
        mode={EditorModes.JS}
        bind:getCaretPosition
        bind:insertAtPos
        autofocus={autofocusEditor}
        placeholder={placeholder ||
          "Add bindings by typing $ or use the menu on the right"}
        jsBindingWrapping
        dropdown={DropdownPosition.Absolute}
      />
    {/key}
  </div>
</div>

<style>
  .code-panel {
    height: 100%;
    display: flex;
  }

  /* Editor */
  .editor {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
</style>
