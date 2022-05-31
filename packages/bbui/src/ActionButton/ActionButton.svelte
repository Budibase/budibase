<script>
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import { createEventDispatcher, getContext } from "svelte"
  const dispatch = createEventDispatcher()
  const context = getContext("builderFocus")

  export let quiet = false
  export let emphasized = false
  export let selected = false
  export let longPressable = false
  export let disabled = false
  export let icon = ""
  export let dataCy = null
  export let size = "M"
  export let active = false
  export let fullWidth = false
  export let autofocus = false

  let focus = false
  let actionButton
  $: focus = autofocus && actionButton !== undefined
  $: if (focus) {
    actionButton.focus()
  }

  function longPress(element) {
    if (!longPressable) return
    let timer

    const listener = () => {
      timer = setTimeout(() => {
        dispatch("longpress")
      }, 700)
    }

    element.addEventListener("pointerdown", listener)

    return {
      destroy() {
        clearTimeout(timer)
        element.removeEventListener("pointerdown", longPress)
      },
    }
  }
</script>

<button
  data-cy={dataCy}
  bind:this={actionButton}
  use:longPress
  class:spectrum-ActionButton--quiet={quiet}
  class:spectrum-ActionButton--emphasized={emphasized}
  class:is-selected={selected}
  class:fullWidth
  class="spectrum-ActionButton spectrum-ActionButton--size{size}"
  class:active
  class:is-focused={focus}
  {disabled}
  on:longPress
  on:click|preventDefault
  on:focus={() => {
    focus = true
  }}
  on:blur={() => {
    focus = false
    if (context) context.clear()
  }}
>
  {#if longPressable}
    <svg
      class="spectrum-Icon spectrum-UIIcon-CornerTriangle100 spectrum-ActionButton-hold"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-css-icon-CornerTriangle100" />
    </svg>
  {/if}
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--size{size}"
      focusable="false"
      aria-hidden="true"
      aria-label={icon}
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  {#if $$slots}
    <span class="spectrum-ActionButton-label"><slot /></span>
  {/if}
</button>

<style>
  .fullWidth {
    width: 100%;
  }
  .active,
  .active svg {
    color: var(--spectrum-global-color-blue-600);
  }
  button.is-focused {
    border-color: var(
      --spectrum-textfield-m-border-color-down,
      var(--spectrum-alias-border-color-mouse-focus)
    );
  }
</style>
