<script>
  import { createEventDispatcher } from "svelte"
  import {
    ClientBindingPanel,
    DrawerBindableSlot,
  } from "@/components/common/bindings"
  import CodeEditorField from "@/components/common/bindings/CodeEditorField.svelte"

  export let value = ""
  export let panel = ClientBindingPanel
  export let schema = null
  export let bindings = []
  export let context = {}
  export let height = 180

  const dispatch = createEventDispatcher()
</script>

<div class="wrapper">
  <DrawerBindableSlot
    {panel}
    {schema}
    {value}
    {bindings}
    {context}
    title="Edit Code"
    type="longform"
    allowJS={true}
    allowHBS={false}
    updateOnChange={false}
    on:change={e => {
      value = e.detail
      dispatch("change", value)
    }}
  >
    <div class="code-editor-wrapper">
      <CodeEditorField
        {value}
        {bindings}
        {context}
        {height}
        allowHBS={false}
        allowJS
        placeholder={"Add bindings by typing $"}
        on:change={e => (value = e.detail)}
        on:blur={() => dispatch("change", value)}
      />
    </div>
  </DrawerBindableSlot>
</div>

<style>
  .wrapper :global(.icon.slot-icon) {
    top: 1px;
    border-radius: 0 4px 0 4px;
    border-right: 0;
    border-bottom: 1px solid var(--spectrum-alias-border-color);
  }
  .wrapper :global(.cm-editor),
  .wrapper :global(.cm-scroller) {
    border-radius: 4px;
  }
  .code-editor-wrapper {
    box-sizing: border-box;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
</style>
