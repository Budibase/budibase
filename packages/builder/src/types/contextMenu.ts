export interface MenuItem {
  iconColour?: string
  iconWeight?: "regular" | "bold" | "fill"
  icon?: string
  name: string
  keyBind?: string | null
  visible?: boolean
  disabled?: boolean
  callback: () => void
  isNew?: boolean
  tooltip?: string
}
