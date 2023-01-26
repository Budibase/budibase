<script>
  import "@spectrum-css/textfield/dist/index-vars.css"
  import { createEventDispatcher, onMount } from "svelte"
  import clickOutside from "../../Actions/click_outside"
  import Divider from "../../Divider/Divider.svelte"
  import Tag from "../../Tags/Tag.svelte"
  import Tags from "../../Tags/Tags.svelte"

  export let value = null
  export let placeholder = null
  export let type = "text"
  export let disabled = false
  export let id = null
  export let readonly = false
  export let updateOnChange = true
  export let dataCy
  export let align
  export let autofocus = false
  export let variables
  export let showModal
  export let environmentVariablesEnabled
  export let handleUpgradePanel
  const dispatch = createEventDispatcher()

  let field
  let focus = false
  let iconFocused = false
  let open = false

  //eslint-disable-next-line
  const STRIP_NAME_REGEX = /(?<=\.)(.*?)(?=\ })/g

  // Strips the name out of the value which is {{ env.Variable }} resulting in an array like ["Variable"]
  $: tags = String(value)?.match(STRIP_NAME_REGEX) || []

  const updateValue = newValue => {
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

  const onBlur = event => {
    if (readonly) {
      return
    }
    focus = false
    updateValue(event.target.value)
  }

  const onInput = event => {
    if (readonly || !updateOnChange) {
      return
    }
    updateValue(event.target.value)
  }

  const handleOutsideClick = event => {
    if (open) {
      event.stopPropagation()
      open = false
      focus = false
      iconFocused = false
      dispatch("closed")
    }
  }

  const handleVarSelect = variable => {
    open = false
    focus = false
    iconFocused = false
    updateValue(`{{ env.${variable} }}`)
  }

  onMount(() => {
    focus = autofocus
    if (focus) field.focus()
  })
</script>

<div class="spectrum-InputGroup">
  <div class:is-focused={focus} class="spectrum-Textfield ">
    <svg
      class:focused={iconFocused}
      class="hoverable icon-position spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-validationIcon"
      focusable="false"
      aria-hidden="true"
      on:click={() => {
        open = true
        focus = true
        iconFocused = true
      }}
    >
      <use xlink:href="#spectrum-icon-18-Key" />
    </svg>
    <Tags>
      <div class="tags">
        <div class="tag">
          {#each tags as tag}
            <Tag closable on:click={() => updateValue("")}>
              {tag}
            </Tag>
          {/each}
        </div>
      </div>
    </Tags>

    <input
      bind:this={field}
      {disabled}
      {readonly}
      {id}
      data-cy={dataCy}
      value={!tags.length ? value : ""}
      placeholder={placeholder || ""}
      on:click
      on:blur
      on:focus
      on:input
      on:keyup
      on:blur={onBlur}
      on:focus={onFocus}
      on:input={onInput}
      {type}
      class="spectrum-Textfield-input"
      style={align ? `text-align: ${align};` : ""}
      inputmode={type === "number" ? "decimal" : "text"}
    />
  </div>
  {#if open}
    <div
      use:clickOutside={handleOutsideClick}
      class="spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover is-open"
    >
      <ul
        class:no-variables-height={variables.length &&
          environmentVariablesEnabled}
        class="spectrum-Menu"
        role="listbox"
      >
        {#if !environmentVariablesEnabled}
          <div class="no-variables-text primary-text">
            Upgrade your plan to get environment variables
          </div>
        {:else if variables.length}
          <div style="max-height: 100px">
            {#each variables as variable, idx}
              <li
                class="spectrum-Menu-item"
                role="option"
                aria-selected="true"
                tabindex="0"
                on:click={() => handleVarSelect(variable.name)}
              >
                <span class="spectrum-Menu-itemLabel">
                  <div class="primary-text">
                    {variable.name}
                    <span />
                  </div>
                  <svg
                    class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <use xlink:href="#spectrum-css-icon-Checkmark100" />
                  </svg>
                </span>
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
          <svg
            class="spectrum-Icon spectrum-Icon--sizeS "
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-icon-18-Add" />
          </svg>
          <div class="primary-text">Add Variable</div>
        </div>
      {:else}
        <div on:click={() => handleUpgradePanel()} class="add-variable">
          <svg
            class="spectrum-Icon spectrum-Icon--sizeS "
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-icon-18-ArrowUp" />
          </svg>
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

  .icon-position {
    position: absolute;
    top: 20%;
    right: 2%;
  }

  .hoverable:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-blue-400);
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

  .no-variables-height {
    height: 100px;
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

  .focused {
    color: var(--spectrum-global-color-blue-400);
  }

  .add-variable:hover {
    background: var(--grey-1);
  }

  .tags {
    position: absolute;
    bottom: 12%;
    left: 1px;
  }
</style>
