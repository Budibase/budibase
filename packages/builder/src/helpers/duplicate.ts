/**
 * Duplicates a name with respect to a collection of existing names
 * e.g.
 *    name           all names          result
 *   ------        -----------         --------
 * ("foo")       ["foo"]              "foo 1"
 * ("foo")       ["foo", "foo 1"]     "foo 2"
 * ("foo 1")     ["foo", "foo 1"]     "foo 2"
 * ("foo")       ["foo", "foo 2"]     "foo 1"
 *
 * Repl
 */
export const duplicateName = (name: string, allNames: string[]) => {
  const duplicatePattern = new RegExp(`\\s(\\d+)$`)
  const baseName = name.split(duplicatePattern)[0]
  const isDuplicate = new RegExp(`${baseName}\\s(\\d+)$`)

  // get the sequence from matched names
  const sequence: number[] = []
  allNames.filter(n => {
    if (n === baseName) {
      return true
    }
    const match = n.match(isDuplicate)
    if (match) {
      sequence.push(parseInt(match[1]))
      return true
    }
    return false
  })
  sequence.sort((a, b) => a - b)
  // get the next number in the sequence
  let number
  if (sequence.length === 0) {
    number = 1
  } else {
    // get the next number in the sequence
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] !== i + 1) {
        number = i + 1
        break
      }
    }
    if (!number) {
      number = sequence.length + 1
    }
  }

  return `${baseName} ${number}`
}

/**
 * More flexible alternative to the above function, which handles getting the
 * next sequential name from an array of existing items while accounting for
 * any type of prefix, and being able to deeply retrieve that name from the
 * existing item array.
 *
 * Examples with a prefix of "foo":
 * [] => "foo"
 * ["foo"] => "foo2"
 * ["foo", "foo6"] => "foo7"
 *
 * Examples with a prefix of "foo " (space at the end):
 * [] => "foo"
 * ["foo"] => "foo 2"
 * ["foo", "foo 6"] => "foo 7"
 *
 * @param items the array of existing items
 * @param prefix the string prefix of each name, including any spaces desired
 * @param getName optional function to extract the name for an item, if not a
 *  flat array of strings
 */
export const getSequentialName = <T extends any>(
  items: T[] | null,
  prefix: string | null,
  {
    getName,
    numberFirstItem,
  }: {
    getName?: (item: T) => string
    numberFirstItem?: boolean
  } = {}
) => {
  if (!prefix?.length) {
    return null
  }
  const trimmedPrefix = prefix.trim()
  const firstName = numberFirstItem ? `${prefix}1` : trimmedPrefix
  if (!items?.length) {
    return firstName
  }
  let max = 0
  items.forEach(item => {
    const name = getName?.(item) ?? item
    if (typeof name !== "string" || !name.startsWith(trimmedPrefix)) {
      return
    }
    const split = name.split(trimmedPrefix)
    if (split.length !== 2) {
      return
    }
    if (split[1].trim() === "") {
      split[1] = "1"
    }
    const num = parseInt(split[1])
    if (num > max) {
      max = num
    }
  })
  return max === 0 ? firstName : `${prefix}${max + 1}`
}
