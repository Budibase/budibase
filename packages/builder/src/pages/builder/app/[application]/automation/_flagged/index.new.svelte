<script lang="ts">
  import {
    contextMenuStore,
    automationStore,
    workspaceFavouriteStore,
  } from "@/stores/builder"
  import { PublishResourceState } from "@budibase/types"
  import { type Automation, WorkspaceResource } from "@budibase/types"
  import {
    AbsTooltip,
    ActionButton,
    Button,
    Body,
    Helpers,
    Icon,
    Modal,
    type ModalAPI,
    notifications,
    TooltipPosition,
  } from "@budibase/bbui"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import AppsHero from "assets/automation-hero-x1.png"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { url } from "@roxi/routify"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { sdk } from "@budibase/shared-core"
  import TopBar from "@/components/common/TopBar.svelte"
  import { BannerType } from "@/constants/banners"
  import { capitalise, durationFromNow } from "@/helpers"
  import FavouriteResourceButton from "@/pages/builder/portal/_components/FavouriteResourceButton.svelte"

  let showHighlight = true
  let createModal: ModalAPI
  let updateModal: Pick<ModalAPI, "show" | "hide">
  let confirmDeleteDialog: Pick<ModalAPI, "show" | "hide">
  let webhookModal: ModalAPI
  let filter: PublishResourceState | undefined
  let selectedAutomation: Automation | undefined = undefined

  const filters: {
    label: string
    filterValue: PublishResourceState | undefined
  }[] = [
    {
      label: "All automations",
      filterValue: undefined,
    },
    {
      label: "Published",
      filterValue: PublishResourceState.PUBLISHED,
    },
    {
      label: "Disabled",
      filterValue: PublishResourceState.DISABLED,
    },
    {
      label: "Unpublished",
      filterValue: PublishResourceState.UNPUBLISHED,
    },
  ]

  $: favourites = workspaceFavouriteStore.lookup

  async function deleteAutomation() {
    if (!selectedAutomation) {
      return
    }
    try {
      await automationStore.actions.delete(selectedAutomation)
      notifications.success("Automation deleted successfully")
    } catch (error) {
      console.error(error)
      notifications.error("Error deleting automation")
    }
  }

  async function duplicateAutomation() {
    if (!selectedAutomation) {
      return
    }
    try {
      await automationStore.actions.duplicate(selectedAutomation)
      notifications.success("Automation has been duplicated successfully")
    } catch (error) {
      notifications.error("Error duplicating automation")
    }
  }

  const getContextMenuItems = (automation: Automation) => {
    const edit = {
      icon: "pencil",
      name: "Edit",
      visible: true,
      disabled: !automation.definition.trigger,
      callback: () => updateModal.show(),
    }
    const pause = {
      icon: automation.disabled ? "play-circle" : "pause-circle",
      name: automation.disabled ? "Activate" : "Pause",
      keyBind: null,
      visible: true,
      disabled: !automation.definition.trigger,
      callback: () => {
        if (automation._id) {
          automationStore.actions.toggleDisabled(automation._id)
        }
      },
    }
    const del = {
      icon: "trash",
      name: "Delete",
      visible: true,
      disabled: false,
      callback: () => confirmDeleteDialog.show(),
    }
    if (sdk.automations.isRowAction(automation)) {
      return [edit, del]
    } else {
      return [
        edit,
        {
          icon: "copy",
          name: "Duplicate",
          visible: true,
          disabled:
            !automation.definition.trigger ||
            automation.definition.trigger?.name === "Webhook",
          callback: duplicateAutomation,
          tooltip:
            automation.definition.trigger?.name === "Webhook"
              ? "Webhooks automations cannot be duplicated"
              : undefined,
        },
        pause,
        del,
      ]
    }
  }

  const openContextMenu = (e: MouseEvent, automation: Automation) => {
    e.preventDefault()
    e.stopPropagation()
    selectedAutomation = automation
    showHighlight = true
    contextMenuStore.open(
      "automation",
      getContextMenuItems(automation),
      {
        x: e.clientX,
        y: e.clientY,
      },
      () => {
        showHighlight = false
      }
    )
  }

  $: automations = $automationStore.automations
    .map(a => ({
      ...a,
      favourite: $favourites?.[a._id!] ?? {
        resourceType: WorkspaceResource.AUTOMATION,
        resourceId: a._id!,
      },
    }))
    .filter(a => {
      if (!filter) {
        return true
      }

      return a.publishStatus.state === filter
    })
    .sort((a, b) => {
      if (a.favourite._id && b.favourite._id) {
        return a.name?.toLowerCase() < b.name?.toLowerCase() ? -1 : 1
      }
      return a.favourite._id ? -1 : 1
    })

  function getTriggerFriendlyName(automation: Automation) {
    const definition =
      $automationStore.blockDefinitions.CREATABLE_TRIGGER[
        automation.definition.trigger.stepId
      ]
    return definition?.name
  }
