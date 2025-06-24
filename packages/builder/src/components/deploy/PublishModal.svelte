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

  const dispatcher = createEventDispatcher()

  $: automations = filterUnpublished(
    removeRowActionAutomations($automationStore.automations || []),
    $workspaceDeploymentStore.automations
  )
  $: apps = filterUnpublished(
    $workspaceAppStore.workspaceApps || [],
    $workspaceDeploymentStore.workspaceApps
  )
  $: findTarget(targetId, apps, automations)
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
    const preAutomations = automations, preApps = apps
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
  }

  function clearAll() {
    setAll(false)
  }
</script>

<Modal bind:this={publishModal}>
  <ModalContent
    size="M"
    title="Publish"
    confirmText="Publish"
    onConfirm={publish}
  >
    <Layout noPadding gap="XS">
      {#if !apps.length && !automations.length}
        <span>Nothing to publish.</span>
      {:else}
        <Body size="M" color="var(--spectrum-global-color-gray-900)"
          >Select the items you'd like to publish. Only apps and automations
          with unpublished changes are listed below.</Body
        >
        {#if apps.length}
          <div class="list-container">
            <Body
              size="M"
              color="var(--spectrum-global-color-gray-900)"
              weight="500"
              >Apps:
            </Body>
            {#each apps as app}
              {#if app._id}
                <Checkbox
                  size="L"
                  text={`${app.name}`}
                  bind:value={selectedApps[app._id]}
                />
              {/if}
            {/each}
          </div>
        {/if}
        {#if automations.length}
          <div class="list-container">
            <Body
              size="M"
              color="var(--spectrum-global-color-gray-900)"
              weight="500">Automations:</Body
            >
            {#each automations as automation}
              {#if automation._id}
                <Checkbox
                  size="L"
                  text={`${automation.name}`}
                  bind:value={selectedAutomations[automation._id]}
                />
              {/if}
            {/each}
          </div>
        {/if}
        {#if apps.length || automations.length}
          <div class="select-clear-buttons">
            <ActionButton noPadding quiet on:click={selectAll}
              >Select all</ActionButton
            >
            <ActionButton noPadding quiet on:click={clearAll}
              >Clear all</ActionButton
            >
          </div>
        {/if}
      {/if}
    </Layout>
  </ModalContent>
  <div class="accordion-footer">
    <Accordion
      header="Show everything that will be published"
      noPadding
      bold={false}
      headerSize="S"
    >
      {#if usedResources.length}
        <Body size="S"
          >Resources: {usedResources
            .map(resource => resource.name)
            .join(", ")}</Body
        >
      {/if}
      {#if selectedAppNames.length}
        <Body size="S">Apps: {selectedAppNames.join(", ")}</Body>
      {/if}
      {#if selectedAutomationNames.length}
        <Body size="S">Automations: {selectedAutomationNames.join(", ")}</Body>
      {/if}
    </Accordion>
  </div>
</Modal>

<style>
  .select-clear-buttons {
    display: flex;
    gap: var(--spacing-m);
    margin-bottom: 12px;
  }
  .list-container {
    display: flex;
    flex-direction: column;
    margin: 8px 0 0 0;
  }
  .accordion-footer {
    padding: 16px 52px;
    background-color: var(--spectrum-global-color-gray-200) !important;
  }
</style>
