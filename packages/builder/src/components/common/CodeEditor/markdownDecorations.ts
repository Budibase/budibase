import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view"
import type { DecorationSet } from "@codemirror/view"

// CSS classes for each markdown element
const markdownClasses = {
  h1: "md-header md-h1",
  h2: "md-header md-h2",
  h3: "md-header md-h3",
  inlineCode: "md-inline-code",
  bold: "md-bold",
  italic: "md-italic",
  bullet: "md-bullet",
}

const buildMarkdownDecorations = (view: EditorView): DecorationSet => {
  const decorations = []

  // Find all HBS binding ranges to avoid decorating inside them
  const hbsRanges: Array<{ from: number; to: number }> = []
  const hbsRegex = /\{\{[^}]*\}\}/g

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    let hbsMatch: RegExpExecArray | null
    hbsRegex.lastIndex = 0
    while ((hbsMatch = hbsRegex.exec(text))) {
      hbsRanges.push({
        from: from + hbsMatch.index,
        to: from + hbsMatch.index + hbsMatch[0].length,
      })
    }
  }

  const overlapsHbs = (start: number, end: number) =>
    hbsRanges.some(
      r =>
        (start >= r.from && start < r.to) ||
        (end > r.from && end <= r.to) ||
        (start <= r.from && end >= r.to)
    )

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    let match: RegExpExecArray | null

    // Process headers: # H1, ## H2, ### H3 (at line start)
    const headerRegex = /^(#{1,3})\s+(.+)$/gm
    headerRegex.lastIndex = 0
    while ((match = headerRegex.exec(text))) {
      const start = from + match.index
      const end = start + match[0].length
      if (overlapsHbs(start, end)) continue

      const level = match[1].length
      const className =
        level === 1
          ? markdownClasses.h1
          : level === 2
            ? markdownClasses.h2
            : markdownClasses.h3
      decorations.push(Decoration.mark({ class: className }).range(start, end))
    }

    // Process inline code: `code`
    const codeRegex = /`([^`\n]+)`/g
    codeRegex.lastIndex = 0
    while ((match = codeRegex.exec(text))) {
      const start = from + match.index
      const end = start + match[0].length
      if (overlapsHbs(start, end)) continue
      decorations.push(
        Decoration.mark({ class: markdownClasses.inlineCode }).range(start, end)
      )
    }

    // Process bold: **text** or __text__
    const boldRegex = /(\*\*|__)([^*_\n]+)\1/g
    boldRegex.lastIndex = 0
    while ((match = boldRegex.exec(text))) {
      const start = from + match.index
      const end = start + match[0].length
      if (overlapsHbs(start, end)) continue
      decorations.push(
        Decoration.mark({ class: markdownClasses.bold }).range(start, end)
      )
    }

    // Process italic: *text* or _text_ (single markers, not double)
    // Avoid lookbehind so it works across browsers
    const italicRegex =
      /(^|[^*])\*(?!\*)([^*\n]+)\*(?!\*)|(^|[^_])_(?!_)([^_\n]+)_(?!_)/g
    italicRegex.lastIndex = 0
    while ((match = italicRegex.exec(text))) {
      const prefixLength = match[1]?.length || match[3]?.length || 0
      const start = from + match.index + prefixLength
      const end = start + match[0].length - prefixLength
      if (overlapsHbs(start, end)) continue
      decorations.push(
        Decoration.mark({ class: markdownClasses.italic }).range(start, end)
      )
    }

    // Process bullets: - item or * item (at line start with optional leading space)
    const bulletRegex = /^(\s*)([*-])\s/gm
    bulletRegex.lastIndex = 0
    while ((match = bulletRegex.exec(text))) {
      const bulletCharStart = from + match.index + match[1].length
      const bulletCharEnd = bulletCharStart + 1
      if (overlapsHbs(bulletCharStart, bulletCharEnd)) continue
      decorations.push(
        Decoration.mark({ class: markdownClasses.bullet }).range(
          bulletCharStart,
          bulletCharEnd
        )
      )
    }
  }

  // Sort decorations by start position (required by CodeMirror)
  decorations.sort((a, b) => a.from - b.from || a.to - b.to)

  return Decoration.set(decorations)
}

export const markdownDecorationPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = buildMarkdownDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildMarkdownDecorations(update.view)
      }
    }
  },
  {
    decorations: v => v.decorations,
  }
)
