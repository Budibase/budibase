<script lang="ts">
  import {
    DrawerBindableSlot,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import { createEventDispatcher } from "svelte"
  import { type EnrichedBinding, FieldType } from "@budibase/types"
  import CodeEditor from "@/components/common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "@/components/common/CodeEditor"

  export let value: string
  export let context: Record<any, any> | undefined = undefined
  export let bindings: EnrichedBinding[] | undefined

  const dispatch = createEventDispatcher()
</script>

<div class="python-wrapper">
  <DrawerBindableSlot
    title={"Edit Python Code"}
    panel={AutomationBindingPanel}
    type={FieldType.LONGFORM}
    on:change={e => dispatch("change", e.detail)}
    {value}
    {bindings}
    allowJS={false}
    allowHBS={true}
    updateOnChange={false}
    {context}
    showComponent
  >
    <div class="field-wrap code-editor">
      <CodeEditor
        {value}
        mode={EditorModes.TEXT}
        placeholder={"Write your Python code here. Use {{}} for bindings."}
        on:change={e => dispatch("change", e.detail)}
        {bindings}
        autocompleteEnabled={false}
      />
    </div>
  </DrawerBindableSlot>
</div>

<style>
  .field-wrap :global(.cm-editor),
  .field-wrap :global(.cm-scroller) {
    border-radius: 4px;
  }
  .field-wrap {
    box-sizing: border-box;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  .field-wrap.code-editor {
    height: 180px;
  }

  .python-wrapper :global(.icon.slot-icon),
  .python-wrapper :global(.text-area-slot-icon) {
    right: 1px !important;
    top: 1px !important;
    border-top-right-radius: var(--spectrum-alias-border-radius-regular);
    border-bottom-left-radius: var(--spectrum-alias-border-radius-regular);
    border-right: 0px;
    border-bottom: 1px solid var(--spectrum-alias-border-color);
  }
</style>
