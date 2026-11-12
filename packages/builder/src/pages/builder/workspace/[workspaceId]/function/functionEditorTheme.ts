import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import type { Extension } from "@codemirror/state"
import {
  color as oneDarkColors,
  oneDark,
  oneDarkHighlightStyle,
} from "@codemirror/theme-one-dark"
import { EditorView } from "@codemirror/view"
import { tags } from "@lezer/highlight"

const lightSyntaxColors: Record<string, string> = {
  [oneDarkColors.coral]: "#d63e4a",
  [oneDarkColors.violet]: "#b146d1",
  [oneDarkColors.malibu]: "#1579cc",
  [oneDarkColors.whiskey]: "#a56932",
  [oneDarkColors.chalky]: "#9a6f1e",
  [oneDarkColors.cyan]: "#32818b",
  [oneDarkColors.stone]: "#6d778b",
  [oneDarkColors.sage]: "#58813a",
  [oneDarkColors.ivory]: "#6c778d",
  [oneDarkColors.invalid]: "#767676",
}

const lightHighlightStyle = HighlightStyle.define([
  ...oneDarkHighlightStyle.specs.map(spec => ({
    ...spec,
    color: spec.color ? lightSyntaxColors[spec.color] : undefined,
  })),
  { tag: tags.definition(tags.name), color: "#4b5563" },
  { tag: [tags.modifier, tags.typeName], color: "#8a5a1e" },
])

const lightSelectionTheme = EditorView.theme({
  ".cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":
    {
      backgroundColor: "#eeecf8",
    },
})

const darkCompletionTheme = EditorView.theme({
  ".cm-tooltip-autocomplete": {
    backgroundColor: oneDarkColors.highlightBackground,
    color: oneDarkColors.ivory,
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    backgroundColor: oneDarkColors.tooltipBackground,
    color: "#ffffff",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected] .cm-completionIcon": {
    opacity: "1",
  },
})

export const getFunctionEditorTheme = ({
  isDark,
}: {
  isDark: boolean
}): Extension[] => [
  syntaxHighlighting(isDark ? oneDarkHighlightStyle : lightHighlightStyle, {
    fallback: true,
  }),
  ...(isDark ? [darkCompletionTheme, oneDark] : [lightSelectionTheme]),
]
