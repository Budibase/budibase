<script lang="ts">
  import {
    Accordion,
    Body,
    Checkbox,
    Layout,
    Modal,
    ModalContent,
    ActionButton,
  } from "@budibase/bbui"
  import {
    automationStore,
    deploymentStore,
    workspaceAppStore,
    workspaceDeploymentStore,
  } from "@/stores/builder"
  import type {
    UsedResource,
    Automation,
    PublishStatusResource,
  } from "@budibase/types"
  import { ResourceType, AutomationEventType } from "@budibase/types"
  import { API } from "@/api"
  import { createEventDispatcher } from "svelte"

  type PossibleTarget = { _id?: string; name: string }

  export let targetId: string | undefined

  let publishModal: Modal
  let selectedApps: Record<string, boolean> = {}
  let selectedAutomations: Record<string, boolean> = {}
  let usedResources: UsedResource[] = []
  let appAccordion: any, automationAccordion: any

  const dispatcher = createEventDispatcher()

  $: automations = filterUnpublished(
    removeRowActionAutomations($automationStore.automations || []),
    $workspaceDeploymentStore.automations
  )
  $: apps = filterUnpublished(
    $workspaceAppStore.workspaceApps || [],
    $workspaceDeploymentStore.workspaceApps
  )
  $: target = findTarget(targetId, apps, automations)
  $: selectedAppNames = getSelectedNames(getSelectedIds(selectedApps), apps)
  $: selectedAutomationNames = getSelectedNames(
    getSelectedIds(selectedAutomations),
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
    let { resources } = await API.resource.searchForUsage({
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
    selectedIds: string[],
    items: { _id?: string; name: string }[]
  ) {
    return items
      .filter(item => selectedIds.find(id => id === item._id))
      .map(item => item.name)
  }

  function removeRowActionAutomations(automations: Automation[]) {
    return automations.filter(
      automation =>
        automation.definition.trigger.event !== AutomationEventType.ROW_ACTION
    )
  }

  function filterUnpublished<T extends { _id?: string }>(
    resources: T[],
    state: Record<string, PublishStatusResource>
  ): T[] {
    const filtered: T[] = []
    for (let resource of resources) {
      const status = state[resource._id!]
      if (!status || status.unpublishedChanges) {
        filtered.push(resource)
      }
    }
    return filtered
  }

  function findTarget(
    targetId: string | undefined,
    apps: PossibleTarget[],
    automations: PossibleTarget[]
  ) {
    if (!targetId) {
      return undefined
    }
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
    const preAutomations = automations,
      preApps = apps
    const toPublishAutomations = getSelectedIds(selectedAutomations),
      toPublishApps = getSelectedIds(selectedApps)
    await deploymentStore.publishApp({
      automationIds: toPublishAutomations,
      workspaceAppIds: toPublishApps,
    })
    const publishedAutomations = getSelectedNames(
        toPublishAutomations,
        preAutomations
      ),
      publishedApps = getSelectedNames(toPublishApps, preApps)
    dispatcher("success", { publishedAutomations, publishedApps })
  }

  function setAll(state: boolean) {
    for (const app of apps) {
      selectedApps[app._id!] = state
    }
    for (const automation of automations) {
      selectedAutomations[automation._id!] = state
    }
  }

  function selectAll() {
    setAll(true)
    if (appAccordion) {
      appAccordion.open()
    }
    if (automationAccordion) {
      automationAccordion.open()
    }
  }

  function clearAll() {
    setAll(false)
  }
</script>

<Modal bind:this={publishModal}>
  <ModalContent title="Publish" confirmText="Publish" onConfirm={publish}>
    <Layout noPadding gap="XS">
      {#if !apps.length && !automations.length}
        <span>Nothing to publish.</span>
      {:else}
        <span>Select the apps or automations you'd like to publish.</span>
        <div>
          {#if apps.length}
            <Accordion
              header="Apps"
              headerSize="M"
              noPadding
              initialOpen={target?.type === "app"}
              bold={false}
              bind:this={appAccordion}
            >
              {#each apps as app}
                {#if app._id}
                  <Checkbox
                    text={`${app.name}`}
                    bind:value={selectedApps[app._id]}
                  />
                {/if}
              {/each}
            </Accordion>
          {/if}
          {#if automations.length}
            <Accordion
              header="Automations"
              headerSize="M"
              noPadding
              initialOpen={target?.type === "automation"}
              bold={false}
              bind:this={automationAccordion}
            >
              {#each automations as automation}
                {#if automation._id}
                  <Checkbox
                    text={`${automation.name}`}
                    bind:value={selectedAutomations[automation._id]}
                  />
                {/if}
              {/each}
            </Accordion>
          {/if}
          {#if apps.length || automations.length}
            <div class="select-clear-buttons">
              <ActionButton quiet noPadding active on:click={selectAll}
                >Select all</ActionButton
              >
              <ActionButton quiet noPadding on:click={clearAll}
                >Clear all</ActionButton
              >
            </div>
          {/if}
          <Accordion
            header="Show everything that will be published"
            noPadding
            bold={false}
          >
            {#if usedResources.length}
              <Body size="XS"
                >Resources: {usedResources
                  .map(resource => resource.name)
                  .join(", ")}</Body
              >
            {/if}
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
      {/if}
    </Layout>
  </ModalContent>
</Modal>

<style>
  .select-clear-buttons {
    display: flex;
    padding-top: var(--spacing-m);
    gap: var(--spacing-l);
  }
</style>
