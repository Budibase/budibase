<script>
  import { onMount, onDestroy, getContext } from "svelte"
  import SettingsButton from "./SettingsButton.svelte"
  import GridStylesButton from "./GridStylesButton.svelte"
  import SettingsColorPicker from "./SettingsColorPicker.svelte"
  import SettingsPicker from "./SettingsPicker.svelte"
  import { builderStore, componentStore, dndIsDragging } from "stores"
  import { Utils, shouldDisplaySetting } from "@budibase/frontend-core"
  import { getGridVar, GridParams, Devices } from "utils/grid"

  const context = getContext("context")
  const verticalOffset = 36
  const horizontalOffset = 2
  const observer = new MutationObserver(() => debouncedUpdate())

  let top = 0
  let left = 0
  let interval
  let self
  let measured = false
  let observing = false
  let insideGrid = false
  let gridHAlign
  let gridVAlign

  $: id = $builderStore.selectedComponentId
  $: id, reset()
  $: component = $componentStore.selectedComponent
  $: definition = $componentStore.selectedComponentDefinition
  $: instance = componentStore.actions.getComponentInstance(id)
  $: state = $instance?.state
  $: showBar =
    definition?.showSettingsBar !== false &&
    !$dndIsDragging &&
    definition &&
    !$state?.errorState
  $: settings = getBarSettings(component, definition)
  $: isRoot = id === $builderStore.screen?.props?._id
  $: showGridStyles =
    insideGrid &&
    (definition?.grid?.hAlign !== "stretch" ||
      definition?.grid?.vAlign !== "stretch")
  $: mobile = $context.device.mobile
  $: device = mobile ? Devices.Mobile : Devices.Desktop
  $: gridHAlignVar = getGridVar(device, GridParams.HAlign)
  $: gridVAlignVar = getGridVar(device, GridParams.VAlign)

  const reset = () => {
    observer.disconnect()
    measured = false
    observing = false
    insideGrid = false
  }

  const startObserving = domBoundary => {
    observer.observe(domBoundary, {
      attributes: true,
      attributeFilter: ["style"],
    })
    observing = true
  }

  const getBarSettings = (component, definition) => {
    let allSettings = []
    definition?.settings?.forEach(setting => {
      if (setting.section && shouldDisplaySetting(component, setting)) {
        allSettings = allSettings.concat(setting.settings || [])
      } else {
        allSettings.push(setting)
      }
    })
    return allSettings.filter(
      setting =>
        setting.showInBar &&
        !setting.hidden &&
        shouldDisplaySetting(component, setting)
    )
  }

  const updatePosition = () => {
    if (!showBar) {
      return
    }

    // Find DOM boundary and ensure it is valid
    let domBoundary = document.getElementsByClassName(id)[0]
    if (!domBoundary) {
      return reset()
    }

    // If we're inside a grid, allow time for buttons to render
    const nextInsideGrid = domBoundary.dataset.insideGrid === "true"
    if (nextInsideGrid && !insideGrid) {
      insideGrid = true
      return
    } else {
      insideGrid = nextInsideGrid
    }

    // Get the correct DOM boundary depending if we're inside a grid or not
    if (!insideGrid) {
      domBoundary =
        domBoundary.getElementsByClassName(`${id}-dom`)[0] ||
        domBoundary.children?.[0]
    }
    if (!domBoundary || !self) {
      return reset()
    }

    // Start observing if required
    if (!observing) {
      startObserving(domBoundary)
    }

    // Batch reads to minimize reflow
    const deviceEl = document.getElementById("clip-root")
    const deviceBounds = deviceEl.getBoundingClientRect()
    const elBounds = domBoundary.getBoundingClientRect()
    const width = self.offsetWidth
    const height = self.offsetHeight
    const { scrollX, scrollY, innerWidth } = window

    // Read grid metadata from data attributes
    if (insideGrid) {
      if (mobile) {
        gridHAlign = domBoundary.dataset.gridMobileHAlign
        gridVAlign = domBoundary.dataset.gridMobileVAlign
      } else {
        gridHAlign = domBoundary.dataset.gridDesktopHAlign
        gridVAlign = domBoundary.dataset.gridDesktopVAlign
      }
    }

    // Vertically, always render above unless no room, then render inside
    let newTop = elBounds.top + scrollY - verticalOffset - height
    if (newTop < deviceBounds.top - 50) {
      newTop = deviceBounds.top - 50
    }
    if (newTop < 0) {
      newTop = 0
    }
    const deviceBottom = deviceBounds.top + deviceBounds.height
    if (newTop > deviceBottom - 44) {
      newTop = deviceBottom - 44
    }

    //If element is at the very top of the screen, put the bar below the element
    if (elBounds.top < elBounds.height && elBounds.height < 80) {
      newTop = elBounds.bottom + verticalOffset
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
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
    reset()
  })
