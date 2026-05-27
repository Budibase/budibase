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
    type: string
    icon?: string
  }

  export let value: ValidationEditorRule[] = []
  export let bindings: EnrichedBinding[] = []
  export let componentInstance: FieldComponent | undefined = undefined
  export let type: string | undefined = undefined
  const dispatch = createEventDispatcher<{ change: ValidationEditorRule[] }>()
  let drawer: DrawerHandle
  let drawerContentKey: number = 0
  let workingValue: ValidationEditorRule[] = []

  $: active = getActive(value)

  $: text = getText(value)

  $: fieldType = type?.split("/")[1]

  $: fieldDefinition = getFieldDefinition(fieldType)

  const sanitiseRules = (
    rules: ValidationEditorRule[]
  ): ValidationEditorRule[] => {
    return (rules || []).map(rule => {
      const sanitisedRule = { ...rule }
      if (sanitisedRule.constraint === "required") {
        delete sanitisedRule.value
        delete sanitisedRule.valueType
      }
      if (!sanitisedRule.error) {
        delete sanitisedRule.error
      }
      return sanitisedRule
    })
  }

  const handleShow = (): void => {
    workingValue = cloneDeep(value || [])
    drawerContentKey += 1
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

<Drawer
  bind:this={drawer}
  forceModal
  on:drawerHide
  on:drawerShow
  on:drawerShow={handleShow}
>
  <svelte:fragment slot="title">
    <div class="drawer-title">
      <Heading size="S" noPadding>Validation Rules</Heading>
      {#if componentInstance?.field}
        <div class="field-context">
          {#if fieldDefinition?.icon}
            <Icon name={fieldDefinition.icon} size="S" />
          {/if}
          <span>{componentInstance.field}</span>
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
    align-items: center;
    gap: var(--spacing-s);
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
  .field-context span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
