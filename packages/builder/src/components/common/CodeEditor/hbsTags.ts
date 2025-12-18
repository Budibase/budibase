import { FIND_ANY_HBS_REGEX } from "@budibase/string-templates"
import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view"

export class HbsTagWidget extends WidgetType {
  text: string
  icon?: string
  constructor(text: string, icon?: string) {
    super()
    this.text = text
    this.icon = icon
  }
  eq(other: HbsTagWidget) {
    return other.text === this.text && other.icon === this.icon
  }
  toDOM() {
    const tag = document.createElement("span")
    tag.className = "hbs-tag"
    if (this.icon) {
      const img = document.createElement("img")
      img.src = this.icon
      img.className = "hbs-tag__icon"
      img.alt = ""
      tag.appendChild(img)
    }
    const textNode = document.createElement("span")
    textNode.className = "hbs-tag__text"
    textNode.textContent = this.text
    tag.appendChild(textNode)
    return tag
  }
  ignoreEvent() {
    return false
  }
}

const buildHbsTagDecorations = (
  view: EditorView,
  bindingIcons: Record<string, string | undefined>
) => {
  const decos = []
  const regex = new RegExp(FIND_ANY_HBS_REGEX)

  // Get all cursor/selection positions to check if cursor is inside a binding
  const cursorPositions = view.state.selection.ranges.map(r => ({
    from: r.from,
    to: r.to,
  }))

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    let match: RegExpExecArray | null
    regex.lastIndex = 0
    while ((match = regex.exec(text))) {
      const start = from + match.index
      const end = start + match[0].length

      // Skip decoration if cursor is inside this binding range
      const cursorInside = cursorPositions.some(
        cursor => cursor.from > start && cursor.from < end
      )
      if (cursorInside) {
        continue
      }

      const clean = stripHbsDelimiters(match[0])
      const icon = bindingIcons?.[clean]
      const widget = new HbsTagWidget(clean, icon)
      decos.push(
        Decoration.replace({ widget, inclusive: true }).range(start, end)
      )
    }
  }
  return Decoration.set(decos, true)
}

export const hbsTagPlugin = (
  bindingIcons: Record<string, string | undefined>
) =>
  ViewPlugin.fromClass(
    class {
      decorations
      constructor(view: EditorView) {
        this.decorations = buildHbsTagDecorations(view, bindingIcons)
      }
      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet
        ) {
          this.decorations = buildHbsTagDecorations(update.view, bindingIcons)
        }
      }
    },
    {
      decorations: v => v.decorations,
      provide: plugin =>
        EditorView.atomicRanges.of(
          view => view.plugin(plugin)?.decorations || Decoration.none
        ),
    }
  )

const stripHbsDelimiters = (binding: string) =>
  binding
    .replace(/^\s*\{\{\{?/, "")
    .replace(/\}?\}\}\s*$/, "")
    .trim()
