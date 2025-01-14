export interface BindingCompletion {
  section: {
    name: string
  }
  label: string
}

export interface EnrichedBinding {
  runtimeBinding: string
  readableBinding: string
  type?: null | string
}

export enum BindingMode {
  Text = "Text",
  JavaScript = "JavaScript",
}
