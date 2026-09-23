export interface PendingToolInsertion {
  from: number
  to: number
  removeOnCancel: boolean
}

export const getPendingToolInsertion = ({
  text,
  from,
  to,
}: {
  text: string
  from: number
  to: number
}): PendingToolInsertion => {
  const bindingPrefix = text.slice(0, from).match(/(?:\{){2,}\s*$/)?.[0]
  const rangeFrom = bindingPrefix ? from - bindingPrefix.length : from
  const rangeTo = text.slice(to, to + 2) === "}}" ? to + 2 : to

  return {
    from: rangeFrom,
    to: rangeTo,
    removeOnCancel: /^\{\{\s*\}\}$/.test(text.slice(rangeFrom, rangeTo)),
  }
}
