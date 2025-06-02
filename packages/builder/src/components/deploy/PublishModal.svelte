<script lang="ts">
  import { Modal, ModalContent, Checkbox, Accordion } from "@budibase/bbui"
  import { workspaceAppStore, automationStore } from "@/stores/builder"
  import { onMount } from "svelte"

  export let targetId: string

  let publishModal: Modal
  let target: { type: "application" | "automation", id: string, name: string }
  let list: Record<string, boolean> = {}

  $: automations = $automationStore.automations
  $: apps = $workspaceAppStore.workspaceApps

  function publish() {

  }

  onMount(() => {
    const app = apps.find(app => app._id === targetId)
    if (app) {
      target = { type: "application", id: targetId, name: app.name }
    }
    const automation = automations.find(automation => automation._id === targetId)
    if (automation) {
      target = { type: "automation", id: targetId, name: automation.name }
    }
  })
</script>

<Modal bind:this={publishModal}>
  <ModalContent
    title="Publish"
    confirmText="Revert"
    onConfirm={publish}
  >
    <span
    >Select the apps or automations you'd like to publish.</span
    >
    <Checkbox label={target.name} />
    <Accordion header="Publish multiple apps and automations" />
    <Accordion header="Show everything that will be published" />
  </ModalContent>
</Modal>