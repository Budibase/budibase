<script>
  import { runtimeToReadableBinding } from "@/dataBinding"
  import EditNavItemPopover from "./EditNavItemPopover.svelte"
  import { Icon } from "@budibase/bbui"

  export let item
  export let removeNavItem
  export let anchor
  export let bindings

  $: text = runtimeToReadableBinding(bindings, item.text)
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditNavItemPopover {anchor} {bindings} navItem={item} on:change />
    <div class="field-label">{text}</div>
  </div>
  <div class="list-item-right">
    <Icon
      size="S"
      name="Close"
      hoverable
      on:click={e => {
        e.stopPropagation()
        removeNavItem(item.id)
      }}
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
