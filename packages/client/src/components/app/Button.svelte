<script>
  import { getContext } from "svelte"
  import "@spectrum-css/button/dist/index-vars.css"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let disabled = false
  export let text = ""
  export let onClick
  export let size = "M"
  export let type = "cta"
  export let quiet = false
  export let icon = null
  export let gap = "M"

  // For internal use only for now - not defined in the manifest
  export let active = false

  let node
  let touched = false
  let handlingOnClick = false

  $: $component.editing && node?.focus()
  $: componentText = getComponentText(text, $builderStore, $component)

  const getComponentText = (text, builderState, componentState) => {
    if (componentState.editing) {
      return text || " "
    }
    return text || componentState.name || "Placeholder text"
  }

  const updateText = e => {
    if (touched) {
      builderStore.actions.updateProp("text", e.target.textContent)
    }
    touched = false
  }

  const handleOnClick = async () => {
    handlingOnClick = true
    if (onClick) {
      await onClick()
    }
    handlingOnClick = false
  }
</script>

{#key $component.editing}
  <button
    class={`spectrum-Button spectrum-Button--size${size} spectrum-Button--${type} gap-${gap}`}
    class:spectrum-Button--quiet={quiet}
    disabled={disabled || handlingOnClick}
    use:styleable={$component.styles}
    on:click={handleOnClick}
    contenteditable={$component.editing && !icon}
    on:blur={$component.editing ? updateText : null}
    bind:this={node}
    class:active
    on:input={() => (touched = true)}
  >
    {#if icon}
      <i class="{icon} {size}" />
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
  .gap-S {
    gap: 8px;
  }
  .gap-M {
    gap: 16px;
  }
  .gap-L {
    gap: 32px;
  }
</style>
