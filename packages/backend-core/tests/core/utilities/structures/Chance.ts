import Chance from "chance"

export default class CustomChance extends Chance {
  arrayOf<T>(
    generateFn: () => T,
    opts: { min?: number; max?: number } = {}
  ): T[] {
    const itemCount = this.integer({
      min: opts.min != null ? opts.min : 1,
      max: opts.max != null ? opts.max : 50,
    })

    const items = []
    for (let i = 0; i < itemCount; i++) {
      items.push(generateFn())
    }

    return items
  }
}
