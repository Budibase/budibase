<script>
  import {
    Combobox,
    DatePicker,
    Input,
    Multiselect,
    Icon,
    Drawer,
    Button,
  } from "@budibase/bbui"

  import FilterUsers from "./FilterUsers.svelte"
  import { FieldType, ArrayOperator } from "@budibase/types"
  import * as Constants from "../constants"
  import { isJSBinding, findHBSBlocks } from "@budibase/string-templates"
  import { createEventDispatcher } from "svelte"

  export let filter
  export let disabled = false
  export let bindings = []
  export let allowBindings = false
  export let schemaFields
  export let panel
  export let drawerTitle
  export let toReadable
  export let toRuntime

  const dispatch = createEventDispatcher()
  const { OperatorOptions, FilterValueType } = Constants

  let bindingDrawer

  $: fieldValue = filter?.value
  $: readableValue = toReadable ? toReadable(bindings, fieldValue) : fieldValue
  $: drawerValue = toDrawerValue(fieldValue)
  $: isJS = isJSBinding(fieldValue)
  $: fieldIsValid = isValid(fieldValue)

  const getFieldOptions = field => {
    const schema = schemaFields.find(x => x.name === field)
    return schema?.constraints?.inclusion || []
  }

  const getSchema = filter => {
    return schemaFields.find(field => field.name === filter.field)
  }

  const drawerOnChange = e => {
    drawerValue = e.detail
  }

  const onChange = e => {
    fieldValue = e.detail
    dispatch("change", {
      value: toRuntime ? toRuntime(bindings, fieldValue) : fieldValue,
    })
  }

  const onConfirmBinding = () => {
    dispatch("change", {
      value: toRuntime ? toRuntime(bindings, drawerValue) : drawerValue,
      valueType: drawerValue ? FilterValueType.BINDING : FilterValueType.VALUE,
    })
  }

  const isValidDate = value => {
    return !value || !isNaN(new Date(value).valueOf())
  }

  const hasValidOptions = value => {
    let links = []
    if (Array.isArray(value)) {
      links = value
    } else if (value && typeof value === "string") {
      links = value.split(",")
    } else {
      return !value
    }
    return links.every(link =>
      getSchema(filter)?.constraints?.inclusion?.includes(link)
    )
  }

  const isValidBoolean = value => {
    return value === "false" || value === "true" || value == ""
  }

  const hasValidLinks = value => {
    let links = []
    if (Array.isArray(value)) {
      links = value
    } else if (value && typeof value === "string") {
      links = value.split(",")
    } else {
      return !value
    }

    return links.every(link => link.startsWith("ro_"))
  }

  const validationMap = {
    date: isValidDate,
    datetime: isValidDate,
    bb_reference: hasValidLinks,
    bb_reference_single: hasValidLinks,
    array: hasValidOptions,
    longform: value => !isJSBinding(value),
    options: value => !isJSBinding(value) && !findHBSBlocks(value)?.length,
    boolean: isValidBoolean,
  }

  const isValid = value => {
    const validate = validationMap[filter.type]
    return validate ? validate(value) : true
  }

  /**
   * Converts arrays into strings. The CodeEditor expects a string or encoded JS
   * FilterValueType.VALUE values are emptied when first loaded in the binding drawer.
   *
   * @param{string} fieldValue
   */
  const toDrawerValue = fieldValue => {
    if (filter.valueType == FilterValueType.VALUE) {
      return ""
    }
    return Array.isArray(fieldValue) ? fieldValue.join(",") : readableValue
  }
</script>

<div>
  <Drawer
    on:drawerHide
    on:drawerShow
    bind:this={bindingDrawer}
    title={drawerTitle || filter.field}
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

  <div
    class="field-wrap"
    class:bindings={allowBindings}
    class:valid={fieldIsValid}
  >
    <div class="field">
      {#if filter.valueType === FilterValueType.BINDING}
        <Input
          disabled={filter.noValue}
          readonly={isJS}
          value={isJS ? "(JavaScript function)" : readableValue}
          on:change={onChange}
        />
      {:else}
        <div>
          {#if [FieldType.STRING, FieldType.LONGFORM, FieldType.NUMBER, FieldType.BIGINT, FieldType.FORMULA, FieldType.AI].includes(filter.type)}
            <Input
              disabled={filter.noValue}
              value={readableValue}
              on:change={onChange}
            />
          {:else if filter.type === FieldType.ARRAY || (filter.type === FieldType.OPTIONS && filter.operator === ArrayOperator.ONE_OF)}
            <Multiselect
              disabled={filter.noValue}
              options={getFieldOptions(filter.field)}
              value={readableValue}
              on:change={onChange}
            />
          {:else if filter.type === FieldType.OPTIONS}
            <Combobox
              disabled={filter.noValue}
              options={getFieldOptions(filter.field)}
              value={readableValue}
              on:change={onChange}
            />
          {:else if filter.type === FieldType.BOOLEAN}
            <Combobox
              disabled={filter.noValue}
              options={[
                { label: "True", value: "true" },
                { label: "False", value: "false" },
              ]}
              value={readableValue}
              on:change={onChange}
            />
          {:else if filter.type === FieldType.DATETIME}
            <DatePicker
              disabled={filter.noValue}
              enableTime={!getSchema(filter)?.dateOnly}
              timeOnly={getSchema(filter)?.timeOnly}
              value={readableValue}
              on:change={onChange}
            />
          {:else if [FieldType.BB_REFERENCE, FieldType.BB_REFERENCE_SINGLE].includes(filter.type)}
            <FilterUsers
              multiselect={[
                OperatorOptions.In.value,
                OperatorOptions.ContainsAny.value,
              ].includes(filter.operator)}
              disabled={filter.noValue}
              value={readableValue}
              on:change={onChange}
            />
          {:else}
            <Input disabled />
          {/if}
        </div>
      {/if}
    </div>

    <div class="binding-control">
      <!-- needs field, operator -->
      {#if !disabled && allowBindings && !filter.noValue}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="icon"
          class:binding={filter.valueType === "Binding"}
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
