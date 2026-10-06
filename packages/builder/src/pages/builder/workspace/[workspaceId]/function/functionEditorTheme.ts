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

const completionTheme = EditorView.theme({
  ".cm-tooltip-autocomplete": {
    width: "min(440px, 90vw)",
  },
  ".cm-tooltip-autocomplete > ul": {
    minWidth: "0",
    maxWidth: "100%",
  },
  ".cm-tooltip-autocomplete > ul > li": {
    display: "flex",
    alignItems: "center",
    padding: "3px 6px",
  },
  ".cm-completionLabel": {
    minWidth: "0",
    maxWidth: "55%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  ".cm-completionDetail": {
    marginLeft: "auto",
    paddingLeft: "12px",
    minWidth: "0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontStyle: "normal",
    fontSize: "0.85em",
    opacity: "0.75",
  },
  ".cm-tooltip-autocomplete .cm-completionInfo": {
    position: "static",
    width: "100%",
    maxWidth: "none",
    maxHeight: "8em",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    border: "none",
    borderTop: "1px solid rgba(128, 128, 128, 0.3)",
    padding: "8px 10px",
    fontFamily: "inherit",
    fontSize: "12px",
    lineHeight: "1.5",
    backgroundColor: "inherit",
    color: "inherit",
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
  completionTheme,
  syntaxHighlighting(isDark ? oneDarkHighlightStyle : lightHighlightStyle, {
    fallback: true,
  }),
  ...(isDark ? [darkCompletionTheme, oneDark] : [lightSelectionTheme]),
]
