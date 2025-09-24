<script lang="ts">
  import { API } from "@/api"
  import { appStore } from "@/stores/builder"
  import { appsStore } from "@/stores/portal/apps"
  import { Modal, ModalContent, Select } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { UsedResource } from "@budibase/types"

  export let resource: { id: string; name: string; type: "app" | "automation" }

  let modal: Modal
  export const show = () => modal.show()

  function onShow() {}

  async function onConfirm() {}

  let usedResource: UsedResource[] | undefined
  $: API.resource
    .searchForUsage({
      workspaceAppIds: resource.type === "app" ? [resource.id] : undefined,
      automationIds: resource.type === "automation" ? [resource.id] : undefined,
    })
    .then(res => {
      usedResource = res.resources
    })

  $: workspaces = $appsStore.apps.filter(
    a => a.devId !== sdk.applications.getDevAppID($appStore.appId)
  )
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
        {#each usedResource as resource}
          <div>{resource.name}</div>
        {/each}
      {/if}
    {/if}
  </ModalContent>
</Modal>

<style>
</style>
