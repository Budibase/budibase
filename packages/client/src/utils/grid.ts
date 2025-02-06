import { GridSpacing, GridRowHeight } from "@/constants"
import { builderStore } from "stores"
import { buildStyleString } from "utils/styleable.js"

interface GridMetadata {
  id: string
  styles: Record<string, string | number> & {
    "--default-width"?: number
    "--default-height"?: number
  }
  interactive: boolean
  errored: boolean
  definition?: {
    size?: {
      width: number
      height: number
    }
    grid?: { hAlign: string; vAlign: string }
  }
  draggable: boolean
  insideGrid: boolean
  ignoresLayout: boolean
}

/**
 * We use CSS variables on components to control positioning and layout of
 * components inside grids.
 * --grid-[mobile/desktop]-[row/col]-[start-end]: for positioning
 * --grid-[mobile/desktop]-[h/v]-align: for layout of inner components within
 *  the components grid bounds
 *
 * Component definitions define their default layout preference via the
 * `grid.hAlign` and `grid.vAlign` keys in the manifest.
 *
 * We also apply grid-[mobile/desktop]-grow CSS classes to component wrapper
 * DOM nodes to use later in selectors, to control the sizing of children.
 */

// Enum representing the different CSS variables we use for grid metadata
export const GridParams = {
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
export const Devices = {
  Desktop: "desktop",
  Mobile: "mobile",
}

export const GridDragModes = {
  Resize: "resize",
  Move: "move",
}

// Builds a CSS variable name for a certain piece of grid metadata
export const getGridVar = (device: string, param: string) =>
  `--grid-${device}-${param}`

// Determines whether a JS event originated from immediately within a grid
export const isGridEvent = (e: Event & { target: HTMLElement }): boolean => {
  return (
    e.target.dataset?.indicator === "true" ||
    // @ts-expect-error: api is not properly typed
    e.target
      .closest?.(".component")
      // @ts-expect-error
      ?.parentNode.closest(".component")
      ?.childNodes[0]?.classList?.contains("grid")
  )
}

// Svelte action to apply required class names and styles to our component
// wrappers
export const gridLayout = (node: HTMLDivElement, metadata: GridMetadata) => {
  let selectComponent: ((e: Event) => void) | null

  // Applies the required listeners, CSS and classes to a component DOM node
  const applyMetadata = (metadata: GridMetadata) => {
    const {
      id,
      styles,
      interactive,
      errored,
      definition,
      draggable,
      insideGrid,
      ignoresLayout,
    } = metadata
    if (!insideGrid) {
      return
    }

    // If this component ignores layout, flag it as such so that we can avoid
    // selecting it later
    if (ignoresLayout) {
      node.classList.add("ignores-layout")
      return
    }

    // Callback to select the component when clicking on the wrapper
    selectComponent = (e: Event) => {
      e.stopPropagation()
      builderStore.actions.selectComponent(id)
    }

    // Determine default width and height of component
    let width = styles["--default-width"] ?? definition?.size?.width ?? 200
    let height = styles["--default-height"] ?? definition?.size?.height ?? 200
    if (errored) {
      width = 500
      height = 60
    }
    width += 2 * GridSpacing
    height += 2 * GridSpacing
    const vars: Record<string, string | number> = {
      "--default-width": width,
      "--default-height": height,
    }

    // Generate defaults for all grid params
    const defaults = {
      [GridParams.HAlign]: definition?.grid?.hAlign || "stretch",
      [GridParams.VAlign]: definition?.grid?.vAlign || "center",
      [GridParams.ColStart]: 1,
      [GridParams.ColEnd]:
        "round(up, calc((var(--grid-spacing) * 2 + var(--default-width)) / var(--col-size) + 1))",
      [GridParams.RowStart]: 1,
      [GridParams.RowEnd]: Math.max(2, Math.ceil(height / GridRowHeight) + 1),
    }

    // Specify values for all grid params for all devices, and strip these CSS
    // variables from the styles being applied to the inner component, as we
    // want to apply these to the wrapper instead
    for (let param of Object.values(GridParams)) {
      let dVar = getGridVar(Devices.Desktop, param)
      let mVar = getGridVar(Devices.Mobile, param)
      vars[dVar] = styles[dVar] ?? styles[mVar] ?? defaults[param]
      vars[mVar] = styles[mVar] ?? styles[dVar] ?? defaults[param]
    }

    // Apply some overrides depending on component state
    if (errored) {
      vars[getGridVar(Devices.Desktop, GridParams.HAlign)] = "stretch"
      vars[getGridVar(Devices.Mobile, GridParams.HAlign)] = "stretch"
      vars[getGridVar(Devices.Desktop, GridParams.VAlign)] = "stretch"
      vars[getGridVar(Devices.Mobile, GridParams.VAlign)] = "stretch"
    }

    // Apply some metadata to data attributes to speed up lookups
    const addDataTag = (tagName: string, device: string, param: string) => {
      const val = `${vars[getGridVar(device, param)]}`
      if (node.dataset[tagName] !== val) {
        node.dataset[tagName] = val
      }
    }
    addDataTag("gridDesktopRowEnd", Devices.Desktop, GridParams.RowEnd)
    addDataTag("gridMobileRowEnd", Devices.Mobile, GridParams.RowEnd)
    addDataTag("gridDesktopHAlign", Devices.Desktop, GridParams.HAlign)
    addDataTag("gridMobileHAlign", Devices.Mobile, GridParams.HAlign)
    addDataTag("gridDesktopVAlign", Devices.Desktop, GridParams.VAlign)
    addDataTag("gridMobileVAlign", Devices.Mobile, GridParams.VAlign)
    if (node.dataset.insideGrid !== "true") {
      node.dataset.insideGrid = "true"
    }

    // Apply all CSS variables to the wrapper
    // @ts-expect-error TODO
    node.style = buildStyleString(vars)

    // Add a listener to select this node on click
    if (interactive) {
      node.addEventListener("click", selectComponent, false)
    }

    // Add draggable attribute
    node.setAttribute("draggable", (!!draggable).toString())
  }

  // Removes the previously set up listeners
  const removeListeners = () => {
    // By checking if this is defined we can avoid trying to remove event
    // listeners on every component
    if (selectComponent) {
      node.removeEventListener("click", selectComponent, false)
      selectComponent = null
    }
  }

  applyMetadata(metadata)

  return {
    update(newMetadata: GridMetadata) {
      removeListeners()
      applyMetadata(newMetadata)
    },
    destroy() {
      removeListeners()
    },
  }
}
