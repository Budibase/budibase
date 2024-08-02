import { builderStore } from "stores"
import { derived } from "svelte/store"
import { buildStyleString } from "utils/styleable.js"

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

// Enum representing the different CSS variables we use for grid metadata
export const GridVars = {
  HAlign: "h-align",
  VAlign: "v-align",
  ColStart: "col-start",
  ColEnd: "col-end",
  RowStart: "row-start",
  RowEnd: "row-end",
}

// Classes used in selectors inside grid containers to control child styles
export const GridClasses = {
  DesktopFill: "grid-desktop-grow",
  MobileFill: "grid-mobile-grow",
}

// Enum for device preview type, included in grid CSS variables
const Devices = {
  Desktop: "desktop",
  Mobile: "mobile",
}

// A derived map of all CSS variables for the current device
const previewDevice = derived(builderStore, $store => $store.previewDevice)
export const gridCSSVars = derived(previewDevice, $device => {
  const device = $device === Devices.Mobile ? Devices.Mobile : Devices.Desktop
  let vars = {}
  for (let type of Object.values(GridVars)) {
    vars[type] = `--grid-${device}-${type}`
  }
  return vars
})

// Builds a CSS variable name for a certain piece of grid metadata
export const getGridCSSVar = (device, type) => `--grid-${device}-${type}`

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
  return node?.parentNode?.closest(".grid")?.parentNode.dataset.id
}

// Gets the current value of a certain grid CSS variable for a component
export const getGridVarValue = (styles, variable) => {
  // Try the desired variable
  let val = styles?.variables?.[variable]

  // Otherwise try the other device variables
  if (!val) {
    val = styles?.[getOtherDeviceGridVar(variable)]
  }

  // Otherwise use the default
  return val ? val : getDefaultGridVarValue(variable)
}

// Svelte action to apply required class names and styles to our component
// wrappers
export const gridLayout = (node, metadata) => {
  let selectComponent

  const applyMetadata = metadata => {
    const { id, styles, interactive, errored, definition } = metadata
    consol.log(styles)

    // Callback to select the component when clicking on the wrapper
    selectComponent = e => {
      e.preventDefault()
      builderStore.actions.selectComponent(id)
    }

    // Generate base set of grid CSS vars based for this component
    const hAlign = errored ? "stretch" : definition?.grid?.hAlign || "stretch"
    const vAlign = errored ? "stretch" : definition?.grid?.vAlign || "center"
    const vars = {
      "--default-width": errored ? 500 : definition.size?.width || 100,
      "--default-height": errored ? 60 : definition.size?.height || 100,
      "--grid-desktop-h-align": hAlign,
      "--grid-mobile-h-align": hAlign,
      "--grid-desktop-v-align": vAlign,
      "--grid-mobile-v-align": vAlign,
    }

    // Extract any other CSS variables from the saved component styles
    for (let style of Object.keys(styles)) {
      if (style.startsWith("--")) {
        vars[style] = styles[style]
        delete styles[style]
      }
    }

    // Apply all CSS variables to the wrapper
    node.style = buildStyleString(vars)

    // Toggle classes to specify whether our children should fill
    const desktopVar = getGridCSSVar(Devices.Desktop, GridVars.VAlign)
    const mobileVar = getGridCSSVar(Devices.Mobile, GridVars.VAlign)
    node.classList.toggle(
      GridClasses.DesktopFill,
      vars[desktopVar] === "stretch"
    )
    node.classList.toggle(GridClasses.MobileFill, vars[mobileVar] === "stretch")

    // Add a listener to select this node on click
    if (interactive) {
      node.addEventListener("click", selectComponent, false)
    }
  }

  const removeListeners = () => {
    node.removeEventListener("click", selectComponent)
  }

  applyMetadata(metadata)

  return {
    update(newMetadata) {
      removeListeners()
      applyMetadata(newMetadata)
    },
    destroy() {
      removeListeners()
    },
  }
}
