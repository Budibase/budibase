<script>
  import { onMount, onDestroy } from "svelte"
  import SettingsButton from "./SettingsButton.svelte"
  import { builderStore } from "../store"

  const verticalOffset = 28
  const horizontalOffset = 2

  let top = 0
  let left = 0
  let interval
  let self
  let measured = false

  $: definition = $builderStore.selectedComponentDefinition
  $: showBar = definition?.showSettingsBar
  $: settings = definition?.settings?.filter(setting => setting.showInBar) ?? []

  const updatePosition = () => {
    if (!showBar) {
      return
    }
    const id = $builderStore.selectedComponentId
    const parent = document.getElementsByClassName(id)?.[0]
    const element = parent?.childNodes?.[0]
    if (element && self) {
      // Batch reads to minimize reflow
      const elBounds = element.getBoundingClientRect()
      const width = self.offsetWidth
      const height = self.offsetHeight
      const { scrollX, scrollY, innerWidth } = window

      // Vertically, always render above unless no room, then render inside
      let newTop = elBounds.top + scrollY - verticalOffset - height
      if (newTop < 0) {
        newTop = elBounds.top + scrollY + verticalOffset
      }

      // Horizontally, try to center first.
      // Failing that, render to left edge of component.
      // Failing that, render to right edge of component,
      // Failing that, render to window left edge and accept defeat.
      let elCenter = elBounds.left + scrollX + elBounds.width / 2
      let newLeft = elCenter - width / 2
      if (newLeft < 0 || newLeft + width > innerWidth) {
        newLeft = elBounds.left + scrollX - horizontalOffset
        if (newLeft < 0 || newLeft + width > innerWidth) {
          newLeft = elBounds.right + scrollX - width + horizontalOffset
          if (newLeft < 0 || newLeft + width > innerWidth) {
            newLeft = horizontalOffset
          }
        }
      }

      // Only update state when things changes to minimize renders
      if (Math.round(newTop) !== Math.round(top)) {
        top = newTop
      }
      if (Math.round(newLeft) !== Math.round(left)) {
        left = newLeft
      }

      measured = true
    }
  }

  onMount(() => {
    interval = setInterval(updatePosition, 100)
  })

  onDestroy(() => {
    clearInterval(interval)
  })
</script>

{#if showBar}
  <div
    class="bar"
    style="top: {top}px; left: {left}px;"
    bind:this={self}
    class:visible={measured}
  >
    {#each settings as setting, idx}
      {#if setting.type === "select"}
        {#each setting.options as option}
          <SettingsButton
            prop={setting.key}
            value={option.value}
            icon={option.barIcon}
            title={option.barTitle}
          />
        {/each}
      {/if}
      {#if idx < settings.length - 1}
        <div class="divider" />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .bar {
    display: flex;
    position: absolute;
    z-index: 920;
    padding: 6px 8px;
    opacity: 0;
    flex-direction: row;
    background: var(--background);
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    gap: 2px;
    transition: opacity 0.13s ease-in-out;
  }
  .visible {
    opacity: 1;
  }
  .divider {
    flex: 0 0 1px;
    align-self: stretch;
    margin: 0 4px;
    background-color: var(--spectrum-global-color-gray-300);
  }
</style>
