<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Icon } from "@budibase/bbui"
  import { runtimeToReadableBinding } from "builder/dataBinding"
  import { isJSBinding } from "@budibase/string-templates"

  export let item
  export let componentBindings
  export let bindings
  export let anchor
  export let removeButton
  export let canRemove

  $: readableText = isJSBinding(item.text)
    ? "(JavaScript function)"
    : runtimeToReadableBinding([...bindings, componentBindings], item.text)
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {componentBindings}
      {bindings}
      on:change
    />
    <div class="field-label">{readableText || "Button"}</div>
  </div>
  <div class="list-item-right">
    <Icon
      disabled={!canRemove}
      size="S"
      name="Close"
      hoverable
      on:click={() => removeButton(item._id)}
    />
  </div>
</div>

<style>
  .field-label {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .list-item-body,
  .list-item-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
    min-width: 0;
  }
  .list-item-body {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .list-item-right :global(div.spectrum-Switch) {
    margin: 0px;
  }
  .list-item-body {
    justify-content: space-between;
  }
</style>
