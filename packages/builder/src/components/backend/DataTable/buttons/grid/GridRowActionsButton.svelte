<script>
  import {
    ActionButton,
    List,
    ListItem,
    Button,
    Toggle,
    notifications,
  } from "@budibase/bbui"
  import DetailPopover from "components/common/DetailPopover.svelte"
  import { getContext } from "svelte"
  import { appStore, automationStore } from "stores/builder"
  import { API } from "api"
  import { goto, url } from "@roxi/routify"
  import { derived } from "svelte/store"
  import { getSequentialName } from "helpers/duplicate"

  const { datasource } = getContext("grid")

  let rowActions = []

  $: ds = $datasource
  $: tableId = ds?.tableId
  $: isView = ds?.type === "viewV2"
  $: fetchRowActions(tableId)
  $: actionCount = rowActions.filter(action => !isView || action.enabled).length

  const rowActionUrl = derived([url, appStore], ([$url, $appStore]) => {
    return ({ automationId }) => {
      return $url(`/builder/app/${$appStore.appId}/automation/${automationId}`)
    }
  })

  const fetchRowActions = async tableId => {
    if (!tableId) {
      rowActions = []
      return
    }
    const res = await API.rowActions.fetch(tableId)
    rowActions = Object.values(res || {}).map(action => ({
      ...action,
      enabled: !isView || action.allowedViews?.includes(ds.id),
    }))
  }

  const createRowAction = async () => {
    try {
      const name = getSequentialName(rowActions, "New row action ", {
        getName: x => x.name,
      })
      const res = await API.rowActions.create({
        name,
        tableId,
      })
      await automationStore.actions.fetch()
      notifications.success("Row action created successfully")
      $goto($rowActionUrl(res))
    } catch (error) {
      console.error(error)
      notifications.error("Error creating row action")
    }
  }

  const toggleAction = async (action, enabled) => {
    console.log(action, enabled)
    if (enabled) {
      await API.rowActions.enableView({
        tableId,
        rowActionId: action.id,
        viewId: ds.id,
      })
    } else {
      await API.rowActions.disableView({
        tableId,
        rowActionId: action.id,
        viewId: ds.id,
      })
    }
  }
</script>

<DetailPopover title="Row actions">
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="Engagement"
      selected={open || actionCount}
      quiet
      accentColor="#A24400"
    >
      Row actions{actionCount ? `: ${actionCount}` : ""}
    </ActionButton>
  </svelte:fragment>
  A row action is a user-triggered automation for a chosen row.
  {#if isView && rowActions.length}
    <br />
    Use the toggle to enable/disable row actions for this view.
    <br />
  {/if}
  {#if !rowActions.length}
    <br />
    You haven't created any row actions.
  {:else}
    <List>
      {#each rowActions as action}
        <ListItem title={action.name} url={$rowActionUrl(action)} showArrow>
          <svelte:fragment slot="right">
            {#if isView}
              <span>
                <Toggle
                  value={action.enabled}
                  on:change={e => toggleAction(action, e.detail)}
                />
              </span>
            {/if}
          </svelte:fragment>
        </ListItem>
      {/each}
    </List>
  {/if}
  <div>
    <Button secondary icon="Engagement" on:click={createRowAction}>
      Create row action
    </Button>
  </div>
</DetailPopover>

<style>
  span :global(.spectrum-Switch) {
    min-height: 0;
    margin-right: 0;
  }
  span :global(.spectrum-Switch-switch) {
    margin-bottom: 0;
    margin-top: 2px;
  }
</style>
