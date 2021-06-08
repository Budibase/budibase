<script>
  import { onMount, onDestroy } from "svelte"
  import SettingsButton from "./SettingsButton.svelte"
  import { builderStore } from "../store"

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
      const elBounds = element.getBoundingClientRect()
      const width = self.offsetWidth
      const height = self.offsetHeight

      // Vertically, always render above unless no room, then render inside
      let newTop = elBounds.top + window.scrollY - 10 - height
      if (newTop < 0) {
        newTop = elBounds.top + window.scrollY + 10
      }

      // Horizontally, try to center first.
      // Failing that, render to left edge of component.
      // Failing that, render to right edge of component,
      // Failing that, render to window left edge and accept defeat.
      let elCenter = elBounds.left + window.scrollX + elBounds.width / 2
      let newLeft = elCenter - width / 2
      if (newLeft < 0 || newLeft + width > window.innerWidth) {
        newLeft = elBounds.left + window.scrollX
        if (newLeft < 0 || newLeft + width > window.innerWidth) {
          newLeft = elBounds.left + window.scrollX + elBounds.width - width
          if (newLeft < 0 || newLeft + width > window.innerWidth) {
            newLeft = 0
          }
        }
      }

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
    if (interval) {
      clearInterval(interval)
    }
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
    z-index: 999;
    padding: 6px 12px;
    opacity: 0;
    background-color: white;
    flex-direction: row;
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
    background-color: #ddd;
  }
</style>
