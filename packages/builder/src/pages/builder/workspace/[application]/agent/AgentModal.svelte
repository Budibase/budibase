<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import { appStore } from "@/stores/builder"
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
  $: nameError = touched && !trimmedName ? "Name is required" : undefined

  async function createAgent() {
    if (loading) {
      return keepOpen
    }
    touched = true
    if (!trimmedName) {
      return keepOpen
    }

    loading = true
    const workspaceId = $appStore.appId
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

  let isOpen = false

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === "Enter") {
      const activeEl = document.activeElement
      if (activeEl && activeEl.tagName === "INPUT") {
        if (loading || !trimmedName) {
          return
        }
        modalContent.confirm()
      }
    }
  }

  onMount(() => {
    aiConfigsStore.fetch()
  })
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal
  bind:this={modal}
  on:show={() => (isOpen = true)}
  on:hide={() => (isOpen = false)}
>
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
