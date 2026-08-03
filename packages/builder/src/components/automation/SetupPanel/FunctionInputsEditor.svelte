<svelte:options runes={true} />

<script lang="ts">
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import {
    bindingsToCompletions,
    EditorModes,
    hbAutocomplete,
  } from "@/components/common/CodeEditor"
  import {
    DrawerBindableSlot,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import { Body } from "@budibase/bbui"
  import type { EnrichedBinding, JSONEditorInput } from "@budibase/types"
  import { isFunctionInputsObject } from "./functionInputs"

  interface Props {
    value?: JSONEditorInput<string>
    bindings?: EnrichedBinding[]
    context?: object
    onchange?: (value: JSONEditorInput<string>) => void
  }

  let { value, bindings = [], context, onchange = () => {} }: Props = $props()

  let error = $state("")
  let storedValue = $derived(value?.value || "{}")
  let editorValue = $derived(runtimeToReadableBinding(bindings, storedValue))
  let completions = $derived([
    hbAutocomplete(bindingsToCompletions(bindings, EditorModes.Handlebars)),
  ])

  const save = (readableValue: string) => {
    const trimmedValue = readableValue.trim() || "{}"
    if (!isFunctionInputsObject(trimmedValue)) {
      error = "Inputs must be a JSON object."
      return
    }
    error = ""
    onchange({
      value: readableToRuntimeBinding(bindings, trimmedValue),
    })
  }

  const saveDrawerValue = (event: CustomEvent<string>) => {
    const readableValue = runtimeToReadableBinding(bindings, event.detail)
    editorValue = readableValue
    save(readableValue)
  }
</script>

<div class="inputs-editor">
  <DrawerBindableSlot
    panel={AutomationBindingPanel}
    value={storedValue}
    {bindings}
    {context}
    title="Function inputs"
    type="json"
    allowJS={false}
    allowHBS
    updateOnChange={false}
    showComponent
    on:change={saveDrawerValue}
  >
    <div class:error class="editor-frame">
      <CodeEditor
        value={editorValue}
        mode={EditorModes.JSON}
        {completions}
        {bindings}
        jsBindingWrapping={false}
        aiEnabled={false}
        lineWrapping
        on:change={event => {
          editorValue = event.detail
          error = ""
        }}
        on:blur={event => save(event.detail)}
      />
    </div>
  </DrawerBindableSlot>
  {#if error}
    <Body size="S" color="var(--spectrum-global-color-red-700)">
      {error}
    </Body>
  {/if}
</div>

<style>
  .inputs-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .editor-frame {
    height: 220px;
    overflow: hidden;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-m);
  }
  .editor-frame.error {
    border-color: var(--spectrum-global-color-red-500);
  }
  .editor-frame :global(.cm-editor),
  .editor-frame :global(.cm-scroller) {
    border-radius: var(--radius-m);
  }
</style>
