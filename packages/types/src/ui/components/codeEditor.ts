interface JSEditorMode {
  name: "javascript"
  json: boolean
  match: RegExp
}

interface HBSEditorMode {
  name: "handlebars"
  base: "text/html"
  match: RegExp
}

interface HTMLEditorMode {
  name: "text/html"
}

interface PythonEditorMode {
  name: "python"
}

export type EditorMode = JSEditorMode | HBSEditorMode | HTMLEditorMode | PythonEditorMode

type EditorModeMapBase =
  | (JSEditorMode & { key: "JS" })
  | (HBSEditorMode & { key: "Handlebars" })
  | (HTMLEditorMode & { key: "Text" })
  | (PythonEditorMode & { key: "Python" })

export type EditorModesMap = {
  [M in EditorModeMapBase as M["key"]]: Omit<M, "key">
}
