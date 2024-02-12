<script>
  import EditComponentPopover from "../EditComponentPopover.svelte"
  import { Toggle, Icon, Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { store } from "builderStore"
  import { runtimeToReadableBinding } from "builderStore/dataBinding"
  import { isJSBinding } from "@budibase/string-templates"
  import PropertyControl from "components/design/settings/controls/PropertyControl.svelte"
  import Structure from "constants/componentStructure.json"

  export let item
  export let componentBindings
  export let bindings
  export let anchor
  export let customSchema = false
  export let removeField
  export let changeFieldType

  const dispatch = createEventDispatcher()

  $: readableText = getReadableText(item)
  $: componentDef = store.actions.components.getDefinition(item._component)

  const onToggle = item => {
    return e => {
      item.active = e.detail
      dispatch("change", { ...cloneDeep(item), active: e.detail })
    }
  }

  const getReadableText = () => {
    if (item.label) {
      return isJSBinding(item.label)
        ? "(JavaScript function)"
        : runtimeToReadableBinding([...bindings, componentBindings], item.label)
    }
    return item.field
  }

  const parseSettings = settings => {
    return settings
      .filter(setting => customSchema || setting.key !== "field")
      .map(setting => {
        return { ...setting, nested: true }
      })
  }

  const getFieldTypes = () => {
    const types = Structure.find(x => x.name === "Form")?.children || []
    return types
      .filter(type => type.endsWith("field"))
      .map(type => {
        const fullType = `@budibase/standard-components/${type}`
        const definition = store.actions.components.getDefinition(fullType)
        return {
          label: definition.name,
          value: fullType,
        }
      })
  }

  const FieldTypes = getFieldTypes()

  const handleFieldTypeChange = newType => {
    changeFieldType(item._id, newType)
  }
</script>

<div class="list-item-body">
  <div class="list-item-left">
    <EditComponentPopover
      {anchor}
      componentInstance={item}
      {componentBindings}
      {bindings}
      {parseSettings}
      on:change
    >
      <div slot="header">
        {#if customSchema}
          <div class="field-type">
            <PropertyControl
              label="Type"
              key="type"
              value={item._component}
              control={Select}
              props={{ options: FieldTypes, placeholder: null }}
              onChange={handleFieldTypeChange}
            />
          </div>
        {:else}
          <div class="type-icon">
            <Icon name={componentDef.icon} />
            <span>{item.field}</span>
          </div>
        {/if}
      </div>
    </EditComponentPopover>
    <div class="field-label">{readableText}</div>
  </div>
  <div class="list-item-right">
    {#if customSchema}
      <Icon
        size="S"
        name="Close"
        hoverable
        on:click={e => {
          e.stopPropagation()
          removeField(item._id)
        }}
      />
    {:else}
      <Toggle
        on:change={onToggle(item)}
        on:click={e => {
          e.stopPropagation()
        }}
        text=""
        value={item.active}
        thin
      />
    {/if}
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
  .list-item-right :global(div.spectrum-Switch) {
    margin: 0;
  }
  .list-item-body {
    justify-content: space-between;
  }
  .type-icon {
    display: flex;
    gap: var(--spacing-m);
    margin: var(--spacing-xl);
    margin-bottom: 0;
    height: var(--spectrum-alias-item-height-m);
    padding: 0 var(--spectrum-alias-item-padding-m);
    border-radius: var(--spectrum-alias-border-radius-regular);
    border: 1px solid
      var(
        --spectrum-actionbutton-m-border-color,
        var(--spectrum-alias-border-color)
      );
    align-items: center;
  }
  .list-item-body :global(.spectrum-Switch-switch) {
    margin-top: 0;
    margin-bottom: 0;
  }
  .list-item-body :global(.spectrum-Switch-input) {
    height: auto;
  }
  .list-item-body :global(.spectrum-Switch) {
    min-height: 0;
  }
  .list-item-body :global(.spectrum-Form-itemField) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .list-item-body {
    padding: 8px 0;
  }

  .field-type {
    padding: var(--spacing-xl);
    padding-bottom: 0;
    margin-bottom: calc(8px - var(--spacing-xl));
  }
</style>
