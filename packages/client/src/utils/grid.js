import { builderStore, componentStore } from "stores"
import { derived, get, readable } from "svelte/store"

/**
 * We use CSS variables on components to control positioning and layout of
 * components inside grids.
 * --grid-[mobile/desktop]-[row/col]-[start-end]: for positioning
 * --grid-[mobile/desktop]-[h/v]-align: for layout of inner components within
 *  the components grid bounds
 *
 * Component definitions define their default layout preference via the
 * `grid.hAlign` and `grid.vAlign` keys in the manifest.
 */

// Enum for device preview type, included in grid CSS variables
const Devices = {
  Desktop: "desktop",
  Mobile: "mobile",
}

// Generates the CSS variable for a certain grid param suffix, for the current
// device
const previewDevice = derived(builderStore, $store => $store.previewDevice)
export const getGridVar = derived(previewDevice, device => suffix => {
  const prefix = device === Devices.Mobile ? Devices.Mobile : Devices.Desktop
  return `--grid-${prefix}-${suffix}`
})

// Generates the CSS variable for a certain grid param suffix, for the other
// device variant than the one included in this variable
export const getOtherDeviceGridVar = cssVar => {
  if (cssVar.includes(Devices.Desktop)) {
    return cssVar.replace(Devices.Desktop, Devices.Mobile)
  } else {
    return cssVar.replace(Devices.Mobile, Devices.Desktop)
  }
}

// Gets the default value for a certain grid CSS variable
export const getDefaultGridVarValue = cssVar => {
  if (cssVar.includes("align")) {
    return cssVar.includes("-h-") ? "stretch" : "center"
  } else {
    return cssVar.endsWith("-start") ? 1 : 2
  }
}

// Determines whether a JS event originated from immediately within a grid
export const isGridEvent = e => {
  return (
    e.target
      .closest?.(".component")
      ?.parentNode.closest(".component")
      ?.childNodes[0]?.classList?.contains("grid") ||
    e.target.classList.contains("anchor")
  )
}

// Determines whether a DOM element is an immediate child of a grid
export const isGridChild = node => {
  return node
    ?.closest(".component")
    ?.parentNode.closest(".component")
    ?.childNodes[0]?.classList?.contains("grid")
}

// Gets the component ID of the closest parent grid
export const getGridParentID = node => {
  return node?.closest(".grid")?.parentNode.dataset.id
}

// Generates the base set of grid CSS vars from a component definition
const alignmentToStyleMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
}
export const getBaseGridVars = definition => {
  const gridHAlign = definition.grid?.hAlign || "stretch"
  const gridVAlign = definition.grid?.vAlign || "center"
  const flexStyles = gridVAlign === "stretch" ? "1 1 0" : "0 0 auto"
  return {
    ["--grid-desktop-h-align"]: alignmentToStyleMap[gridHAlign],
    ["--grid-mobile-h-align"]: alignmentToStyleMap[gridHAlign],
    ["--grid-desktop-v-align"]: alignmentToStyleMap[gridVAlign],
    ["--grid-mobile-v-align"]: alignmentToStyleMap[gridVAlign],
    ["--grid-desktop-child-flex"]: flexStyles,
    ["--grid-mobile-child-flex"]: flexStyles,
  }
}

// Gets the current value of a certain grid CSS variable for a component
export const getGridVarValue = (styles, variable) => {
  // Try the desired variable
  let val = styles?.[variable]

  // Otherwise try the other device variables
  if (!val) {
    val = styles?.[getOtherDeviceGridVar(variable)]
  }

  // Otherwise use the default
  return val ? val : getDefaultGridVarValue(variable)
}
