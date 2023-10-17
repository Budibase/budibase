<script>
  import Provider from "./Provider.svelte"
  import { authStore, currentRole } from "stores"
  import { ActionTypes } from "constants"
  import { Constants } from "@budibase/frontend-core"

  // Register this as a refreshable datasource so that user changes cause
  // the user object to be refreshed
  $: actions = [
    {
      type: ActionTypes.RefreshDatasource,
      callback: () => authStore.actions.fetchUser(),
      metadata: {
        dataSource: { type: "table", tableId: Constants.TableNames.USERS },
      },
    },
  ]
</script>

<Provider key="user" data={{ ...$authStore, roleId: $currentRole }} {actions}>
  <slot />
</Provider>
