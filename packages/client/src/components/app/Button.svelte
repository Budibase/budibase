<script>
  import { getContext } from "svelte"
  import "@spectrum-css/button/dist/index-vars.css"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  let handlingOnClick = false

  export let disabled = false
  export let text = ""
  export let onClick
  export let size = "M"
  export let type = "primary"
  export let quiet = false

  // For internal use only for now - not defined in the manifest
  export let icon = null
  export let active = false

  const handleOnClick = async () => {
    handlingOnClick = true

    if (onClick) {
      await onClick()
    }

    handlingOnClick = false
  }

  let node

  $: $component.editing && node?.focus()
  $: componentText = getComponentText(text, $builderStore, $component)

  const getComponentText = (text, builderState, componentState) => {
    if (componentState.editing) {
      return text || " "
    }
    return text || componentState.name || "Placeholder text"
  }

  const updateText = e => {
    builderStore.actions.updateProp("text", e.target.textContent)
  }
</script>

{#key $component.editing}
  <button
    class={`spectrum-Button spectrum-Button--size${size} spectrum-Button--${type}`}
    class:spectrum-Button--quiet={quiet}
    disabled={disabled || handlingOnClick}
    use:styleable={$component.styles}
    on:click={handleOnClick}
    contenteditable={$component.editing && !icon}
    on:blur={$component.editing ? updateText : null}
    bind:this={node}
    class:active
  >
    {#if icon}
      <svg
        class:hasText={componentText?.length > 0}
        class="spectrum-Icon spectrum-Icon--size{size.toUpperCase()}"
        focusable="false"
        aria-hidden="true"
        aria-label={icon}
      >
        <use xlink:href="#spectrum-icon-18-{icon}" />
      </svg>
    {/if}
    {componentText}
  </button>
{/key}

<style>
  button {
    width: fit-content;
    width: -moz-fit-content;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .spectrum-Button--overBackground:hover {
    color: #555;
  }
  .spectrum-Button::after {
    display: none;
  }
  .spectrum-Icon.hasText {
    margin-right: var(--spectrum-button-primary-icon-gap);
  }
  .active {
    color: var(--spectrum-global-color-blue-600);
  }
</style>
