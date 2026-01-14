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

const className = {
  1: markdownClasses.h1,
  2: markdownClasses.h2,
  3: markdownClasses.h3,
}

type RangeAdjuster = (
  match: RegExpExecArray,
  baseStart: number,
  baseEnd: number
) => { start: number; end: number }

const processRegexMatches = (
  regex: RegExp,
  text: string,
  from: number,
  overlapsHbs: (start: number, end: number) => boolean,
  getClassName: (match: RegExpExecArray) => string,
  adjustRange?: RangeAdjuster
) => {
  const decorations = []
  regex.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text))) {
    const baseStart = from + match.index
    const baseEnd = baseStart + match[0].length
    const { start, end } = adjustRange
      ? adjustRange(match, baseStart, baseEnd)
      : { start: baseStart, end: baseEnd }

    if (overlapsHbs(start, end)) continue

    decorations.push(
      Decoration.mark({ class: getClassName(match) }).range(start, end)
    )
  }

  return decorations
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

    // Process headers: # H1, ## H2, ### H3 (at line start)
    decorations.push(
      ...processRegexMatches(
        /^(#{1,3})\s+(.+)$/gm,
        text,
        from,
        overlapsHbs,
        match => className[match[1].length as keyof typeof className]
      )
    )

    // Process inline code: `code`
    decorations.push(
      ...processRegexMatches(
        /`([^`\n]+)`/g,
        text,
        from,
        overlapsHbs,
        () => markdownClasses.inlineCode
      )
    )

    // Process bold: **text** or __text__
    decorations.push(
      ...processRegexMatches(
        /(\*\*|__)([^*_\n]+)\1/g,
        text,
        from,
        overlapsHbs,
        () => markdownClasses.bold
      )
    )

    // Process italic: *text* or _text_ (single markers, not double)
    // Avoid lookbehind so it works across browsers
    decorations.push(
      ...processRegexMatches(
        /(^|[^*])\*(?!\*)([^*\n]+)\*(?!\*)|(^|[^_])_(?!_)([^_\n]+)_(?!_)/g,
        text,
        from,
        overlapsHbs,
        () => markdownClasses.italic,
        (match, baseStart, baseEnd) => {
          const prefixLength = match[1]?.length || match[3]?.length || 0
          return {
            start: baseStart + prefixLength,
            end: baseEnd - prefixLength,
          }
        }
      )
    )

    // Process bullets: - item or * item (at line start with optional leading space)
    decorations.push(
      ...processRegexMatches(
        /^(\s*)([*-])\s/gm,
        text,
        from,
        overlapsHbs,
        () => markdownClasses.bullet,
        (match, baseStart) => {
          const bulletCharStart = baseStart + match[1].length
          return {
            start: bulletCharStart,
            end: bulletCharStart + 1,
          }
        }
      )
    )
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
