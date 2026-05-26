<script lang="ts">
  import { Button, ActionButton, Drawer, Heading, Icon } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import type { Component, EnrichedBinding } from "@budibase/types"
  import { FIELDS } from "@/constants/backend"
  import ValidationDrawer from "./ValidationDrawer.svelte"
  import type { ValidationEditorRule } from "./types"

  interface FieldComponent extends Component {
    field?: string
  }

  interface DrawerHandle {
    show: () => void
    hide: () => void
  }

  interface FieldDefinition {
    name?: string
    type: string
    icon?: string
  }

  export let value: ValidationEditorRule[] = []
  export let bindings: EnrichedBinding[] = []
  export let componentInstance: FieldComponent | undefined = undefined
  export let type: string | undefined = undefined
  const dispatch = createEventDispatcher<{
    change: ValidationEditorRule[]
    drawerShow: unknown
  }>()
  let drawer: DrawerHandle
  let drawerContentKey: number = 0
  let workingValue: ValidationEditorRule[] = []

  $: active = getActive(value)

  $: text = getText(value)

  $: fieldType = type?.split("/")[1]

  $: fieldDefinition = getFieldDefinition(fieldType)

  $: fieldTypeLabel = fieldDefinition?.name || fieldType

  const sanitiseRules = (
    rules: ValidationEditorRule[]
  ): ValidationEditorRule[] => {
    return (rules || []).map(rule => {
      const sanitisedRule = { ...rule }
      if (["required", "url"].includes(sanitisedRule.constraint || "")) {
        delete sanitisedRule.value
        delete sanitisedRule.valueType
      }
      if (!sanitisedRule.error) {
        delete sanitisedRule.error
      }
      return sanitisedRule
    })
  }

  const handleShow = (event: CustomEvent<unknown>): void => {
    workingValue = cloneDeep(value || [])
    drawerContentKey += 1
    dispatch("drawerShow", event.detail)
  }

  const getFieldDefinition = (
    fieldType: string | undefined
  ): FieldDefinition | undefined => {
    return Object.values(FIELDS as Record<string, FieldDefinition>).find(
      field => field.type === fieldType
    )
  }

  const save = (): void => {
    dispatch("change", sanitiseRules(workingValue))
    drawer.hide()
  }

  const getActive = (rules: ValidationEditorRule[]): boolean => {
    if (!rules?.length) {
      return false
    } else {
      return true
    }
  }

  const getText = (rules: ValidationEditorRule[]): string => {
    if (!rules?.length) {
      return "No rules set"
    } else {
      return `${rules.length} rule${rules.length === 1 ? "" : "s"} set`
    }
  }
</script>

<div class="validation-editor">
  <ActionButton {active} on:click={drawer.show}>{text}</ActionButton>
</div>

<Drawer bind:this={drawer} forceModal on:drawerHide on:drawerShow={handleShow}>
  <svelte:fragment slot="title">
    <div class="drawer-title">
      <Heading size="S" noPadding>Validation Rules</Heading>
      {#if componentInstance?.field}
        <div class="field-context">
          {#if fieldDefinition?.icon}
            <Icon name={fieldDefinition.icon} size="S" />
          {/if}
          <span class="field-context__name">{componentInstance.field}</span>
          {#if fieldTypeLabel}
            <span class="field-context__type">{fieldTypeLabel}</span>
          {/if}
        </div>
      {/if}
    </div>
  </svelte:fragment>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <svelte:fragment slot="body">
    {#key drawerContentKey}
      <ValidationDrawer
        bind:rules={workingValue}
        {type}
        {bindings}
        fieldName={componentInstance?.field}
      />
    {/key}
  </svelte:fragment>
</Drawer>

<style>
  .validation-editor :global(.spectrum-ActionButton) {
    width: 100%;
  }
  .drawer-title {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
    min-width: 0;
  }
  .field-context {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-width: 0;
    color: var(--spectrum-global-color-gray-700);
    font-size: 13px;
  }
  .field-context__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .field-context__type {
    color: var(--spectrum-global-color-gray-600);
  }
  .field-context__type::before {
    content: "·";
    margin-right: var(--spacing-xs);
  }
</style>
