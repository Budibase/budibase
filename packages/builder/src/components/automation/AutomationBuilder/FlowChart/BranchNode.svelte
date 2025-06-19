<script>
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import {
    Drawer,
    DrawerContent,
    Icon,
    Body,
    Divider,
    Button,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import PropField from "@/components/automation/SetupPanel/PropField.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import FlowItemActions from "./FlowItemActions.svelte"
  import FlowItemStatus from "./FlowItemStatus.svelte"
  import {
    automationStore,
    selectedAutomation,
    evaluationContext,
    contextMenuStore,
  } from "@/stores/builder"
  import { QueryUtils, Utils, memo } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher, getContext } from "svelte"
  import DragZone from "./DragZone.svelte"
  import BlockHeader from "../../SetupPanel/BlockHeader.svelte"

  const dispatch = createEventDispatcher()

  export let pathTo
  export let branchIdx
  export let step
  export let isLast
  export let bindings
  export let automation

  const view = getContext("draggableView")
  const memoContext = memo({})

  let drawer
  let confirmDeleteModal

  $: memoContext.set($evaluationContext)

  $: branch = step.inputs?.branches?.[branchIdx]
  $: editableConditionUI = branch.conditionUI || {}

  // Parse all the bindings into fields for the condition builder
  $: schemaFields = bindings.map(binding => {
    return {
      name: `{{${binding.runtimeBinding}}}`,
      displayName: `${binding.category} - ${binding.display.name}`,
      type: "string",
    }
  })
  $: branchBlockRef = {
    branchNode: true,
    pathTo: (pathTo || []).concat({ branchIdx, branchStepId: step.id }),
  }

  const getContextMenuItems = () => {
    return [
      {
        icon: "trash",
        name: "Delete",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: async () => {
          const branchSteps = step.inputs?.children[branch.id]
          if (branchSteps.length) {
            confirmDeleteModal.show()
          } else {
            await automationStore.actions.deleteBranch(
              branchBlockRef.pathTo,
              $selectedAutomation.data
            )
          }
        },
      },
      {
        icon: "arrow-left",
        name: "Move left",
        keyBind: null,
        visible: true,
        disabled: branchIdx == 0,
        callback: async () => {
          automationStore.actions.branchLeft(
            branchBlockRef.pathTo,
            $selectedAutomation.data,
            step
          )
        },
      },
      {
        icon: "arrow-right",
        name: "Move right",
        keyBind: null,
        visible: true,
        disabled: isLast,
        callback: async () => {
          automationStore.actions.branchRight(
            branchBlockRef.pathTo,
            $selectedAutomation.data,
            step
          )
        },
      },
    ]
  }

  const openContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()

    const items = getContextMenuItems()
    contextMenuStore.open(branch.id, items, { x: e.clientX, y: e.clientY })
  }
</script>

<Modal bind:this={confirmDeleteModal}>
  <ModalContent
    size="M"
    title={"Are you sure you want to delete?"}
    confirmText="Delete"
    onConfirm={async () => {
      await automationStore.actions.deleteBranch(
        branchBlockRef.pathTo,
        $selectedAutomation.data
      )
    }}
  >
    <Body>By deleting this branch, you will delete all of its contents.</Body>
  </ModalContent>
</Modal>

<Drawer bind:this={drawer} title="Branch condition" forceModal>
  <Button
    cta
    slot="buttons"
    on:click={() => {
      drawer.hide()
      const updatedConditionsUI = Utils.parseFilter(editableConditionUI)
      dispatch("change", {
        conditionUI: updatedConditionsUI,
        condition: QueryUtils.buildQuery(updatedConditionsUI),
      })
    }}
  >
    Save
  </Button>
  <DrawerContent slot="body">
    <FilterBuilder
      filters={editableConditionUI}
      {bindings}
      {schemaFields}
      datasource={{ type: "custom" }}
      panel={AutomationBindingPanel}
      on:change={e => {
        editableConditionUI = e.detail
      }}
      allowOnEmpty={false}
      builderType={"condition"}
      docsURL={null}
      evaluationContext={$memoContext}
    />
  </DrawerContent>
</Drawer>

<div class="flow-item branch">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class={`block branch-node hoverable`}
    class:selected={false}
    on:mousedown={e => {
      e.stopPropagation()
    }}
  >
    <div class="block-float">
      <FlowItemStatus
        block={step}
        {automation}
        {branch}
        hideStatus={$view?.dragging}
      />
    </div>
    <div class="blockSection">
      <div class="heading">
        <BlockHeader
          {automation}
          block={step}
          itemName={branch.name}
          on:update={async e => {
            let stepUpdate = cloneDeep(step)
            let branchUpdate = stepUpdate.inputs?.branches.find(
              stepBranch => stepBranch.id == branch.id
            )
            branchUpdate.name = e.detail

            const updatedAuto = automationStore.actions.updateStep(
              pathTo,
              $selectedAutomation.data,
              stepUpdate
            )
            await automationStore.actions.save(updatedAuto)
          }}
        />
        <div class="actions">
          <Icon
            name="info"
            tooltip="Branch sequencing checks each option in order and follows the first one that matches the rules."
          />
          <Icon
            on:click={e => {
              openContextMenu(e)
            }}
            size="M"
            weight="bold"
            hoverable
            name="dots-three"
          />
        </div>
      </div>
    </div>

    <Divider noMargin />
    <div class="blockSection filter-button">
      <PropField label="Only run when:" fullWidth>
        <div style="width: 100%">
          <Button secondary on:click={drawer.show}>
            {editableConditionUI?.groups?.length
              ? "Update condition"
              : "Add condition"}
          </Button>
        </div>
      </PropField>
    </div>
  </div>

  <div class="separator" />

  {#if $view.dragging}
    <DragZone path={branchBlockRef.pathTo} />
  {:else}
    <FlowItemActions block={branchBlockRef} />
  {/if}

  {#if step.inputs.children[branch.id]?.length}
    <div class="separator" />
  {/if}
</div>

<style>
  .filter-button :global(.spectrum-Button) {
    width: 100%;
  }
  .branch-actions {
    display: flex;
    gap: var(--spacing-l);
    cursor: default;
  }
  .footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .flow-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .block-options {
    justify-content: flex-end;
    align-items: center;
    display: flex;
    gap: var(--spacing-m);
  }
  .center-items {
    display: flex;
    align-items: center;
  }
  .splitHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .iconAlign {
    padding: 0 0 0 var(--spacing-m);
    display: inline-block;
  }
  .block {
    width: 320px;
    background-color: var(--spectrum-global-color-gray-100);
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 12px;
    cursor: default;
  }

  .blockSection {
    padding: var(--spacing-xl);
  }

  .separator {
    width: 1px;
    height: 25px;
    border-left: 1px dashed var(--grey-4);
    color: var(--grey-4);
    align-self: center;
  }

  .blockTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .branch-node {
    position: relative;
  }

  .block-float {
    pointer-events: none;
    width: 100%;
    position: absolute;
    top: -35px;
    left: 0px;
  }

  .blockSection .heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }

  .blockSection .heading .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }
</style>
