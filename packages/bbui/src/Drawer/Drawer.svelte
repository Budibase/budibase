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
    observer?.disconnect()
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

  const dispatch = createEventDispatcher()
  const spacing = 11

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
    if (modal || left == null || width == null) {
      return style
    }

    // Drawers observing another dom node need custom position styles
    return `
      ${style}
      left: ${left + spacing}px;
      width: ${width - 2 * spacing}px;
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
          transform: translateY(calc(${yOffset}px - 800px * (1 - var(--scale-factor))));
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
      class:stacked={depth > 0}
      class:modal={$modal}
      transition:slide|local
      {style}
    >
      <header>
        <div class="text">{title}</div>
        <div class="buttons">
          <Button secondary quiet on:click={hide}>Cancel</Button>
          <slot name="buttons" />
        </div>
      </header>
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
    left: 25vw;
    width: 50vw;
    bottom: var(--spacing);
    height: 420px;
    background: var(--background);
    border: var(--border-light);
    z-index: 3;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    transition: transform 260ms ease-out, bottom 260ms ease-out,
      left 260ms ease-out, width 260ms ease-out, height 260ms ease-out;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .drawer.modal {
    left: 15vw;
    width: 70vw;
    bottom: 15vh;
    height: 70vh;
  }
  .drawer.stacked {
    transform: translateY(calc(-1 * 1024px * (1 - var(--scale-factor))))
      scale(var(--scale-factor));
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
