<script>
  import Provider from "./Provider.svelte"
  import { authStore } from "stores"
  import { ActionTypes, TableNames } from "constants"

  // Register this as a refreshable datasource so that user changes cause
  // the user object to be refreshed
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => authStore.actions.fetchUser(),
      metadata: { dataSource: { type: "table", tableId: TableNames.USERS } },
    },
  ]
</script>

<Provider key="user" data={$authStore} {actions}>
  <slot />
</Provider>
