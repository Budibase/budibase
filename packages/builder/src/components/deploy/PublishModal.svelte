<script lang="ts">
  import { Modal, ModalContent, Checkbox, Accordion, Layout, Heading, Body } from "@budibase/bbui"
  import { workspaceAppStore, automationStore } from "@/stores/builder"
  import { onMount } from "svelte"

  export let targetId: string

  let publishModal: Modal
  let target: { type: "app" | "automation", id: string, name: string } | undefined
  let selectedApps: Record<string, boolean> = {}
  let selectedAutomations: Record<string, boolean> = {}

  $: automations = $automationStore.automations
  $: filteredAutomations = removeTarget(automations)
  $: apps = $workspaceAppStore.workspaceApps
  $: filteredApps = removeTarget(apps)
  $: selectedAppNames = getSelectedNames(selectedApps, apps)
  $: selectedAutomationNames = getSelectedNames(selectedAutomations, automations)

  export function show() {
    publishModal.show()
  }

  export function hide() {
    publishModal.hide()
  }

  function getSelectedNames(list: Record<string, boolean>, items: { _id?: string, name: string }[]) {
    const selectedIds = Object.entries(list).filter(([_, selected]) => selected).map(([id]) => id)
    return items.filter(item => selectedIds.find(id => id === item._id)).map(item => item.name)
  }

  function removeTarget<T extends { _id?: string }>(list: T[]): T[] {
    return list?.filter(item => item._id !== targetId) || []
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
    <Layout noPadding gap="XS">
      <span
      >Select the apps or automations you'd like to publish.</span
      >
      <div>
        {#if target?.type === "automation"}
          <Checkbox text={`${target.name} ${target.type}`} bind:value={selectedAutomations[targetId]} />
        {:else if target?.type === "app"}
          <Checkbox text={`${target.name} ${target.type}`} bind:value={selectedApps[targetId]} />
        {/if}
        <Accordion header="Publish multiple apps and automations" noPadding bold={false}>
          {#if filteredApps.length}
            <Heading size="XS">Apps</Heading>
            {#each filteredApps as app}
              {#if app._id}
                <Checkbox text={`${app.name} app`} bind:value={selectedApps[app._id]} />
              {/if}
            {/each}
          {/if}
          <Heading size="XS">Automations</Heading>
          {#if filteredAutomations.length}
            {#each filteredAutomations as automation}
              {#if automation._id}
                <Checkbox text={`${automation.name}`} bind:value={selectedAutomations[automation._id]} />
              {/if}
            {/each}
          {/if}
        </Accordion>
        <Accordion header="Show everything that will be published" noPadding bold={false}>
          <Body size="XS">Resources: Budibase DB, PostgreSQL DB, REST API, REST API 2, REST API 3, REST API 4, REST API 5.</Body>
          {#if selectedAppNames.length}
            <Body size="XS">Apps: {selectedAppNames.join(", ")}</Body>
          {/if}
          {#if selectedAutomationNames.length}
            <Body size="XS">Automations: {selectedAutomationNames.join(", ")}</Body>
          {/if}
        </Accordion>
      </div>
    </Layout>
  </ModalContent>
</Modal>