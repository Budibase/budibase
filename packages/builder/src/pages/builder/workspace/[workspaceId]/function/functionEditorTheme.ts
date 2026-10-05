import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import type { Extension } from "@codemirror/state"
import {
  color as oneDarkColors,
  oneDark,
  oneDarkHighlightStyle,
} from "@codemirror/theme-one-dark"
import { EditorView } from "@codemirror/view"
import { tags } from "@lezer/highlight"

const lightHighlightStyle = HighlightStyle.define([
  ...oneDarkHighlightStyle.specs,
  { tag: tags.definition(tags.name), color: "#4b5563" },
  { tag: [tags.modifier, tags.typeName], color: "#8a5a1e" },
])

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
  ...(isDark ? [darkCompletionTheme, oneDark] : []),
]
