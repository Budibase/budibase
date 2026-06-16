export const quotePostgresIdentifier = (identifier: string) => {
  return `"${identifier.replaceAll(`"`, `""`)}"`
}

export const quoteMySqlIdentifier = (identifier: string) => {
  return `\`${identifier.replaceAll("`", "``")}\``
}
