import {
  Decoration,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view"
import { RangeSetBuilder } from "@codemirror/state"

// Matches the query string portion of a URL: ?key=value&key=value
const QUERY_STRING_RE = /[?&]([^=&#\s]*)(?:(=)([^&#\s]*))?/g
// Matches HBS binding ranges {{ ... }} so we can skip decorating inside them
const HBS_RE = /\{\{.*?\}\}/g

function buildHbsRanges(text: string): [number, number][] {
  const ranges: [number, number][] = []
  HBS_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = HBS_RE.exec(text))) {
    ranges.push([m.index, m.index + m[0].length])
  }
  return ranges
}

function overlapsHbs(
  start: number,
  end: number,
  hbsRanges: [number, number][]
): boolean {
  return hbsRanges.some(([hs, he]) => start < he && end > hs)
}

function buildParamDecorations(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>()

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    const hbsRanges = buildHbsRanges(text)
    QUERY_STRING_RE.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = QUERY_STRING_RE.exec(text))) {
      const base = from + match.index
      // ? or &
      if (!overlapsHbs(match.index, match.index + 1, hbsRanges)) {
        builder.add(base, base + 1, Decoration.mark({ class: "qs-sep" }))
      }
      // key
      if (match[1].length) {
        const ks = match.index + 1
        const ke = ks + match[1].length
        if (!overlapsHbs(ks, ke, hbsRanges)) {
          builder.add(
            base + 1,
            base + 1 + match[1].length,
            Decoration.mark({ class: "qs-key" })
          )
        }
      }
      // = and value
      if (match[2]) {
        const eqPos = base + 1 + match[1].length
        const eqIdx = match.index + 1 + match[1].length
        if (!overlapsHbs(eqIdx, eqIdx + 1, hbsRanges)) {
          builder.add(eqPos, eqPos + 1, Decoration.mark({ class: "qs-sep" }))
        }
        if (match[3]?.length) {
          const vs = eqIdx + 1
          const ve = vs + match[3].length
          if (!overlapsHbs(vs, ve, hbsRanges)) {
            builder.add(
              eqPos + 1,
              eqPos + 1 + match[3].length,
              Decoration.mark({ class: "qs-value" })
            )
          }
        }
      }
    }
  }

  return builder.finish()
}

export const urlParamHighlightPlugin = ViewPlugin.fromClass(
  class {
    decorations

    constructor(view: EditorView) {
      this.decorations = buildParamDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildParamDecorations(update.view)
      }
    }
  },
  { decorations: v => v.decorations }
)

export const urlParamHighlightTheme = EditorView.theme({
  ".qs-sep": {
    color: "var(--spectrum-alias-text-color-disabled)",
  },
  ".qs-key": {
    color: "var(--spectrum-global-color-gray-800)",
  },
  ".qs-value": {
    color: "var(--spectrum-alias-text-color)",
  },
})
