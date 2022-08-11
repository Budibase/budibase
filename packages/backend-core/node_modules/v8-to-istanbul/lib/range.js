/**
 * ...something resembling a binary search, to find the lowest line within the range.
 * And then you could break as soon as the line is longer than the range...
 */
module.exports.sliceRange = (lines, startCol, endCol, inclusive = false) => {
  let start = 0
  let end = lines.length - 1

  /**
   * I consider this a temporary solution until I find an alternaive way to fix the "off by one issue"
   */
  const extStartCol = inclusive ? startCol - 1 : startCol

  while (start < end) {
    const mid = (start + end) >> 1
    if (lines[mid].startCol <= startCol && lines[mid].endCol > extStartCol) {
      start = mid
      end = start
    } else if (lines[mid].startCol > startCol) {
      end = mid - 1
    } else {
      start = mid + 1
    }
  }
  if (start === end) {
    while (end < lines.length && extStartCol < lines[end].endCol && endCol >= lines[end].startCol) {
      ++end
    }
    return lines.slice(start, end)
  } else {
    return []
  }
}
