<script lang="ts">
  import { API } from "@/api"
  import { capitalise } from "@/helpers"
  import { appStore } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { Modal, ModalContent, notifications, Select } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { UsedResource } from "@budibase/types"
  import { ResourceType } from "@budibase/types"
  import { slide } from "svelte/transition"

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

  let errorMessage: string | undefined
  let resourcesToBeCopied:
    | Partial<Record<ResourceType, UsedResource[]>>
    | undefined

  $: {
    resourcesToBeCopied = undefined
    errorMessage = undefined
    if (toWorkspaceId) {
      API.resource
        .previewDuplicateResourceToWorkspace(resource.id, {
          toWorkspace: toWorkspaceId,
        })
        .then(res => {
          resourcesToBeCopied = res.body.toCopy
        })
        .catch(err => {
          if (err.status === 400) {
            errorMessage = err.message
            resourcesToBeCopied = {}
            return
          }
          notifications.error(err.message)
        })
    }
  }

  $: resourcesToBeCopiedCount = Object.values(
    resourcesToBeCopied || {}
  ).flatMap(r => r).length

  $: workspaces = $appsStore.apps
    .filter(a => a.devId !== sdk.applications.getDevAppID($appStore.appId))
    .sort((a, b) => a.name.localeCompare(b.name))

  $: disabled = !toWorkspaceId || !resourcesToBeCopied || !!errorMessage

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

  let confirmText: string | undefined
  $: confirmText = resourcesToBeCopiedCount
    ? `Copy ${resourcesToBeCopiedCount} resources`
    : "Copy"
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent
    title={`Copy ${resource.type}`}
    {onConfirm}
    size="M"
    {disabled}
    {confirmText}
  >
    {#if !workspaces.length}
      You don't have access to any other workspace
    {:else}
      <p class="workspace-selection-label">Select the destination workspace:</p>
      <Select
        bind:value={toWorkspaceId}
        options={workspaces}
        getOptionLabel={w => w.name.trim()}
        getOptionValue={w => w.devId}
        getOptionIcon={() => undefined}
      ></Select>

      {#if errorMessage}
        <div class="bbui-text-danger" transition:slide={{ duration: 150 }}>
          {errorMessage}
        </div>
      {:else if resourcesToBeCopied && resourcesToBeCopiedCount}
        <div class="resources-to-copy" transition:slide={{ duration: 150 }}>
          The following resources will be copied along the {resource.type}.
          {#each Object.entries(resourcesToBeCopied) as [type, resourcesToCopy] (type)}
            <div>
              <div>
                {getFriendlyName(type)}:
              </div>
              {#each resourcesToCopy as resourceToCopy (resourceToCopy.id)}
                <div>
                  - {resourceToCopy.name}
                </div>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </ModalContent>
</Modal>

<style>
  .bbui-text-danger {
    color: var(--bb-coral);
  }

  .workspace-selection-label {
    margin-bottom: var(--bb-spacing-xs);
  }

  .resources-to-copy {
    display: flex;
    flex-direction: column;
    gap: var(--bb-spacing-xs);
  }
</style>
