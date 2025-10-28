export interface ComponentPayload {
  componentId: string
  type: "Button" | "Form" | "MultiButton"
  props: Record<string, unknown>
  children?: { type: string; props: Record<string, unknown> }[]
}
