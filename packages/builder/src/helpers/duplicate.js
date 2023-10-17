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
export const duplicateName = (name, allNames) => {
  const duplicatePattern = new RegExp(`\\s(\\d+)$`)
  const baseName = name.split(duplicatePattern)[0]
  const isDuplicate = new RegExp(`${baseName}\\s(\\d+)$`)

  // get the sequence from matched names
  const sequence = []
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
