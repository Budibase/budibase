<script lang="ts">
  import { API } from "@/api"
  import {
    appStore,
    automationStore,
    datasources,
    queries,
    rowActions,
    tables,
    workspaceAppStore,
  } from "@/stores/builder"
  import { appsStore } from "@/stores/portal"
  import {
    Modal,
    ModalContent,
    notifications,
    Select,
    Table,
  } from "@budibase/bbui"
  import { sdk } from "@budibase/shared-core"
  import type { AnyDocument, UsedResource } from "@budibase/types"
  import { ResourceType } from "@budibase/types"

  let modal: Modal
  let isOpen = false

  export const show = () => {
    isOpen = true
    toWorkspaceId = undefined
    selectedResources = {
      [ResourceType.DATASOURCE]: [],
      [ResourceType.TABLE]: [],
      [ResourceType.ROW_ACTION]: [],
      [ResourceType.QUERY]: [],
      [ResourceType.AUTOMATION]: [],
      [ResourceType.WORKSPACE_APP]: [],
    }
    modal.show()
  }

  interface DataType {
    _id: string
    name: string
    direct: boolean
    __disabled: boolean
  }

  let toWorkspaceId: string | undefined

  let selectedResources: Record<ResourceType, DataType[]> = {
    [ResourceType.DATASOURCE]: [],
    [ResourceType.TABLE]: [],
    [ResourceType.ROW_ACTION]: [],
    [ResourceType.QUERY]: [],
    [ResourceType.AUTOMATION]: [],
    [ResourceType.WORKSPACE_APP]: [],
  }

  $: workspaces = $appsStore.apps
    .filter(a => a.devId !== sdk.applications.getDevAppID($appStore.appId))
    .sort((a, b) => a.name.localeCompare(b.name))

  function onShow() {}

  async function onConfirm() {
    await API.resource
      .duplicateResourceToWorkspace({
        resources: resourcesToBeCopied.map(r => r._id),
        toWorkspace: toWorkspaceId!,
      })
      .then(() => {
        notifications.success("Resources copied successfully")
        isOpen = false
        modal.hide()
      })
      .catch(err => {
        notifications.error(err.message)
      })
  }

  let dependantResources: Record<
    string,
    Partial<Record<ResourceType, UsedResource[]>>
  > = {}

  const mapToDataType = (d: AnyDocument): DataType => ({
    _id: d._id!,
    name: d.name,
    direct: true,
    __disabled: false,
  })

  $: $tables.list.forEach(t => rowActions.refreshRowActions(t._id!))

  let resourceTypesToDisplay: {
    [K in ResourceType]: {
      displayName: string
      type: K
      data: DataType[]
    }
  }
  $: resourceTypesToDisplay = {
    [ResourceType.WORKSPACE_APP]: {
      displayName: "Apps",
      data: $workspaceAppStore.workspaceApps.map(mapToDataType),
      type: ResourceType.WORKSPACE_APP,
    },
    [ResourceType.TABLE]: {
      displayName: "BB tables",
      data: $tables.list.map(mapToDataType),
      type: ResourceType.TABLE,
    },
    [ResourceType.DATASOURCE]: {
      displayName: "Datasources",
      data: $datasources.list.map(mapToDataType),
      type: ResourceType.DATASOURCE,
    },
    [ResourceType.AUTOMATION]: {
      displayName: "Automations",
      data: $automationStore.automations.map(mapToDataType),
      type: ResourceType.AUTOMATION,
    },
    [ResourceType.QUERY]: {
      displayName: "Queries",
      data: $queries.list.map(mapToDataType),
      type: ResourceType.QUERY,
    },
    [ResourceType.ROW_ACTION]: {
      displayName: "Row actions",
      data: [],
      type: ResourceType.ROW_ACTION,
    },
  }

  $: isOpen &&
    resourceTypesToDisplay[ResourceType.WORKSPACE_APP]?.data.forEach(app => {
      API.resource
        .searchForUsage({ workspaceAppIds: [app._id!] })
        .then(res => {
          dependantResources[app._id!] = res.resources.reduce<
            Partial<Record<ResourceType, UsedResource[]>>
          >((acc, value) => {
            acc[value.type] = [...(acc[value.type] || []), value]
            return acc
          }, {})
        })
        .catch(err => {
          notifications.error(err.message)
        })
    })

  $: isOpen &&
    resourceTypesToDisplay[ResourceType.AUTOMATION]?.data.forEach(
      automation => {
        API.resource
          .searchForUsage({ automationIds: [automation._id!] })
          .then(res => {
            dependantResources[automation._id!] = res.resources.reduce<
              Partial<Record<ResourceType, UsedResource[]>>
            >((acc, value) => {
              acc[value.type] = [...(acc[value.type] || []), value]
              return acc
            }, {})
          })
          .catch(err => {
            notifications.error(err.message)
          })
      }
    )

  function calculateDependants(
    selectedId: string[],
    dependantResources: Record<
      string,
      Partial<Record<ResourceType, UsedResource[]>>
    >
  ) {
    for (const type of Object.keys(selectedResources)) {
      const castedType = type as keyof typeof selectedResources
      selectedResources[castedType] = selectedResources[castedType].filter(
        x => x.direct
      )
    }
    for (const id of selectedId) {
      if (!dependantResources[id]) {
        continue
      }
      for (const [type, resources] of Object.entries(dependantResources[id])) {
        const castedType = type as ResourceType
        for (const app of resources) {
          if (selectedResources[castedType].find(x => x._id === id)) {
            continue
          }
          selectedResources[castedType].push({
            _id: app.id,
            name: app.name,
            direct: false,
            __disabled: true,
          })
        }
      }
    }

    for (const type of Object.keys(selectedResources)) {
      const castedType = type as ResourceType
      const undirectlySelected = new Set(
        selectedResources[castedType].filter(x => !x.direct).map(x => x._id)
      )

      if (resourceTypesToDisplay[castedType]?.data.length) {
        resourceTypesToDisplay[castedType].data = resourceTypesToDisplay[
          castedType
        ].data.map(x => ({ ...x, __disabled: undirectlySelected.has(x._id) }))
      }
    }
  }

  $: calculateDependants(
    Object.values(selectedResources)
      .flatMap(x => x)
      .filter(x => x.direct)
      .map(a => a._id),
    dependantResources
  )

  $: resourcesToBeCopied = Object.values(selectedResources).flatMap(x => x)
  $: resourcesToBeCopiedCount = resourcesToBeCopied.length

  $: disabled = !resourcesToBeCopiedCount || !toWorkspaceId

  let confirmText: string | undefined
  $: confirmText = resourcesToBeCopiedCount
    ? `Copy ${resourcesToBeCopiedCount} resources`
    : "Copy"
</script>

<Modal
  bind:this={modal}
  on:show={onShow}
  on:hide
  on:hide={() => {
    isOpen = false
  }}
>
  <ModalContent
    title={`Copy resources`}
    {onConfirm}
    size="M"
    {disabled}
    {confirmText}
  >
    <p class="workspace-selection-label">Select the destination workspace:</p>
    <Select
      bind:value={toWorkspaceId}
      options={workspaces}
      getOptionLabel={w => w.name.trim()}
      getOptionValue={w => w.devId}
      getOptionIcon={() => undefined}
    />

    {#each Object.values(resourceTypesToDisplay) as { displayName, data, type }}
      {#if data.length}
        <Table
          bind:selectedRows={selectedResources[type]}
          {data}
          schema={{ name: { type: "string", displayName } }}
          allowEditColumns={false}
          allowEditRows={false}
          allowSelectRows
          compact
          quiet
        />
      {/if}
    {/each}
  </ModalContent>
</Modal>

<style>
  .workspace-selection-label {
    margin-bottom: var(--bb-spacing-xs);
  }
</style>
