import { readable, get } from "svelte/store"
import {
  getDatasourceForProvider,
} from "builderStore/dataBinding"
import { currentAsset } from "builderStore"

const getDatasourceId = (componentInstance) => {
  const datasource = getDatasourceForProvider(get(currentAsset), componentInstance)
  return datasource?.resourceId || datasource?.tableId
};

export default getDatasourceId;
