type EditorMode =
  | {
      key: "JS"
      name: "javascript"
      json: boolean
      match: RegExp
    }
  | {
      key: "Handlebars"
      name: "handlebars"
      base: "text/html"
      match: RegExp
    }
  | {
      key: "Text"
      name: "text/html"
    }

export type EditorModesMap = { [M in EditorMode as M["key"]]: Omit<M, "key"> }
