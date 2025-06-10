<script lang="ts">
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Divider from "../../Divider/Divider.svelte"
  import type { EnvDropdownType } from "../../types"
  import Icon from "../../Icon/Icon.svelte"

  export let value: string | number | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let type: EnvDropdownType = "text"
  export let disabled: boolean = false
  export let id: string | undefined = undefined
  export let readonly: boolean = false
  export let updateOnChange: boolean = true
  export let align: string | undefined = undefined
  export let autofocus: boolean = false
  export let variables
  export let showModal: () => void
  export let environmentVariablesEnabled
  export let handleUpgradePanel: () => void
  const dispatch = createEventDispatcher()

  let field: HTMLInputElement
  let focus = false
  let open = false

  const STRIP_NAME_REGEX = /{{\s*env\.([^\s]+)\s*}}/g

  // Strips the name out of the value which is {{ env.Variable }} resulting in an array like ["Variable"]
  $: hbsValue = (String(value) && STRIP_NAME_REGEX.exec(String(value))) || []

  const updateValue = (newValue: any) => {
    if (readonly) {
      return
    }
    if (type === "number") {
      const float = parseFloat(newValue)
      newValue = isNaN(float) ? null : float
    }
    dispatch("change", newValue)
  }

  const onFocus = () => {
    if (readonly) {
      return
    }
    focus = true
  }

  const onBlur = (event: any) => {
    if (readonly) {
      return
    }
    focus = false
    updateValue(event.target.value)
  }

  const onInput = (event: any) => {
    if (readonly || !updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const handleOutsideClick = (event: Event) => {
    if (open) {
      event.stopPropagation()
      open = false
      focus = false
      dispatch("closed")
    }
  }

  const handleVarSelect = (variable: string) => {
    open = false
    focus = false
    updateValue(`{{ env.${variable} }}`)
  }

  onMount(() => {
    focus = autofocus
    if (focus) field.focus()
  })

  function removeVariable() {
    updateValue("")
  }

  function openPopover() {
    open = true
    focus = true
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="spectrum-InputGroup">
  <div
    class:is-disabled={disabled || hbsValue.length}
    class:is-focused={focus}
    class="spectrum-Textfield"
  >
    <div class="inline-icon">
      <Icon
        name={!hbsValue.length ? "key" : "x"}
        hoverable
        on:click={() => {
          hbsValue.length ? removeVariable() : openPopover()
        }}
      />
    </div>
    <input
      bind:this={field}
      disabled={!!hbsValue.length || disabled}
      {readonly}
      {id}
      {value}
      placeholder={placeholder || ""}
      on:click
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      type={hbsValue.length ? "text" : type}
      style={align ? `text-align: ${align};` : ""}
      class="spectrum-Textfield-input"
      inputmode={type === "number" ? "decimal" : "text"}
    />
  </div>
  {#if open}
    <div
      use:clickOutside={handleOutsideClick}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    >
      <ul class="spectrum-Menu" role="listbox">
        {#if !environmentVariablesEnabled}
          <div class="no-variables-text primary-text">
            Upgrade your plan to get environment variables
          </div>
        {:else if variables.length}
          <div style="max-height: 100px">
            {#each variables as variable}
              <li
                class="spectrum-Menu-item"
                role="option"
                aria-selected="false"
                tabindex="0"
                on:click={() => handleVarSelect(variable.name)}
              >
                <div class="spectrum-Menu-itemLabel">
                  <div class="primary-text">
                    {variable.name}
                    <span />
                  </div>
                </div>
              </li>
            {/each}
          </div>
        {:else}
          <div class="no-variables-text primary-text">
            You don't have any environment variables yet
          </div>
        {/if}
      </ul>
      <Divider noMargin />
      {#if environmentVariablesEnabled}
        <div on:click={() => showModal()} class="add-variable">
          <Icon name="plus" size="S" />
          <div class="primary-text">Add Variable</div>
        </div>
      {:else}
        <div on:click={() => handleUpgradePanel()} class="add-variable">
          <Icon name="arrow-up" size="S" />
          <div class="primary-text">Upgrade plan</div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .spectrum-Textfield {
    width: 100%;
  }

  .inline-icon {
    position: absolute;
    top: 25%;
    right: 2%;
  }

  .primary-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .spectrum-InputGroup {
    min-width: 0;
    width: 100%;
  }

  .spectrum-Popover {
    max-height: 240px;
    z-index: 999;
    top: 100%;
  }

  .spectrum-Popover.spectrum-Popover--bottom.spectrum-Picker-popover.is-open {
    width: 100%;
  }

  .no-variables-text {
    padding: var(--spacing-m);
    color: var(--spectrum-global-color-gray-600);
  }

  .add-variable {
    display: flex;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);
    align-items: center;
    gap: var(--spacing-s);
    cursor: pointer;
  }

  .add-variable:hover {
    background: var(--grey-1);
  }
</style>
