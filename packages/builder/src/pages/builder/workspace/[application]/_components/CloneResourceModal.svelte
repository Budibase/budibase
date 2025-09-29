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

  let resourcesToBeCopied:
    | Partial<Record<ResourceType, UsedResource[]>>
    | undefined

  $: {
    resourcesToBeCopied = undefined
    if (toWorkspaceId) {
      API.resource
        .previewDuplicateResourceToWorkspace(resource.id, {
          toWorkspace: toWorkspaceId,
        })
        .then(res => {
          resourcesToBeCopied = res.body.toCopy
        })
    }
  }

  $: workspaces = $appsStore.apps.filter(
    a => a.devId !== sdk.applications.getDevAppID($appStore.appId)
  )

  $: disabled = !toWorkspaceId || !resourcesToBeCopied

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

      {#if resourcesToBeCopied && Object.keys(resourcesToBeCopied).length}
        The following resources will be copied along the {resource.type}:
        {#each Object.entries(resourcesToBeCopied) as [type, resourcesToCopy]}
          <div>
            <div>
              {getFriendlyName(type)}
            </div>
            {#each resourcesToCopy as resourceToCopy}
              <div>
                - {resourceToCopy.name}
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
