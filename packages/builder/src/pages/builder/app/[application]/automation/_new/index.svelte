<script lang="ts">
  import { contextMenuStore, automationStore } from "@/stores/builder"
  import { type Automation } from "@budibase/types"
  import {
    ActionButton,
    Button,
    Icon,
    Modal,
    type ModalAPI,
    notifications,
  } from "@budibase/bbui"
  import HeroBanner from "@/components/common/HeroBanner.svelte"
  import AppsHero from "assets/apps-hero.png"
  import PublishStatusBadge from "@/components/common/PublishStatusBadge.svelte"
  import { url } from "@roxi/routify"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import CreateAutomationModal from "@/components/automation/AutomationPanel/CreateAutomationModal.svelte"
  import UpdateAutomationModal from "@/components/automation/AutomationPanel/UpdateAutomationModal.svelte"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import { sdk } from "@budibase/shared-core"

  enum Filter {
    All = "All automations",
    Published = "Published",
    Drafts = "Drafts",
  }

  let showHighlight = true
  let createModal: ModalAPI
  let updateModal: Pick<ModalAPI, "show" | "hide">
  let confirmDeleteDialog: Pick<ModalAPI, "show" | "hide">
  let webhookModal: ModalAPI
  let filter = Filter.All
  let selectedAutomation: Automation | undefined = undefined

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
        },
        {
          icon: "pause-circle",
          name: "Unpublish",
          visible: true,
          disabled: false,
          callback: () => console.log("Unpublish"),
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
</script>

<div class="automations-index">
  <div class="hero-wrapper">
    <HeroBanner
      title="Automations"
      linkTitle="Learn: Automations 101"
      image={AppsHero}
      color="#213B57"
    >
      Use automations to automate manual processes, add logic to apps, and build
      deterministic tasks for your agent.
    </HeroBanner>
  </div>
  <div class="header">
    <Icon name="WebPage"></Icon>
    <h3>Automations</h3>
    <Button icon="Light" secondary>Learn</Button>
    <Button cta icon="lightning-a" on:click={createModal.show}>
      New automation
    </Button>
  </div>
  <div class="filter">
    {#each Object.values(Filter) as option}
      <ActionButton
        quiet
        selected={option === filter}
        on:click={() => (filter = option)}>{option}</ActionButton
      >
    {/each}
  </div>

  <div class="table-header">
    <span>Name</span>
    <span>Status</span>
    <span>Created by</span>
    <span>Last published</span>
    <span></span>
  </div>
  {#each $automationStore.automations as automation, idx}
    <a
      class="app"
      href={$url(`./${automation._id}`)}
      on:contextmenu={e => openContextMenu(e, automation)}
      class:active={showHighlight && selectedAutomation === automation}
    >
      <div>{automation.name}</div>
      <div>
        <PublishStatusBadge status={idx % 2 === 0 ? "published" : "draft"} />
      </div>
      <span>Joe Johnston</span>
      <span>This week</span>
      <div class="actions">
        <Icon
          name="More"
          size="M"
          hoverable
          on:click={e => openContextMenu(e, automation)}
        />
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
  }
  .hero-wrapper {
    margin: 12px 12px 0 12px;
  }
  .header {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 8px;
    align-items: center;
    padding: 10px 10px 10px 20px;
    border-bottom: var(--border);
  }
  h3 {
    font-weight: 510;
    font-size: 18px;
    margin: 0;
  }
  .filter {
    padding: 10px 12px;
    border-bottom: var(--border);
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

      & .actions {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  .actions {
    justify-content: flex-end;
    display: flex;
    opacity: 0;
    pointer-events: none;
    transition: opacity 130ms ease-out;
  }
</style>
