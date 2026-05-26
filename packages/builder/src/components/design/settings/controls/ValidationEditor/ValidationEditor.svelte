<script lang="ts">
  import { Button, ActionButton, Drawer, Heading } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import type { Component, EnrichedBinding } from "@budibase/types"
  import ValidationDrawer from "./ValidationDrawer.svelte"
  import type { ValidationEditorRule } from "./types"

  interface FieldComponent extends Component {
    field?: string
  }

  interface DrawerHandle {
    show: () => void
    hide: () => void
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

  const handleShow = (): void => {
    workingValue = JSON.parse(JSON.stringify(value || []))
    drawerContentKey += 1
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
    <Heading size="S" noPadding>Validation Rules</Heading>
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
</style>