</script>

{#if showBar}
  <div
    class="bar"
    style="top:{top}px; left:{left}px;"
    bind:this={self}
    class:visible={measured}
  >
    {#if showGridStyles}
      <GridStylesButton
        style={gridHAlignVar}
        value="start"
        icon="AlignLeft"
        title="Align left"
        active={gridHAlign === "start"}
        componentId={id}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="center"
        icon="AlignCenter"
        title="Align center"
        active={gridHAlign === "center"}
        componentId={id}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="end"
        icon="AlignRight"
        title="Align right"
        active={gridHAlign === "end"}
        componentId={id}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="stretch"
        icon="MoveLeftRight"
        title="Stretch horizontally"
        active={gridHAlign === "stretch"}
        componentId={id}
      />
      <div class="divider" />
      <GridStylesButton
        style={gridVAlignVar}
        value="start"
        icon="AlignTop"
        title="Align top"
        active={gridVAlign === "start"}
        componentId={id}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="center"
        icon="AlignMiddle"
        title="Align middle"
        active={gridVAlign === "center"}
        componentId={id}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="end"
        icon="AlignBottom"
        title="Align bottom"
        active={gridVAlign === "end"}
        componentId={id}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="stretch"
        icon="MoveUpDown"
        title="Stretch vertically"
        active={gridVAlign === "stretch"}
        componentId={id}
      />
      <div class="divider" />
    {/if}
    {#each settings as setting, idx}
      {#if setting.type === "select"}
        {#if setting.barStyle === "buttons"}
          {#each setting.options as option}
            <SettingsButton
              prop={setting.key}
              value={option.value}
              icon={option.barIcon}
              title={option.barTitle || option.label}
              disabled={!!setting.license}
              {component}
            />
          {/each}
        {:else}
          <SettingsPicker
            prop={setting.key}
            options={setting.options}
            label={setting.label}
            disabled={!!setting.license}
            {component}
          />
        {/if}
      {:else if setting.type === "boolean"}
        <SettingsButton
          prop={setting.key}
          icon={setting.barIcon}
          title={setting.barTitle || setting.label}
          disabled={!!setting.license}
          bool
          {component}
        />
      {:else if setting.type === "color"}
        <SettingsColorPicker
          prop={setting.key}
          {component}
          disabled={!!setting.license}
        />
      {/if}
      {#if setting.barSeparator !== false && (settings.length != idx + 1 || !isRoot)}
        <div class="divider" />
      {/if}
    {/each}
    {#if !isRoot}
      <SettingsButton
        icon="Duplicate"
        on:click={() => {
          builderStore.actions.duplicateComponent(
            $builderStore.selectedComponentId
          )
        }}
        title="Duplicate component"
      />
      <SettingsButton
        icon="Delete"
        on:click={() => {
          builderStore.actions.deleteComponent(
            $builderStore.selectedComponentId
          )
        }}
        title="Delete component"
      />
    {/if}
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
