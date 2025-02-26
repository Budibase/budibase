export function punctuateList(list: string[]) {
  if (list.length === 0) return ""
  if (list.length === 1) return list[0]
  if (list.length === 2) return list.join(" and ")
  // For more than 2 elements: join all but the last with commas, then add "and" before the last element.
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1]
}
