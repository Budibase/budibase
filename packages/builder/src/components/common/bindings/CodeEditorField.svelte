<script lang="ts">
  import { createEventDispatcher } from "svelte"
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
    jsHelperAutocomplete,
  } from "../CodeEditor"
  import { JsonFormatter } from "@budibase/frontend-core"
  import { licensing } from "@/stores/portal"
  import type {
    EnrichedBinding,
    Snippet,
    CaretPositionFn,
    InsertAtPositionFn,
    JSONValue,
  } from "@budibase/types"
  import type { BindingCompletion, BindingCompletionOption } from "@/types"
  import { snippets } from "@/stores/builder"

  const dispatch = createEventDispatcher()

  export let bindings: EnrichedBinding[] = []
  export let value: string = ""
  export let allowHelpers = true
  export let allowSnippets = true
  export let context = null
  export let autofocusEditor = false
  export let placeholder = null
  export let height = 180

  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined

  $: readable = runtimeToReadableBinding(bindings, value || "")
  $: jsValue = decodeJSBinding(readable)

  $: useSnippets = allowSnippets && !$licensing.isFreePlan
  $: enrichedBindings = enrichBindings(bindings, context, $snippets)
  $: editorMode = EditorModes.JS
  $: bindingCompletions = bindingsToCompletions(enrichedBindings, editorMode)
  $: jsCompletions = getJSCompletions(bindingCompletions, $snippets, {
    useHelpers: allowHelpers,
    useSnippets,
  })

  const getJSCompletions = (
    bindingCompletions: BindingCompletionOption[],
    snippets: Snippet[] | null,
    config: {
      useHelpers: boolean
      useSnippets: boolean
    }
  ) => {
    const completions: BindingCompletion[] = []
    if (bindingCompletions.length) {
      completions.push(jsAutocomplete([...bindingCompletions]))
    }
    if (config.useHelpers) {
      completions.push(
        jsHelperAutocomplete([...getHelperCompletions(EditorModes.JS)])
      )
    }
    if (config.useSnippets && snippets) {
      completions.push(snippetAutoComplete(snippets))
    }
    return completions
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
    if (!e.detail?.trim()) {
      // Don't bother saving empty values as JS
      updateValue(null)
    } else {
      updateValue(encodeJSBinding(e.detail))
    }
  }
</script>

<div class="code-panel" style="height:{height}px;">
  <div class="editor">
    {#key jsCompletions}
      <CodeEditor
        value={jsValue || ""}
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
