<script context="module">
  import { writable, get } from "svelte/store"

  // Observe this class name if possible in order to know how to size the
  // drawer. If this doesn't exist we'll use a fixed size.
  const drawerContainer = "drawer-container"

  // Context level stores to keep drawers in sync
  const openDrawers = writable([])
  const modal = writable(false)
  const drawerLeft = writable(null)
  const drawerWidth = writable(null)

  // Resize observer to keep track of size changes
  let observer

  // Starts observing the target node to watching to size changes.
  // Invoked when the first drawer of a chain is rendered.
  const observe = () => {
    const target = document.getElementsByClassName(drawerContainer)[0]
    if (observer || !target) {
      return
    }
    observer = new ResizeObserver(entries => {
      if (!entries?.[0]) {
        return
      }
      const bounds = entries[0].target.getBoundingClientRect()
      drawerLeft.set(bounds.left)
      drawerWidth.set(bounds.width)
    })
    observer.observe(target)

    // Manually measure once to ensure that we have dimensions for the initial
    // paint
    const bounds = target.getBoundingClientRect()
    drawerLeft.set(bounds.left)
    drawerWidth.set(bounds.width)
  }

  // Stops observing the target node.
  // Invoked when the last drawer of a chain is removed.
  const unobserve = () => {
    if (get(openDrawers).length) {
      return
    }
    observer.disconnect()
    observer = null
  }
</script>

<script>
  import Portal from "svelte-portal"
  import Button from "../Button/Button.svelte"
  import { setContext, createEventDispatcher, onDestroy } from "svelte"
  import { generate } from "shortid"
  import { fade } from "svelte/transition"

  export let title
  export let headless = false

  const dispatch = createEventDispatcher()
  const spacing = 10

  let visible = false
  let drawerId = generate()

  $: depth = $openDrawers.length - $openDrawers.indexOf(drawerId) - 1
  $: style = getStyle(depth, $drawerLeft, $drawerWidth, $modal)

  const getStyle = (depth, left, width, modal) => {
    let style = `
      --scale-factor: ${getScaleFactor(depth)};
      --spacing: ${spacing}px;
    `
    // Most modal styles are handled by class names
    if (modal) {
      return style
    }

    // Normal drawers need a few additional styles
    left = left ? `${left + width / 2}px` : "20vw"
    width = width ? `${width - 2 * spacing}px` : "60vw"
    return `
      ${style}
      left: ${left};
      width: ${width};
    `
  }

  export function show() {
    if (visible) {
      return
    }
    observe()
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
    if (!$openDrawers.length) {
      modal.set(false)
    }
    unobserve()
  }

  setContext("drawer", {
    hide,
    show,
    modal,
  })

  const easeInOutQuad = x => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  }

  // Use a custom svelte transition here because the built-in slide
  // transition has a horrible overshoot
  const slide = () => {
    return {
      duration: 260,
      css: t => {
        const f = easeInOutQuad(t)
        const yOffset = (1 - f) * 200
        return `
          transform: translateX(-50%) translateY(calc(${yOffset}px + 50% - 1200px * (1 - var(--scale-factor))));
          opacity:${f};
        `
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
  <Portal target=".modal-container">
    {#if $modal}
      <div transition:fade={{ duration: 260 }} class="underlay" />
    {/if}
    <div
      class="drawer"
      class:headless
      class:modal={$modal}
      transition:slide|local
      {style}
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
      {#if !$modal && depth > 0}
        <div class="overlay" transition:fade|local={{ duration: 260 }} />
      {/if}
    </div>
  </Portal>
{/if}

<style>
  .drawer {
    position: absolute;
    transform: translateX(-50%) scale(var(--scale-factor))
      translateY(calc(50% - 800px * (1 - var(--scale-factor))));
    background: var(--background);
    border: var(--border-light);
    z-index: 3;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    transition: transform 260ms ease-out, bottom 260ms ease-out,
      left 260ms ease-out, width 260ms ease-out, height 260ms ease-out;
    height: 420px;
    bottom: calc(var(--spacing) + 210px);
    max-width: calc(100vw - 200px);
    max-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .drawer.modal {
    left: 50vw;
    bottom: 50vh;
    width: 1600px;
    height: 800px;
  }

  .overlay,
  .underlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 360ms ease-out;
    z-index: 3;
    opacity: 0.5;
  }
  .overlay {
    position: absolute;
    background: var(--background);
  }
  .underlay {
    position: fixed;
    background: var(--modal-background, rgba(0, 0, 0, 0.75));
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
