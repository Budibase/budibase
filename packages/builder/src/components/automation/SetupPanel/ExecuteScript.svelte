<script lang="ts">
  import { BindingSidePanel } from "@/components/common/bindings"
  import {
    BindingType,
    BindingHelpers,
  } from "@/components/common/bindings/utils"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    bindingsToCompletions,
    hbAutocomplete,
    EditorModes,
  } from "@/components/common/CodeEditor"
  import { CodeEditorModal } from "@/components/automation/SetupPanel"
  import { createEventDispatcher } from "svelte"
  import {
    AutomationActionStepId,
    type AutomationStep,
    type CaretPositionFn,
    type InsertAtPositionFn,
    type EnrichedBinding,
    BindingMode,
  } from "@budibase/types"

  const dispatch = createEventDispatcher()

  export let value: string | undefined
  export let isJS: boolean = true
  export let block: AutomationStep
  export let context
  export let bindings

  let getCaretPosition: CaretPositionFn | undefined
  let insertAtPos: InsertAtPositionFn | undefined

  $: codeMode =
    block.stepId === AutomationActionStepId.EXECUTE_BASH
      ? EditorModes.Handlebars
      : EditorModes.JS
  $: bindingsHelpers = new BindingHelpers(getCaretPosition, insertAtPos, {
    disableWrapping: true,
  })
  $: editingJs = codeMode === EditorModes.JS
  $: stepCompletions =
    codeMode === EditorModes.Handlebars
      ? [hbAutocomplete([...bindingsToCompletions(bindings, codeMode)])]
      : []

  const addBinding = (binding: EnrichedBinding) =>
    bindingsHelpers.onSelectBinding(value, binding, {
      js: true,
      dontDecode: true,
      type: BindingType.RUNTIME,
    })
</script>

<!-- DEPRECATED -->
<CodeEditorModal
  on:hide={() => {
    // Push any pending changes when the window closes
    dispatch("change", value)
  }}
>
  <div class:js-editor={isJS}>
    <div class:js-code={isJS} style="width:100%;height:500px;">
      <CodeEditor
        {value}
        on:change={e => {
          // need to pass without the value inside
          value = e.detail
        }}
        completions={stepCompletions}
        mode={codeMode}
        autocompleteEnabled={codeMode !== EditorModes.JS}
        bind:getCaretPosition
        bind:insertAtPos
        placeholder={codeMode === EditorModes.Handlebars
          ? "Add bindings by typing {{"
          : null}
      />
    </div>
    {#if editingJs}
      <div class="js-binding-picker">
        <BindingSidePanel
          {bindings}
          allowHelpers={false}
          {addBinding}
          mode={BindingMode.JavaScript}
          {context}
        />
      </div>
    {/if}
  </div>
</CodeEditorModal>

<style>
  .js-editor {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: 100%;
  }

  .js-code {
    flex: 7;
  }

  .js-binding-picker {
    flex: 3;
    margin-top: calc((var(--spacing-xl) * -1) + 1px);
  }
</style>
