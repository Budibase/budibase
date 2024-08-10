<script>
  import { onMount, onDestroy } from "svelte"
  import SettingsButton from "./SettingsButton.svelte"
  import GridStylesButton from "./GridStylesButton.svelte"
  import SettingsColorPicker from "./SettingsColorPicker.svelte"
  import SettingsPicker from "./SettingsPicker.svelte"
  import { builderStore, componentStore, dndIsDragging } from "stores"
  import { Utils, shouldDisplaySetting } from "@budibase/frontend-core"
  import { findComponentParent } from "utils/components"
  import { getGridVar, GridParams } from "utils/grid"

  const verticalOffset = 36
  const horizontalOffset = 2

  let top = 0
  let left = 0
  let interval
  let self
  let measured = false
  let observer
  let computedStyles

  // TODO: respect dependsOn keys

  $: componentId = $builderStore.selectedComponentId
  $: measured, observeComputedStyles(componentId)
  $: component = $componentStore.selectedComponent
  $: definition = $componentStore.selectedComponentDefinition
  $: parent = findComponentParent($builderStore.screen.props, componentId)
  $: instance = componentStore.actions.getComponentInstance(componentId)
  $: state = $instance?.state
  $: showBar =
    definition?.showSettingsBar !== false &&
    !$dndIsDragging &&
    definition &&
    !$state?.errorState
  $: {
    if (!showBar) {
      measured = false
    }
  }
  $: settings = getBarSettings(component, definition)
  $: isRoot = componentId === $builderStore.screen?.props?._id
  $: insideGrid =
    parent?._component.endsWith("/container") && parent.layout === "grid"
  $: showGridStyles =
    insideGrid &&
    (definition?.grid?.hAlign !== "stretch" ||
      definition?.grid?.vAlign !== "stretch")
  $: device = $builderStore.previewDevice
  $: gridHAlignVar = getGridVar(device, GridParams.HAlign)
  $: gridVAlignVar = getGridVar(device, GridParams.VAlign)

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
    const id = $builderStore.selectedComponentId
    let element = document.getElementsByClassName(id)?.[0]
    if (!insideGrid) {
      element = element?.children?.[0]
    }

    // The settings bar is higher in the dom tree than the selection indicators
    // as we want to be able to render the settings bar wider than the screen,
    // or outside the screen.
    // Therefore we use the clip root rather than the app root to determine
    // its position.
    const device = document.getElementById("clip-root")
    if (element && self) {
      // Batch reads to minimize reflow
      const deviceBounds = device.getBoundingClientRect()
      const elBounds = element.getBoundingClientRect()
      const width = self.offsetWidth
      const height = self.offsetHeight
      const { scrollX, scrollY, innerWidth } = window

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
  }
  const debouncedUpdate = Utils.domDebounce(updatePosition)

  const observeComputedStyles = id => {
    observer?.disconnect()
    const node = document.getElementsByClassName(`${id}-dom`)[0]?.parentNode
    if (node) {
      observer = new MutationObserver(() => {
        console.log("get computed")
        computedStyles = getComputedStyle(node)
        updatePosition()
      })
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["style"],
        childList: false,
        subtree: false,
      })
      computedStyles = getComputedStyle(node)
    }
  }

  onMount(() => {
    debouncedUpdate()
    interval = setInterval(debouncedUpdate, 100)
    document.addEventListener("scroll", debouncedUpdate, true)
  })

  onDestroy(() => {
    clearInterval(interval)
    document.removeEventListener("scroll", debouncedUpdate, true)
    observer?.disconnect()
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
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="center"
        icon="AlignCenter"
        title="Align center"
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="end"
        icon="AlignRight"
        title="Align right"
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridHAlignVar}
        value="stretch"
        icon="MoveLeftRight"
        title="Stretch horizontally"
        {componentId}
        {computedStyles}
      />
      <div class="divider" />
      <GridStylesButton
        style={gridVAlignVar}
        value="start"
        icon="AlignTop"
        title="Align top"
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="center"
        icon="AlignMiddle"
        title="Align middle"
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="end"
        icon="AlignBottom"
        title="Align bottom"
        {componentId}
        {computedStyles}
      />
      <GridStylesButton
        style={gridVAlignVar}
        value="stretch"
        icon="MoveUpDown"
        title="Stretch vertically"
        {componentId}
        {computedStyles}
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
              {component}
            />
          {/each}
        {:else}
          <SettingsPicker
            prop={setting.key}
            options={setting.options}
            label={setting.label}
            {component}
          />
        {/if}
      {:else if setting.type === "boolean"}
        <SettingsButton
          prop={setting.key}
          icon={setting.barIcon}
          title={setting.barTitle || setting.label}
          bool
          {component}
        />
      {:else if setting.type === "color"}
        <SettingsColorPicker prop={setting.key} {component} />
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
