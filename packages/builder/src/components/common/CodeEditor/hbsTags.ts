import { FIND_ANY_HBS_REGEX } from "@budibase/string-templates"
import { StateEffect } from "@codemirror/state"
import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view"

export const bindingsChanged = StateEffect.define<void>()

const UNSUPPORTED_TOOL_TOOLTIP = "Tool is unsupported"
const UNSUPPORTED_TOOL_ICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="#e34850"><path d="M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z"/></svg>'
  )

export class HbsTagWidget extends WidgetType {
  text: string
  icon?: string
  invalid: boolean
  constructor(text: string, icon?: string, invalid = false) {
    super()
    this.text = text
    this.icon = invalid ? UNSUPPORTED_TOOL_ICON : icon
    this.invalid = invalid
  }
  eq(other: HbsTagWidget) {
    return (
      other.text === this.text &&
      other.icon === this.icon &&
      other.invalid === this.invalid
    )
  }
  toDOM() {
    const tag = document.createElement("span")
    tag.className = "hbs-tag"
    if (this.invalid) {
      tag.classList.add("hbs-tag--error")
      tag.title = UNSUPPORTED_TOOL_TOOLTIP
    }
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
  bindingIcons: Record<string, string | undefined>,
  validBindings?: Set<string>
) => {
  const decos = []
  const regex = new RegExp(FIND_ANY_HBS_REGEX)
  const isValidBinding = (binding: string) =>
    !validBindings || validBindings.size === 0 || validBindings.has(binding)

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
      const widget = new HbsTagWidget(clean, icon, !isValidBinding(clean))
      decos.push(
        Decoration.replace({ widget, inclusive: true }).range(start, end)
      )
    }
  }
  return Decoration.set(decos, true)
}

export const hbsTagPlugin = (
  bindingIcons: Record<string, string | undefined>,
  validBindings?: Set<string>
) =>
  ViewPlugin.fromClass(
    class {
      decorations
      constructor(view: EditorView) {
        this.decorations = buildHbsTagDecorations(
          view,
          bindingIcons,
          validBindings
        )
      }
      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          update.selectionSet ||
          update.transactions.some(tr =>
            tr.effects.some(effect => effect.is(bindingsChanged))
          )
        ) {
          this.decorations = buildHbsTagDecorations(
            update.view,
            bindingIcons,
            validBindings
          )
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

export const stripHbsDelimiters = (binding: string) =>
  binding
    .replace(/^\s*\{\{\{?/, "")
    .replace(/\}?\}\}\s*$/, "")
    .trim()
