<script>
  import { Input, Icon, Drawer, Button } from "@budibase/bbui"
  import { isJSBinding } from "@budibase/string-templates"
  import { createEventDispatcher } from "svelte"

  export let filter
  export let disabled = false
  export let bindings = []
  export let panel
  export let drawerTitle
  export let toReadable
  export let toRuntime

  const dispatch = createEventDispatcher()

  let bindingDrawer
  let fieldValue

  $: fieldValue = filter?.field
  $: readableValue = toReadable ? toReadable(bindings, fieldValue) : fieldValue
  $: drawerValue = toDrawerValue(fieldValue)
  $: isJS = isJSBinding(fieldValue)

  const drawerOnChange = e => {
    drawerValue = e.detail
  }

  const onChange = e => {
    fieldValue = e.detail
    dispatch("change", {
      field: toRuntime ? toRuntime(bindings, fieldValue) : fieldValue,
    })
  }

  const onConfirmBinding = () => {
    dispatch("change", {
      field: toRuntime ? toRuntime(bindings, drawerValue) : drawerValue,
    })
  }

  /**
   * Converts arrays into strings. The CodeEditor expects a string or encoded JS
   *
   * @param{string} fieldValue
   */
  const toDrawerValue = fieldValue => {
    return Array.isArray(fieldValue) ? fieldValue.join(",") : readableValue
  }
</script>

<div>
  <Drawer
    on:drawerHide
    on:drawerShow
    bind:this={bindingDrawer}
    title={drawerTitle || ""}
    forceModal
  >
    <Button
      cta
      slot="buttons"
      on:click={() => {
        onConfirmBinding()
        bindingDrawer.hide()
      }}
    >
      Confirm
    </Button>

    <svelte:component
      this={panel}
      slot="body"
      value={drawerValue}
      allowJS
      allowHelpers
      allowHBS
      on:change={drawerOnChange}
      {bindings}
    />
  </Drawer>

  <div class="field-wrap" class:bindings={true}>
    <div class="field">
      <Input
        disabled={filter.noValue}
        readonly={isJS}
        value={isJS ? "(JavaScript function)" : readableValue}
        on:change={onChange}
      />
    </div>

    <div class="binding-control">
      {#if !disabled}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="icon binding"
          on:click={() => {
            bindingDrawer.show()
          }}
        >
          <Icon size="S" name="FlashOn" />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .field-wrap {
    display: flex;
  }
  .field {
    flex: 1;
  }

  .field-wrap.bindings .field :global(.spectrum-Form-itemField),
  .field-wrap.bindings .field :global(input),
  .field-wrap.bindings .field :global(.spectrum-Picker) {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .field-wrap.bindings
    .field
    :global(.spectrum-InputGroup.spectrum-Datepicker) {
    min-width: unset;
    border-radius: 0px;
  }

  .field-wrap.bindings
    .field
    :global(
      .spectrum-InputGroup.spectrum-Datepicker
        .spectrum-Textfield-input.spectrum-InputGroup-input
    ) {
    width: 100%;
  }

  .binding-control .icon {
    border: 1px solid
      var(
        --spectrum-textfield-m-border-color,
        var(--spectrum-alias-border-color)
      );
    border-left: 0px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    width: 31px;
    color: var(--spectrum-alias-text-color);
    background-color: var(--spectrum-global-color-gray-75);
    transition: background-color
        var(--spectrum-global-animation-duration-100, 130ms),
      box-shadow var(--spectrum-global-animation-duration-100, 130ms),
      border-color var(--spectrum-global-animation-duration-100, 130ms);
    height: calc(var(--spectrum-alias-item-height-m));
  }
  .binding-control .icon.binding {
    color: var(--yellow);
  }

  .binding-control .icon:hover {
    cursor: pointer;
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-alias-border-color-hover);
    color: var(--spectrum-alias-text-color-hover);
  }

  .binding-control .icon.binding:hover {
    color: var(--yellow);
  }
</style>
