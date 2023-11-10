<script>
  import { Icon, Combobox, Drawer, Button } from "@budibase/bbui"
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "builderStore/dataBinding"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import { createEventDispatcher, setContext } from "svelte"
  import { isJSBinding } from "@budibase/string-templates"

  export let panel = ClientBindingPanel
  export let value = ""
  export let bindings = []
  export let title = "Bindings"
  export let placeholder
  export let label
  export let disabled = false
  export let options
  export let allowJS = true
  export let appendBindingsAsOptions = true
  export let error

  const dispatch = createEventDispatcher()
  let bindingDrawer
  let valid = true

  $: readableValue = runtimeToReadableBinding(bindings, value)
  $: tempValue = readableValue
  $: isJS = isJSBinding(value)
  $: allOptions = buildOptions(options, bindings, appendBindingsAsOptions)

  const handleClose = () => {
    onChange(tempValue)
    bindingDrawer.hide()
  }

  setContext("binding-drawer-actions", {
    save: handleClose,
  })

  const onChange = (value, optionPicked) => {
    // Add HBS braces if picking binding
    if (optionPicked && !options?.includes(value)) {
      value = `{{ ${value} }}`
    }

    dispatch("change", readableToRuntimeBinding(bindings, value))
  }

  const buildOptions = (options, bindings, appendBindingsAsOptions) => {
    if (!appendBindingsAsOptions) {
      return options
    }
    return []
      .concat(options || [])
      .concat(bindings?.map(binding => binding.readableBinding) || [])
  }
</script>

<div class="control" class:disabled>
  <Combobox
    {label}
    {disabled}
    readonly={isJS}
    value={isJS ? "(JavaScript function)" : readableValue}
    on:type={e => onChange(e.detail, false)}
    on:pick={e => onChange(e.detail, true)}
    on:blur={() => dispatch("blur")}
    {placeholder}
    {error}
    options={allOptions}
  />
  {#if !disabled}
    <div class="icon" on:click={bindingDrawer.show}>
      <Icon size="S" name="FlashOn" />
    </div>
  {/if}
</div>

<Drawer bind:this={bindingDrawer} {title} headless>
  <svelte:fragment slot="description">
    Add the objects on the left to enrich your text.
  </svelte:fragment>

  <Button cta slot="buttons" on:click={handleClose} disabled={!valid}>
    Save
  </Button>
  <svelte:component
    this={panel}
    slot="body"
    value={readableValue}
    close={handleClose}
    bind:valid
    on:change={event => (tempValue = event.detail)}
    {bindings}
    {allowJS}
  />
</Drawer>

<style>
  .control {
    flex: 1;
    position: relative;
  }

  .icon {
    right: 31px;
    bottom: 1px;
    position: absolute;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    border-left: 1px solid var(--spectrum-alias-border-color);
    border-right: 1px solid var(--spectrum-alias-border-color);
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m) - 2px);
  }

  .icon:hover {
    cursor: pointer;
    color: var(--spectrum-alias-text-color-hover);
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
  }

  .control:not(.disabled) :global(.spectrum-Textfield-input) {
    padding-right: 40px;
  }
</style>