</script>

<div class="automations-index">
  <HeroBanner
    key={BannerType.AUTOMATIONS}
    title="Transform workflows at scale with Budibase Automations and AI"
    linkTitle="Automations explained"
    linkHref="https://docs.budibase.com/docs/automation-steps"
    image={AppsHero}
    color="#1C3F62"
  >
    Automate more processes for your employees and customers with our visual
    automation builder. Use automations to transform workflows with AI, automate
    manual tasks, and add logic to apps.
  </HeroBanner>

  <TopBar
    icon="path"
    breadcrumbs={[{ text: "Automations" }]}
    showPublish={false}
  ></TopBar>
  <div class="secondary-bar">
    <div class="filter">
      {#each filters as option}
        <ActionButton
          quiet
          selected={option.filterValue === filter}
          on:click={() => (filter = option.filterValue)}
          >{option.label}</ActionButton
        >
      {/each}
    </div>
    <div class="action-buttons">
      <Button icon="lightbulb" secondary>Learn</Button>
      <Button cta icon="plus" on:click={createModal.show}>New automation</Button
      >
    </div>
  </div>

  <div class="table-header">
    <span>Name</span>
    <span>Trigger</span>
    <span>Status</span>
    <span>Last updated</span>
    <span></span>
  </div>
  {#each automations as automation}
    <a
      class="app"
      class:favourite={automation.favourite?._id}
      href={$url(`./${automation._id}`)}
      on:contextmenu={e => openContextMenu(e, automation)}
      class:active={showHighlight && selectedAutomation === automation}
    >
      <Body size="S" color="var(--spectrum-global-color-gray-900)"
        >{automation.name}</Body
      >
      <div>{getTriggerFriendlyName(automation)}</div>
      <div>
        <PublishStatusBadge status={automation.publishStatus.state} />
      </div>
      <AbsTooltip text={Helpers.getDateDisplayValue(automation.updatedAt)}>
        <span>
          {capitalise(durationFromNow(automation.updatedAt || ""))}
        </span>
      </AbsTooltip>
      <div class="actions">
        <div class="ctx-btn">
          <Icon
            name="More"
            size="M"
            hoverable
            on:click={e => openContextMenu(e, automation)}
          />
        </div>

        <span class="favourite-btn">
          <FavouriteResourceButton
            favourite={automation.favourite}
            position={TooltipPosition.Left}
            noWrap
          />
        </span>
      </div>
    </a>
  {/each}
</div>

<Modal bind:this={createModal}>
  <CreateAutomationModal {webhookModal} />
</Modal>
<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

{#if selectedAutomation}
  <UpdateAutomationModal
    automation={selectedAutomation}
    bind:this={updateModal}
  />

  <ConfirmDialog
    bind:this={confirmDeleteDialog}
    okText="Delete Automation"
    onOk={deleteAutomation}
    title="Confirm Deletion"
  >
    Are you sure you wish to delete the automation
    <i>{selectedAutomation.name}?</i>
    This action cannot be undone.
  </ConfirmDialog>
{/if}

<style>
  .automations-index {
    background: var(--background);
    flex: 1 1 auto;
    --border: 1px solid var(--spectrum-global-color-gray-200);
    overflow: auto;
  }
  .secondary-bar {
    padding: 10px 12px;
    border-bottom: var(--border);
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .filter {
    display: flex;
    gap: 10px;
  }
  .filter :global(.spectrum-ActionButton) {
    border-radius: 8px;
    transition:
      border-color 130ms ease-out,
      background 130ms ease-out;
    border: 1px solid transparent;
    padding: 3px 10px;
    height: auto;

    &.is-selected {
      background: var(--spectrum-global-color-gray-200);
      border-color: var(--spectrum-global-color-gray-300);
    }
  }
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  .app,
  .table-header {
    display: grid;
    grid-template-columns: 1fr 200px 200px 200px 50px;
    border-bottom: var(--border);
    align-items: center;
  }
  .table-header {
    padding: 5px 12px;
    color: var(--spectrum-global-color-gray-700);
  }
  .app {
    padding: 9px 12px;
    color: var(--text-color);
    transition: background 130ms ease-out;

    &:hover,
    &.active {
      background: var(--spectrum-global-color-gray-200);

      & .actions > * {
        opacity: 1;
        pointer-events: all;
      }
    }
    &.favourite {
      & .actions .favourite-btn {
        opacity: 1;
      }
    }
  }
  .actions {
    justify-content: flex-end;
    display: flex;
    align-items: center;
    pointer-events: none;
    gap: var(--spacing-xs);
  }

  .actions > * {
    opacity: 0;
    transition: opacity 130ms ease-out;
  }

  .actions .favourite-btn {
    pointer-events: all;
  }
</style>
