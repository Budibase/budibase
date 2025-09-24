<script lang="ts">
  import { API } from "@/api"
  import { Modal, ModalContent } from "@budibase/bbui"
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
</script>

<Modal bind:this={modal} on:show={onShow} on:hide>
  <ModalContent title={resource.name} {onConfirm} size="M">
    {#if usedResource}
      {#each usedResource as resource}
        {resource.name}
      {/each}
    {/if}
  </ModalContent>
</Modal>

<style>
</style>
