<script>
  import {
    Icon,
    ActionButton,
    Input,
    Label,
    Toggle,
    Select,
    ActionMenu,
    MenuItem,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { lowercase } from "@/helpers"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"

  let dispatch = createEventDispatcher()

  export let defaults
  export let object = defaults || {}
  export let activity = {}
  export let readOnly
  export let noAddButton
  export let name
  export let headings = false
  export let options
  export let toggle
  export let keyPlaceholder = "Key"
  export let valuePlaceholder = "Value"
  export let valueHeading
  export let keyHeading
  export let tooltip
  export let menuItems
  export let showMenu = false
  export let bindings = []
  export let bindingDrawerLeft
  export let allowHelpers = true
  export let customButtonText = null
  export let keyBindings = false
  export let allowJS = false
  export let actionButtonDisabled = false
  export let compare = (option, value) => option === value

  let fields = Object.entries(object || {}).map(([name, value]) => ({
    name,
    value,
  }))
  let fieldActivity = buildFieldActivity(activity)

  $: object = fields.reduce(
    (acc, next) => ({ ...acc, [next.name]: next.value }),
    {}
  )

  function buildFieldActivity(obj) {
    if (!obj || typeof obj !== "object") {
      return []
    }
    const array = Array(fields.length)
    for (let [key, value] of Object.entries(obj)) {
      const field = fields.find(el => el.name === key)
      const idx = fields.indexOf(field)
      array[idx] = idx !== -1 ? value : true
    }
    return array
  }

  export function addEntry() {
    fields = [...fields, { name: "", value: "" }]
    fieldActivity = [...fieldActivity, true]
    changed()
  }

  function deleteEntry(idx) {
    fields.splice(idx, 1)
    fieldActivity.splice(idx, 1)
    changed()
  }

  function changed() {
    fields = fields
    const newActivity = {}
    for (let idx = 0; idx < fields.length; idx++) {
      const fieldName = fields[idx].name
      if (fieldName) {
        newActivity[fieldName] = fieldActivity[idx]
      }
    }
    activity = newActivity
    dispatch("change", fields)
  }

  function isJsonArray(value) {
    if (!value || typeof value === "string") {
      return false
    }
    if (value.type === "array") {
      return true
    }
    return value.type === "json" && value.subtype === "array"
  }
</script>

<!-- Builds Objects with Key Value Pairs. Useful for building things like Request Headers. -->
{#if Object.keys(object || {}).length > 0}
  {#if headings}
    <div class="container" class:container-active={toggle}>
      <Label {tooltip}>{keyHeading || keyPlaceholder}</Label>
      <Label>{valueHeading || valuePlaceholder}</Label>
      {#if toggle}
        <Label>Active</Label>
      {/if}
    </div>
  {/if}
  <div
    class="container"
    class:container-active={toggle}
    class:container-menu={showMenu}
    class:readOnly
    class:readOnly-menu={readOnly && showMenu}
  >
    {#each fields as field, idx}
      {#if keyBindings}
        <DrawerBindableInput
          {bindings}
          placeholder={keyPlaceholder}
          on:blur={e => {
            field.name = e.detail
            changed()
          }}
          disabled={readOnly}
          value={field.name}
          {allowJS}
          {allowHelpers}
          drawerLeft={bindingDrawerLeft}
        />
      {:else}
        <Input readonly={readOnly} bind:value={field.name} on:blur={changed} />
      {/if}
      {#if isJsonArray(field.value)}
        <Select readonly={true} value="Array" options={["Array"]} />
      {:else if options}
        <Select
          bind:value={field.value}
          {compare}
          on:change={changed}
          {options}
        />
      {:else if bindings && bindings.length}
        <DrawerBindableInput
          {bindings}
          placeholder={valuePlaceholder}
          on:blur={e => {
            field.value = e.detail
            changed()
          }}
          disabled={readOnly}
          value={field.value}
          {allowJS}
          {allowHelpers}
          drawerLeft={bindingDrawerLeft}
        />
      {:else}
        <Input
          placeholder={valuePlaceholder}
          readonly={readOnly}
          bind:value={field.value}
          on:blur={changed}
        />
      {/if}
      {#if toggle}
        <Toggle bind:value={fieldActivity[idx]} on:change={changed} />
      {/if}
      {#if !readOnly}
        <Icon hoverable name="Close" on:click={() => deleteEntry(idx)} />
      {/if}
      {#if menuItems?.length > 0 && showMenu}
        <ActionMenu>
          <div slot="control" class="control icon">
            <Icon size="S" hoverable name="MoreSmallList" />
          </div>
          {#each menuItems as item}
            <MenuItem on:click={() => item.onClick(field)}>
              {item.text}
            </MenuItem>
          {/each}
        </ActionMenu>
      {/if}
    {/each}
  </div>
{/if}
{#if !readOnly && !noAddButton}
  <div>
    <ActionButton
      disabled={actionButtonDisabled}
      icon="Add"
      secondary
      thin
      outline
      on:click={addEntry}
    >
      {#if customButtonText}
        {customButtonText}
      {:else}
        {`Add${name ? ` ${lowercase(name)}` : ""}`}
      {/if}
    </ActionButton>
  </div>
{/if}

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr 20px;
    grid-gap: var(--spacing-m);
    align-items: center;
    margin-bottom: var(--spacing-m);
  }
  .container-active {
    grid-template-columns: 1fr 1fr 50px 20px;
  }
  .container-menu {
    grid-template-columns: 1fr 1fr 20px 20px;
  }
  .readOnly {
    grid-template-columns: 1fr 1fr;
  }
  .readOnly-menu {
    grid-template-columns: 1fr 1fr 20px;
  }
  .control {
    margin-top: 4px;
  }
</style>
