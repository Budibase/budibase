export const runQuotaMigration = async (migration: () => Promise<void>) => {
  await migration()
}
