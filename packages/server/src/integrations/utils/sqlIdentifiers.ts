export const quotePostgresIdentifier = (identifier: string) => {
  return `"${identifier.replaceAll(`"`, `""`)}"`
}
