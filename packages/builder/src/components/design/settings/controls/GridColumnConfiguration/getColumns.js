import { writable } from "svelte/store"
import {
  getDatasourceForProvider,
  getSchemaForDatasource,
} from "builderStore/dataBinding"

const getColumnsStore = (columns) => {

  const sortableColumns = writable([]);
  const primaryColumn = writable(undefined);

};

export default getColumnsStore;
