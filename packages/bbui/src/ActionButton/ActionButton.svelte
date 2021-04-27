<script>
  import "@spectrum-css/actionbutton/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let quiet = false
  export let emphasized = false
  export let selected = false
  export let longPressable = false
  export let disabled = false
  export let icon = ""

  export let xl = false
  export let l = false
  export let m = false
  export let s = false
  $: useDefault = ![xl, l, m, s].includes(true)

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
  use:longPress
  class:spectrum-ActionButton--quiet={quiet}
  class:spectrum-ActionButton--emphasized={emphasized}
  class:is-selected={selected}
  class:spectrum-ActionButton--sizeS={s}
  class:spectrum-ActionButton--sizeM={m || useDefault}
  class:spectrum-ActionButton--sizeL={l}
  class:spectrum-ActionButton--sizeXL={xl}
  class="spectrum-ActionButton"
  {disabled}
  on:longPress
  on:click|preventDefault
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
      class:spectrum-Icon--sizeS={s}
      class:spectrum-Icon--sizeM={m || useDefault}
      class:spectrum-Icon--sizeL={l}
      class:spectrum-Icon--sizeXL={xl}
      class="spectrum-Icon"
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
  span {
    text-transform: capitalize;
  }
</style>
