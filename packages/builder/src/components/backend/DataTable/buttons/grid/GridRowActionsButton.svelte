<script>
  import {
    ActionButton,
    List,
    ListItem,
    Button,
    Toggle,
    notifications,
    Modal,
    ModalContent,
    Input,
  } from "@budibase/bbui"
  import DetailPopover from "@/components/common/DetailPopover.svelte"
  import { getContext } from "svelte"
  import { appStore, rowActions } from "@/stores/builder"
  import { goto, url } from "@roxi/routify"
  import { derived } from "svelte/store"

  const { datasource } = getContext("grid")

  let popover
  let createModal
  let newName

  $: ds = $datasource
  $: tableId = ds?.tableId
  $: viewId = ds?.id
  $: isView = ds?.type === "viewV2"
  $: tableRowActions = $rowActions[tableId] || []
  $: viewRowActions = $rowActions[viewId] || []
  $: actionCount = isView ? viewRowActions.length : tableRowActions.length
  $: newNameInvalid = newName && tableRowActions.some(x => x.name === newName)

  const rowActionUrl = derived([url, appStore], ([$url, $appStore]) => {
    return ({ automationId }) => {
      return $url(`/builder/app/${$appStore.appId}/automation/${automationId}`)
    }
  })

  const toggleAction = async (action, enabled) => {
    if (enabled) {
      await rowActions.enableView(tableId, action.id, viewId)
    } else {
      await rowActions.disableView(tableId, action.id, viewId)
    }
  }

  const showCreateModal = () => {
    newName = null
    popover.hide()
    createModal.show()
  }

  const createRowAction = async () => {
    try {
      const newRowAction = await rowActions.createRowAction(
        tableId,
        viewId,
        newName
      )
      notifications.success("Row action created successfully")
      $goto($rowActionUrl(newRowAction))
    } catch (error) {
      console.error(error)
      notifications.error("Error creating row action")
    }
  }
</script>

<DetailPopover title="Row actions" bind:this={popover}>
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
  {#if !tableRowActions.length}
    <br />
    You haven't created any row actions.
  {:else}
    <List>
      {#each tableRowActions as action}
        <ListItem title={action.name} url={$rowActionUrl(action)} showArrow>
          <svelte:fragment slot="right">
            {#if isView}
              <span>
                <Toggle
                  value={action.allowedSources?.includes(viewId)}
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
    <Button secondary icon="Engagement" on:click={showCreateModal}>
      Create row action
    </Button>
  </div>
</DetailPopover>

<Modal bind:this={createModal}>
  <ModalContent
    size="S"
    title="Create row action"
    confirmText="Create"
    showCancelButton={false}
    showDivider={false}
    showCloseIcon={false}
    disabled={!newName || newNameInvalid}
    onConfirm={createRowAction}
    let:loading
  >
    <Input
      label="Name"
      bind:value={newName}
      error={newNameInvalid && !loading
        ? "A row action with this name already exists"
        : null}
    />
  </ModalContent>
</Modal>

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
