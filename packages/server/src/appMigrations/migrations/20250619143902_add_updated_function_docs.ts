import { context, DesignDocuments, sql } from "@budibase/backend-core"

const migration = async () => {
  const db = context.getAppDB()
  if (!db.exists(DesignDocuments.UPDATE_FUNCTIONS)) {
    await db.put(sql.updateFunctionDoc())
  }
}

export default migration
