<script>
  import { onMount, onDestroy } from "svelte"
  import SettingsButton from "./SettingsButton.svelte"
  import SettingsColorPicker from "./SettingsColorPicker.svelte"
  import SettingsPicker from "./SettingsPicker.svelte"
  import { builderStore } from "../../store"
  import { domDebounce } from "../../utils/domDebounce"

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
        newTop = 0
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
  const debouncedUpdate = domDebounce(updatePosition)

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
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
        {#if setting.barStyle === "buttons"}
          {#each setting.options as option}
            <SettingsButton
              prop={setting.key}
              value={option.value}
              icon={option.barIcon}
              title={option.barTitle}
            />
          {/each}
        {:else}
          <SettingsPicker
            prop={setting.key}
            options={setting.options}
            label={setting.label}
          />
        {/if}
      {:else if setting.type === "boolean"}
        <SettingsButton
          prop={setting.key}
          icon={setting.barIcon}
          title={setting.barTitle}
          bool
        />
      {:else if setting.type === "color"}
        <SettingsColorPicker prop={setting.key} />
      {/if}
      {#if setting.barSeparator !== false}
        <div class="divider" />
      {/if}
    {/each}
    <SettingsButton
      icon="Delete"
      on:click={() => {
        builderStore.actions.deleteComponent(
          $builderStore.selectedComponent._id
        )
      }}
    />
  </div>
{/if}

<style>
  .bar {
    display: flex;
    position: absolute;
    z-index: 930;
    padding: 6px 8px;
    opacity: 0;
    flex-direction: row;
    background: var(--spectrum-alias-background-color-primary);
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

  /* Theme overrides */
  :global(.spectrum--dark) .bar,
  :global(.spectrum--darkest) .bar {
    background: var(--spectrum-global-color-gray-200);
  }
  :global(.spectrum--dark) .divider,
  :global(.spectrum--darkest) .divider {
    background: var(--spectrum-global-color-gray-400);
  }
</style>
