import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view"
import { FIND_ANY_HBS_REGEX } from "@budibase/string-templates"
import { SecretTag } from "@budibase/types"
import { HbsTagWidget, stripHbsDelimiters } from "./hbsTags"

const SECRET_LABELS = new Set(Object.values(SecretTag).map(stripHbsDelimiters))

const isSecretLabel = (label: string) =>
  SECRET_LABELS.has(label) || label.startsWith("env.")

const buildSecretTagDecorations = (view: EditorView) => {
  const decos = []

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    const regex = new RegExp(FIND_ANY_HBS_REGEX)
    let match: RegExpExecArray | null
    while ((match = regex.exec(text))) {
      const label = stripHbsDelimiters(match[0])
      if (!isSecretLabel(label)) {
        continue
      }
      let start = from + match.index
      let end = start + match[0].length

      // When the tag is the entire JSON string value, swallow the quotes
      // around it so the badge does not render with orphaned quote marks.
      const before = view.state.doc.sliceString(start - 1, start)
      const after = view.state.doc.sliceString(end, end + 1)
      if (before === '"' && after === '"') {
        start -= 1
        end += 1
      }

      decos.push(
        Decoration.replace({
          widget: new HbsTagWidget(label),
          inclusive: true,
        }).range(start, end)
      )
    }
  }

  return Decoration.set(decos, true)
}

export const secretTagPlugin = ViewPlugin.fromClass(
  class {
    decorations

    constructor(view: EditorView) {
      this.decorations = buildSecretTagDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildSecretTagDecorations(update.view)
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
