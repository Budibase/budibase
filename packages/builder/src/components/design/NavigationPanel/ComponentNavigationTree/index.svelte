<script>
  import { store, selectedAccessRole } from "builderStore"
  import PathTree from "./PathTree.svelte"

  let routes = {}
  let paths = []

  $: allRoutes = $store.routes
  $: selectedScreenId = $store.selectedScreenId
  $: updatePaths(allRoutes, $selectedAccessRole, selectedScreenId)

  const updatePaths = (allRoutes, selectedRoleId, selectedScreenId) => {
    const sortedPaths = Object.keys(allRoutes || {}).sort()

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
    routes = { ...filteredRoutes }
    paths = Object.keys(routes || {}).sort()

    // Select the correct role for the current screen ID
    if (!found && screenRoleId) {
      selectedAccessRole.set(screenRoleId)
      if (screenRoleId !== selectedRoleId) {
        updatePaths(allRoutes, screenRoleId, selectedScreenId)
      }
    }

    // If the selected screen isn't in this filtered list, select the first one
    else if (!found && firstValidScreenId) {
      store.actions.screens.select(firstValidScreenId)
    }
  }
</script>

<div class="root" class:has-screens={!!paths?.length}>
  {#each paths as path, idx (path)}
    <PathTree border={idx > 0} {path} route={routes[path]} />
  {/each}
  {#if !paths.length}
    <div class="empty">
      There aren't any screens configured with this access role.
    </div>
  {/if}
</div>

<style>
  .root.has-screens {
    min-width: max-content;
  }
  div.empty {
    font-size: var(--font-size-s);
    color: var(--grey-5);
    padding: var(--spacing-xs) var(--spacing-xl);
  }
</style>
