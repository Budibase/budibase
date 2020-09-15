import { screenSlotComponent } from "./screenSlotComponent"

export const builtinLibName = "##builtin"

export const isScreenSlot = componentName => componentName === "##builtin/screenslot"

export const builtins = window => ({
  screenslot: screenSlotComponent(window),
})
