<script>
  import { getContext } from "svelte"
  import "@spectrum-css/button/dist/index-vars.css"

  const { styleable, builderStore } = getContext("sdk")
  const component = getContext("component")

  export let disabled = false
  export let text = ""
  export let onClick
  export let size = "M"
  export let type = "primary"
  export let quiet = false

  let node

  $: $component.editing && node?.focus()
  $: componentText = getComponentText(text, $builderStore, $component)

  const getComponentText = (text, builderState, componentState) => {
    if (!builderState.inBuilder || componentState.editing) {
      return text || " "
    }
    return text || componentState.name || "Placeholder text"
  }

  const updateText = e => {
    builderStore.actions.updateProp("text", e.target.textContent)
  }
</script>

<button
  class={`spectrum-Button spectrum-Button--size${size} spectrum-Button--${type}`}
  class:spectrum-Button--quiet={quiet}
  {disabled}
  use:styleable={$component.styles}
  on:click={onClick}
  class:editing={$component.editing}
  contenteditable={$component.editing}
  on:blur={$component.editing ? updateText : null}
>
  {componentText}
</button>

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
</style>
