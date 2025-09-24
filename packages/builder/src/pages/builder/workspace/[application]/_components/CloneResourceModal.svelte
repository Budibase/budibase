<script lang="ts">
  import { API } from "@/api"
  import { appStore } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { Modal, ModalContent, Select } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { UsedResource } from "@budibase/types"
  import { ResourceType } from "@budibase/types"

  export let resource: { id: string; name: string; type: "app" | "automation" }

  let modal: Modal
  export const show = () => modal.show()

  function onShow() {}

  async function onConfirm() {}

  let usedResource: UsedResource[] = []
  $: API.resource
    .searchForUsage({
      workspaceAppIds: resource.type === "app" ? [resource.id] : undefined,
      automationIds: resource.type === "automation" ? [resource.id] : undefined,
    })
    .then(res => {
      usedResource = res.resources
    })

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

  function getFriendlyName(type: string): string {
    const resourceTypeFriendlyName: Record<ResourceType, string> = {
      [ResourceType.DATASOURCE]: "Datasources",
      [ResourceType.TABLE]: "Tables",
      [ResourceType.ROW_ACTION]: "Row actions",
      [ResourceType.QUERY]: "Queries",
      [ResourceType.AUTOMATION]: "Automations",
    }

    return resourceTypeFriendlyName[type as ResourceType]
  }
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent title={resource.name} {onConfirm} size="M">
    {#if !workspaces.length}
      You don't have access to any other workspace
    {:else}
      Select the destination workspace:
      <Select
        options={workspaces}
        getOptionLabel={w => w.name.trim()}
        getOptionValue={w => w.appId}
        getOptionIcon={() => undefined}
      ></Select>

      Are you sure to copy this {resource.type} to the new workspace?

      {#if usedResource?.length}
        The following resources will be copied:
        {#each Object.entries(usedResourceByType) as [type, resources]}
          <div>
            <div>
              {getFriendlyName(type)}
            </div>
            {#each resources as resource}
              <div>- {resource.name}</div>
            {/each}
          </div>
        {/each}
      {/if}
    {/if}
  </ModalContent>
</Modal>

<style>
</style>
