// Only one tool-call popover may be open at a time.
export const getNextActiveToolPopover = (
  activeToolId: string | null,
  toolId: string
): string | null => (activeToolId === toolId ? null : toolId)

export const isToolPopoverOpen = (
  activeToolId: string | null,
  toolId: string
): boolean => activeToolId === toolId
