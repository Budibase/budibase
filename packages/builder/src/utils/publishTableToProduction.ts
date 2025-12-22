import { API } from "@/api"
import { deploymentStore } from "@/stores/builder"

export const publishTableToProduction = async (
  tableId: string,
  seedProductionTables: boolean
) => {
  await API.publishTable(tableId, { seedProductionTables })
  await deploymentStore.completePublish()
}
