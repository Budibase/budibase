interface JSEditorMode {
  name: "javascript"
  json: boolean
  match: RegExp
}

interface JSONEditorMode {
  name: "json"
}

interface HBSEditorMode {
  name: "handlebars"
  base: "text/html"
  match: RegExp
}

interface HTMLEditorMode {
  name: "text/html"
}

interface PureHTMLEditorMode {
  name: "html"
}

export type EditorMode =
  | JSEditorMode
  | HBSEditorMode
  | HTMLEditorMode
  | PureHTMLEditorMode
  | JSONEditorMode

type EditorModeMapBase =
  | (JSEditorMode & { key: "JS" })
  | (HBSEditorMode & { key: "Handlebars" })
  | (HTMLEditorMode & { key: "Text" })
  | (PureHTMLEditorMode & { key: "HTML" })
  | (JSONEditorMode & { key: "JSON" })

export type EditorModesMap = {
  [M in EditorModeMapBase as M["key"]]: Omit<M, "key">
}
