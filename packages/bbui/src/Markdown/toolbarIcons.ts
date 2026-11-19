interface ToolbarItem {
  name?: string
  className?: string
  icon?: string
  text?: string
}

interface ToolbarOptions {
  toolbar?: boolean | ReadonlyArray<string | ToolbarItem>
}

interface ToolbarEditor {
  toolbarElements?: Record<string, HTMLElement>
}

export const toolbarIcons: Record<string, string> = {
  bold: "text-b",
  italic: "text-italic",
  strikethrough: "text-strikethrough",
  heading: "text-h",
  "heading-smaller": "text-h",
  "heading-bigger": "text-h",
  "heading-1": "text-h",
  "heading-2": "text-h",
  "heading-3": "text-h",
  code: "code",
  quote: "quotes",
  "unordered-list": "list-bullets",
  "ordered-list": "list-numbers",
  "clean-block": "eraser",
  link: "link",
  image: "image",
  "upload-image": "image",
  table: "table",
  "horizontal-rule": "minus",
  "text-color": "text-aa",
  "text-highlight": "highlighter",
  preview: "eye",
  "side-by-side": "columns",
  fullscreen: "arrows-out",
  guide: "question",
  undo: "arrow-counter-clockwise",
  redo: "arrow-clockwise",
}

export const getCustomToolbarIconNames = (options: ToolbarOptions | null) => {
  if (!Array.isArray(options?.toolbar)) {
    return new Set<string>()
  }
  return new Set<string>(
    options.toolbar.flatMap(item => {
      if (
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        (item.className !== undefined ||
          item.icon !== undefined ||
          item.text !== undefined)
      ) {
        return [item.name]
      }
      return []
    })
  )
}

export const useLocalToolbarIcons = (
  editor: ToolbarEditor,
  customToolbarIconNames: Set<string>
) => {
  for (const [name, icon] of Object.entries(toolbarIcons)) {
    if (customToolbarIconNames.has(name)) {
      continue
    }
    const element =
      editor.toolbarElements?.[name]?.querySelector<HTMLElement>("i")
    if (element) {
      element.className = `ph ph-bold ph-${icon}`
    }
  }
}
