<script lang="ts">
  import { API } from "@/api"
  import { capitalise } from "@/helpers"
  import { appStore } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { Modal, ModalContent, notifications, Select } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { UsedResource } from "@budibase/types"
  import { ResourceType } from "@budibase/types"

  export let resource: { id: string; name: string; type: "app" | "automation" }

  let modal: Modal
  export const show = () => modal.show()

  function onShow() {}

  let toWorkspaceId: string

  async function onConfirm() {
    try {
      await API.resource.duplicateResourceToWorkspace(resource.id, {
        toWorkspace: toWorkspaceId,
      })
      notifications.success(
        `${capitalise(resource.type)} duplicated correctly!`
      )
    } catch {
      notifications.error(`Error duplicating ${resource.type}`)
    }
  }

  let usedResource: UsedResource[] = []
  let existingResourcesInDestination: Set<string> | undefined
  $: API.resource
    .searchForUsage({
      workspaceAppIds: resource.type === "app" ? [resource.id] : undefined,
      automationIds: resource.type === "automation" ? [resource.id] : undefined,
    })
    .then(res => {
      usedResource = res.resources
    })

  $: {
    existingResourcesInDestination = undefined
    if (toWorkspaceId) {
      API.resource
        .previewDuplicateResourceToWorkspace(resource.id, {
          toWorkspace: toWorkspaceId,
        })
        .then(res => {
          existingResourcesInDestination = new Set(
            Object.entries(res.body.existing).flatMap(([_key, value]) => value)
          )
        })
    }
  }

  $: usedResourceByType = usedResource?.reduce<
    Partial<Record<ResourceType, UsedResource[]>>
  >((acc, resource) => {
    acc[resource.type] ??= []
    acc[resource.type]!.push(resource)
    return acc
  }, {})

  $: workspaces = $appsStore.apps.filter(
    a => a.devId !== sdk.applications.getDevAppID($appStore.appId)
  )

  $: disabled = !toWorkspaceId || !existingResourcesInDestination

  function getFriendlyName(type: string): string {
    const resourceTypeFriendlyName: Record<ResourceType, string> = {
      [ResourceType.DATASOURCE]: "Datasources",
      [ResourceType.TABLE]: "Tables",
      [ResourceType.ROW_ACTION]: "Row actions",
      [ResourceType.QUERY]: "Queries",
      [ResourceType.AUTOMATION]: "Automations",
      [ResourceType.WORKSPACE_APP]: "App",
    }

    return resourceTypeFriendlyName[type as ResourceType]
  }
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent title={`Copy ${resource.type}`} {onConfirm} size="M" {disabled}>
    {#if !workspaces.length}
      You don't have access to any other workspace
    {:else}
      Select the destination workspace:
      <Select
        bind:value={toWorkspaceId}
        options={workspaces}
        getOptionLabel={w => w.name.trim()}
        getOptionValue={w => w.devId}
        getOptionIcon={() => undefined}
      ></Select>

      {#if usedResource?.length}
        The following resources will be copied along the {resource.type}:
        {#each Object.entries(usedResourceByType) as [type, resources]}
          <div>
            <div>
              {getFriendlyName(type)}
            </div>
            {#each resources as resource}
              <div>
                - {resource.name}
                {#if existingResourcesInDestination?.has(resource.id)}
                  - existing ✅
                {:else if existingResourcesInDestination}
                  - to be copied ↩️
                {/if}
              </div>
            {/each}
          </div>
        {/each}
      {/if}
    {/if}
  </ModalContent>
</Modal>

<style>
</style>
