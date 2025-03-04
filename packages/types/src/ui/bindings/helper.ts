export interface Helper {
  label: string
  displayText: string
  example: string
  description: string
  args: any[]
  requiresBlock?: boolean
  allowsJs: boolean
}
