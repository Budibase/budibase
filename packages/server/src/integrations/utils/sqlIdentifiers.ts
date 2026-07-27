export const quotePostgresIdentifier = (identifier: string) => {
  return `"${identifier.replaceAll(`"`, `""`)}"`
}

export const quoteOracleIdentifier = (identifier: string) => {
  return `"${identifier.replaceAll(`"`, `""`)}"`
}

export const quoteMySqlIdentifier = (identifier: string) => {
  return `\`${identifier.replaceAll("`", "``")}\``
}

export const quoteSqlServerIdentifier = (identifier: string) => {
  return `[${identifier.replaceAll("]", "]]")}]`
}
