<script>
  import { store, selectedAccessRole } from "builderStore"
  import PathTree from "./PathTree.svelte"

  let routes = {}
  $: paths = Object.keys(routes || {}).sort()

  $: {
    const allRoutes = $store.routes
    const sortedPaths = Object.keys(allRoutes).sort()
    const selectedRoleId = $selectedAccessRole
    const selectedScreenId = $store.selectedScreenId

    let found = false
    let firstValidScreenId
    let filteredRoutes = {}
    let screenRoleId

    // Filter all routes down to only those which match the current role
    sortedPaths.forEach(path => {
      const config = allRoutes[path]
      Object.entries(config.subpaths).forEach(([subpath, pathConfig]) => {
        Object.entries(pathConfig.screens).forEach(([roleId, screenId]) => {
          if (screenId === selectedScreenId) {
            screenRoleId = roleId
            found = roleId === selectedRoleId
          }
          if (roleId === selectedRoleId) {
            if (!firstValidScreenId) {
              firstValidScreenId = screenId
            }
            if (!filteredRoutes[path]) {
              filteredRoutes[path] = { subpaths: {} }
            }
            filteredRoutes[path].subpaths[subpath] = {
              screens: {
                [selectedRoleId]: screenId,
              },
            }
          }
        })
      })
    })
    routes = filteredRoutes

    // Select the correct role for the current screen ID
    if (!found && screenRoleId) {
      selectedAccessRole.set(screenRoleId)
    }

    // If the selected screen isn't in this filtered list, select the first one
    else if (!found && firstValidScreenId) {
      store.actions.screens.select(firstValidScreenId)
    }
  }
</script>

<div class="root">
  {#each paths as path, idx}
    <PathTree border={idx > 0} {path} route={routes[path]} />
  {/each}

  {#if !paths.length}
    <div class="empty">
      There aren't any screens configured with this access role.
    </div>
  {/if}
</div>

<style>
  div.empty {
    font-size: var(--font-size-xs);
    color: var(--grey-5);
    padding-top: var(--spacing-xs);
  }
</style>
