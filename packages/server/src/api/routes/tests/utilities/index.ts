export * as structures from "../../../../tests/utilities/structures"

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
