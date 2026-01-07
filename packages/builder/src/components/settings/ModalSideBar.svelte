<script lang="ts">
  import { Context, Icon } from "@budibase/bbui"
  import { createLocalStorageStore } from "@budibase/frontend-core"
  import { onMount } from "svelte"

  import { onDestroy, setContext, createEventDispatcher } from "svelte"

  setContext(Context.PopoverRoot, ".nav .popover-container")

  const dispatch = createEventDispatcher()

  const pinned = createLocalStorageStore("settings-nav-pinned", true)

  let ignoreFocus = false
  let focused = false
  let timeout: ReturnType<typeof setTimeout> | undefined
  let initialized = false
  let previousCollapsed: boolean | undefined = undefined

  $: !$pinned && unPin()
  $: collapsed = !focused && !$pinned

  // Only dispatch when collapsed actually changes
  $: {
    if (initialized && previousCollapsed !== collapsed) {
      dispatch("toggle", collapsed)
    }
    previousCollapsed = collapsed
  }

  export const unPin = () => {
    // We need to ignore pointer events for a while since otherwise we would
    // instantly trigger a mouseenter and show it again
    ignoreFocus = true
    focused = false
    timeout = setTimeout(() => {
      ignoreFocus = false
    }, 130)
  }

  export const setFocused = (nextFocused: boolean) => {
    if (ignoreFocus) {
      return
    }
    focused = nextFocused
  }

  export const keepCollapsed = () => {
    if (!$pinned) {
      unPin()
    }
  }

  onMount(() => {
    initialized = true
    dispatch("toggle", collapsed)
  })

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

<div class="nav_wrapper">
  <div class="nav_spacer" class:pinned={$pinned}></div>
  <div
    class="nav"
    class:pinned={$pinned}
    class:focused
    role="tooltip"
    on:mouseenter={() => setFocused(true)}
    on:mouseleave={() => setFocused(false)}
  >
    <div class="nav_header">
      <div class="icon">
        <slot name="header_icon" />
      </div>
      <div class="nav_title">
        <h1>Settings</h1>
      </div>
      <div class="collapse_icon">
        <Icon
          name="sidebar-simple"
          hoverable
          on:click={() => pinned.set(!$pinned)}
        />
      </div>
    </div>

    <div class="nav_body">
      <div class="links core">
        <slot />
      </div>
      <div class="popover-container"></div>
    </div>
  </div>
</div>

<style>
  .nav_wrapper {
    display: contents;
    --nav-logo-width: 20px;
    --nav-padding: 12px;
    --nav-collapsed-width: calc(
      var(--nav-logo-width) + var(--nav-padding) * 2 + 2px
    );
    --nav-width: 240px;
    --nav-border: 1px solid var(--spectrum-global-color-gray-200);
  }
  /* Spacer to allow nav to always be absolutely positioned */
  .nav_spacer {
    flex: 0 0 var(--nav-collapsed-width);
  }
  .nav_spacer.pinned {
    display: none;
  }

  .nav {
    background: var(--background-alt);
    position: absolute;
    width: var(--nav-collapsed-width);
    top: 0;
    left: 0;
    z-index: 4;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-right: var(--nav-border);
    transition: width 130ms ease-out;
    overflow: hidden;
    container-type: inline-size;
  }
  .nav:not(.pinned).focused {
    width: var(--nav-width);
  }
  .nav.pinned {
    position: relative;
    flex: 0 0 var(--nav-width);
    width: var(--nav-width);
  }

  .nav_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 0 0 50px;
    padding: 0 var(--nav-padding);
    gap: 5px;
    border-bottom: var(--nav-border);
    color: var(--spectrum-global-color-gray-800);
  }

  .nav_title {
    width: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 4px;
    color: var(--spectrum-global-color-gray-800);
  }
  .nav_title h1 {
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: var(--spectrum-global-color-gray-900);
  }

  .nav_header .icon {
    display: grid;
    place-items: center;
    min-width: var(--nav-logo-width);
    padding-left: 1px;
  }

  .nav_body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    flex: 1 1 auto;
    padding: var(--spacing-l) 0;
    padding-top: 0px;
    gap: 3px;
    min-height: 0;
  }

  .popover-container {
    position: absolute;
  }

  .links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0 calc(var(--nav-padding) / 2);
    gap: 4px;
  }

  .links.core {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    flex: 1 1 auto;
  }

  .nav:not(.pinned):not(.focused) .nav_title,
  .nav:not(.pinned):not(.focused) .collapse_icon {
    display: none;
  }
</style>
