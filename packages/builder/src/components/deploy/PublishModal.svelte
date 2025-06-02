<script lang="ts">
  import { Modal, ModalContent, Checkbox, Accordion, Layout } from "@budibase/bbui"
  import { workspaceAppStore, automationStore } from "@/stores/builder"
  import { onMount } from "svelte"

  export let targetId: string

  let publishModal: Modal
  let target: { type: "app" | "automation", id: string, name: string }
  let list: Record<string, boolean> = {}

  $: automations = $automationStore.automations
  $: apps = $workspaceAppStore.workspaceApps

  export function show() {
    publishModal.show()
  }

  export function hide() {
    publishModal.hide()
  }

  function publish() {

  }

  onMount(() => {
    const app = apps.find(app => app._id === targetId)
    if (app) {
      target = { type: "app", id: targetId, name: app.name }
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
    <Layout noPadding noGap>
      <Checkbox text={`${target.name} ${target.type}`} />
      <Accordion header="Publish multiple apps and automations" bold={false} />
      <Accordion header="Show everything that will be published" bold={false} />
    </Layout>
  </ModalContent>
</Modal>