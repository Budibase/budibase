<script lang="ts">
  import {
    Accordion,
    Body,
    Checkbox,
    Heading,
    Layout,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import {
    automationStore,
    deploymentStore,
    workspaceAppStore,
  } from "@/stores/builder"
  import type { UsedResource } from "@budibase/types"
  import { ResourceType } from "@budibase/types"
  import { API } from "@/api"
  import { createEventDispatcher } from "svelte"

  type PossibleTarget = { _id?: string; name: string }

  export let targetId: string

  let publishModal: Modal
  let selectedApps: Record<string, boolean> = {}
  let selectedAutomations: Record<string, boolean> = {}
  let usedResources: UsedResource[] = []

  const dispatcher = createEventDispatcher()

  $: automations = $automationStore.automations
  $: filteredAutomations = removeTarget(automations)
  $: apps = $workspaceAppStore.workspaceApps
  $: filteredApps = removeTarget(apps)
  $: target = findTarget(targetId, apps, automations)
  $: selectedAppNames = getSelectedNames(selectedApps, apps)
  $: selectedAutomationNames = getSelectedNames(
    selectedAutomations,
    automations
  )
  $: getUsedResources(
    getSelectedIds(selectedApps),
    getSelectedIds(selectedAutomations)
  )

  export function show() {
    publishModal.show()
  }

  export function hide() {
    publishModal.hide()
  }

  async function getUsedResources(appIds: string[], automationIds: string[]) {
    if (!appIds.length && !automationIds.length) {
      return
    }
    let { resources } = await API.resource.analyse({
      automationIds: automationIds,
      workspaceAppIds: appIds,
    })
    // cut out the list of tables, these are internal, if any are present
    // we just say the "Budibase DB" will be deployed
    const table = resources.find(
      resource => resource.type === ResourceType.TABLE
    )
    if (table) {
      resources = [
        {
          ...table,
          id: "INTERNAL_DB",
          type: ResourceType.DATASOURCE,
          name: "Budibase DB",
        },
        ...resources,
      ]
    }
    usedResources = resources.filter(
      resource => resource.type === ResourceType.DATASOURCE
    )
  }

  function getSelectedIds(list: Record<string, boolean>) {
    return (
      Object.entries(list)
        .filter(([_, selected]) => selected)
        .map(([id]) => id) || []
    )
  }

  function getSelectedNames(
    list: Record<string, boolean>,
    items: { _id?: string; name: string }[]
  ) {
    const selectedIds = getSelectedIds(list)
    return items
      .filter(item => selectedIds.find(id => id === item._id))
      .map(item => item.name)
  }

  function removeTarget<T extends { _id?: string }>(list: T[]): T[] {
    return list?.filter(item => item._id !== targetId) || []
  }

  function findTarget(
    targetId: string,
    apps: PossibleTarget[],
    automations: PossibleTarget[]
  ) {
    // reset the list of selected if an app/automation added or target changes
    selectedApps = {}
    selectedAutomations = {}
    const app = apps?.find(app => app._id === targetId)
    if (app) {
      selectedApps[targetId] = true
      selectedApps = selectedApps
      return { type: "app", id: targetId, name: app.name }
    }
    const automation = automations?.find(
      automation => automation._id === targetId
    )
    if (automation) {
      selectedAutomations[targetId] = true
      selectedAutomations = selectedAutomations
      return { type: "automation", id: targetId, name: automation.name }
    }
  }

  async function publish() {
    const getIds = (list: Record<string, boolean>) =>
      Object.entries(list)
        .filter(([_, selected]) => selected)
        .map(([id]) => id)
    await deploymentStore.publishApp({
      automationIds: getIds(selectedAutomations),
      workspaceAppIds: getIds(selectedApps),
    })
    dispatcher("success")
  }
</script>

<Modal bind:this={publishModal}>
  <ModalContent title="Publish" confirmText="Publish" onConfirm={publish}>
    <Layout noPadding gap="XS">
      <span>Select the apps or automations you'd like to publish.</span>
      <div>
        {#if target?.type === "automation"}
          <Checkbox
            text={`${target.name} ${target.type}`}
            bind:value={selectedAutomations[targetId]}
          />
        {:else if target?.type === "app"}
          <Checkbox
            text={`${target.name} ${target.type}`}
            bind:value={selectedApps[targetId]}
          />
        {/if}
        <Accordion
          header="Publish multiple apps and automations"
          noPadding
          bold={false}
        >
          {#if filteredApps.length}
            <Heading size="XS">Apps</Heading>
            {#each filteredApps as app}
              {#if app._id}
                <Checkbox
                  text={`${app.name}`}
                  bind:value={selectedApps[app._id]}
                />
              {/if}
            {/each}
          {/if}
          <Heading size="XS">Automations</Heading>
          {#if filteredAutomations.length}
            {#each filteredAutomations as automation}
              {#if automation._id}
                <Checkbox
                  text={`${automation.name}`}
                  bind:value={selectedAutomations[automation._id]}
                />
              {/if}
            {/each}
          {/if}
        </Accordion>
        <Accordion
          header="Show everything that will be published"
          noPadding
          bold={false}
        >
          <Body size="XS"
            >Resources: {usedResources
              .map(resource => resource.name)
              .join(", ")}</Body
          >
          {#if selectedAppNames.length}
            <Body size="XS">Apps: {selectedAppNames.join(", ")}</Body>
          {/if}
          {#if selectedAutomationNames.length}
            <Body size="XS"
              >Automations: {selectedAutomationNames.join(", ")}</Body
            >
          {/if}
        </Accordion>
      </div>
    </Layout>
  </ModalContent>
</Modal>
