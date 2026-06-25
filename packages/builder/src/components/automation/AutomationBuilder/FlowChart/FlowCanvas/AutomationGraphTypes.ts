import type { AutomationBlock } from "@/types/automations"

export interface AutomationGraphItem {
  block: AutomationBlock
  previousBlock?: AutomationBlock
  index: number
  isTrigger: boolean
  isLast: boolean
}

export interface AutomationGraph {
  items: AutomationGraphItem[]
}

export interface AutomationLayoutItem extends AutomationGraphItem {
  y: number
}

export interface AutomationLayout {
  items: AutomationLayoutItem[]
}
