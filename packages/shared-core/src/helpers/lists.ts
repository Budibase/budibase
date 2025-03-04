export function punctuateList(list: string[]) {
  if (list.length === 0) return ""
  if (list.length === 1) return list[0]
  if (list.length === 2) return list.join(" and ")
  return list.slice(0, -1).join(", ") + " and " + list[list.length - 1]
}
