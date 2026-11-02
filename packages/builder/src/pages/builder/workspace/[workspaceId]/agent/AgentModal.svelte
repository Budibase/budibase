<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import { workspaceStore } from "@/stores/builder"
  import { agentsStore, aiConfigsStore } from "@/stores/portal"
  import {
    Input,
    keepOpen,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { goto as gotoStore } from "@roxi/routify"
  import { onMount } from "svelte"
  import { MAX_RESOURCE_NAME_LENGTH } from "@budibase/types"

  $: goto = $gotoStore
  export let initialProjectIds: string[] = []

  export const show = () => {
    name = ""
    touched = false
    loading = false
    modal.show()
  }
  export const hide = () => {
    modal.hide()
  }

  let modal: Modal
  let modalContent: ModalContent
  let name = ""
  let touched = false
  let loading = false

  $: trimmedName = name.trim()
  const getNameError = ({
    name,
    touched,
  }: {
    name: string
    touched: boolean
  }) => {
    if (!touched) {
      return undefined
    }
    if (!name) {
      return "Name is required"
    }
    if (name.length > MAX_RESOURCE_NAME_LENGTH) {
      return `Name must be at most ${MAX_RESOURCE_NAME_LENGTH} characters`
    }
  }

  $: nameError = getNameError({ name: trimmedName, touched })

  async function createAgent() {
    if (loading) {
      return keepOpen
    }
    touched = true
    if (getNameError({ name: trimmedName, touched: true })) {
      return keepOpen
    }

    loading = true
    const workspaceId = $workspaceStore.appId
    try {
      const newAgent = await agentsStore.createAgent({
        name: trimmedName,
        live: false,
        projectIds: initialProjectIds.length ? initialProjectIds : undefined,
      })
      modal.hide()
      goto(`/builder/workspace/${workspaceId}/agent/${newAgent._id}/config`)
    } catch (error) {
      notifications.error(getErrorMessage(error) || "Error creating agent")
      return keepOpen
    } finally {
      loading = false
    }
  }

  onMount(() => {
    aiConfigsStore.fetch()
  })
</script>

<Modal bind:this={modal}>
  <ModalContent
    bind:this={modalContent}
    title={"New agent"}
    size="M"
    showConfirmButton
    showCancelButton
    showCloseIcon
    disabled={loading || !trimmedName}
    onConfirm={createAgent}
  >
    <div class="agent-form">
      <Input
        label="Name"
        bind:value={name}
        error={nameError}
        on:input={() => (touched = true)}
        on:enterkey={() => {
          if (loading || !trimmedName) {
            return
          }
          modalContent.confirm()
        }}
        placeholder="Support agent"
      />
    </div>
  </ModalContent>
</Modal>

<style>
  .agent-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
</style>
