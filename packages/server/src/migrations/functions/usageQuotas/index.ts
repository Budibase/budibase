export const runQuotaMigration = async (migration: Function) => {
  await migration()
}
