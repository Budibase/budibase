<script context="module">
  import { writable } from "svelte/store"

  const openDrawers = writable([])
</script>

<script>
  import Portal from "svelte-portal"
  import Button from "../Button/Button.svelte"
  import { setContext, createEventDispatcher, onDestroy } from "svelte"
  import { generate } from "shortid"

  export let title
  export let headless = false

  const dispatch = createEventDispatcher()

  let visible = false
  let drawerId = generate()

  $: depth = $openDrawers.length - $openDrawers.indexOf(drawerId) - 1

  export function show() {
    if (visible) {
      return
    }
    visible = true
    dispatch("drawerShow", drawerId)
    openDrawers.update(state => [...state, drawerId])
  }

  export function hide() {
    if (!visible) {
      return
    }
    visible = false
    dispatch("drawerHide", drawerId)
    openDrawers.update(state => state.filter(id => id !== drawerId))
  }

  setContext("drawer-actions", {
    hide,
    show,
    headless,
  })

  const easeInOutQuad = x => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  }

  // Use a custom svelte transition here because the built-in slide
  // transition has a horrible overshoot
  const slide = () => {
    return {
      duration: 360,
      css: t => {
        const translation = 100 - Math.round(easeInOutQuad(t) * 100)
        return `transform: translateY(${translation}%);`
      },
    }
  }

  const getScaleFactor = depth => {
    // Quadratic function approaching a limit of 1 as depth tends to infinity
    const lim = 1 - 1 / (depth * depth + 1)
    // Scale drawers between 1 and 0.9 as depth approaches infinity
    return 1 - lim * 0.1
  }

  onDestroy(() => {
    if (visible) {
      hide()
    }
  })
</script>

{#if visible}
  <Portal target=".drawer-container">
    <div
      class="drawer"
      class:headless
      transition:slide|local
      style="--scale-factor:{getScaleFactor(depth)}"
      class:stacked={depth > 0}
    >
      {#if !headless}
        <header>
          <div class="text">{title}</div>
          <div class="buttons">
            <Button secondary quiet on:click={hide}>Cancel</Button>
            <slot name="buttons" />
          </div>
        </header>
      {/if}
      <slot name="body" />
    </div>
  </Portal>
{/if}

<style>
  .drawer {
    --drawer-spacing: 10px;
    position: absolute;
    left: var(--drawer-spacing);
    bottom: var(--drawer-spacing);
    transform: translateY(calc(-210% * (1 - var(--scale-factor))))
      scale(var(--scale-factor));
    width: calc(100% - 2 * var(--drawer-spacing));
    background: var(--background);
    border: var(--border-light);
    z-index: 3;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    transition: transform 360ms ease-out;
  }
  .drawer::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background);
    pointer-events: none;
    transition: opacity 360ms ease-out;
    opacity: calc(10 * (1 - var(--scale-factor)));
  }
  .drawer.stacked::after {
    pointer-events: all;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: var(--border-light);
    padding: var(--spacing-m) var(--spacing-xl);
    gap: var(--spacing-xl);
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
