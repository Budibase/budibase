<script>
  import FilterBuilder from "@/components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
  import {
    Drawer,
    DrawerContent,
    ActionButton,
    Icon,
    Layout,
    Body,
    Divider,
    TooltipPosition,
    TooltipType,
    Button,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import PropField from "@/components/automation/SetupPanel/PropField.svelte"
  import AutomationBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import FlowItemActions from "./FlowItemActions.svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { QueryUtils, Utils } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher, getContext } from "svelte"
  import DragZone from "./DragZone.svelte"

  const dispatch = createEventDispatcher()

  export let pathTo
  export let branchIdx
  export let step
  export let isLast
  export let bindings
  export let automation

  const view = getContext("draggableView")

  let drawer
  let open = true
  let confirmDeleteModal

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
    />
  </DrawerContent>
</Drawer>

<div class="flow-item">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class={`block branch-node hoverable`}
    class:selected={false}
    on:mousedown={e => {
      e.stopPropagation()
    }}
  >
    <FlowItemHeader
      {automation}
      {open}
      itemName={branch.name}
      block={step}
      deleteStep={async () => {
        const branchSteps = step.inputs?.children[branch.id]
        if (branchSteps.length) {
          confirmDeleteModal.show()
        } else {
          await automationStore.actions.deleteBranch(
            branchBlockRef.pathTo,
            $selectedAutomation.data
          )
        }
      }}
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
      on:toggle={() => (open = !open)}
    >
      <div slot="custom-actions" class="branch-actions">
        <Icon
          on:click={() => {
            automationStore.actions.branchLeft(
              branchBlockRef.pathTo,
              $selectedAutomation.data,
              step
            )
          }}
          tooltip={"Move left"}
          tooltipType={TooltipType.Info}
          tooltipPosition={TooltipPosition.Top}
          hoverable
          disabled={branchIdx == 0}
          name="ArrowLeft"
        />
        <Icon
          on:click={() => {
            automationStore.actions.branchRight(
              branchBlockRef.pathTo,
              $selectedAutomation.data,
              step
            )
          }}
          tooltip={"Move right"}
          tooltipType={TooltipType.Info}
          tooltipPosition={TooltipPosition.Top}
          hoverable
          disabled={isLast}
          name="ArrowRight"
        />
      </div>
    </FlowItemHeader>
    {#if open}
      <Divider noMargin />
      <div class="blockSection">
        <!-- Content body for possible slot -->
        <Layout noPadding>
          <PropField label="Only run when">
            <ActionButton fullWidth on:click={drawer.show}>
              {editableConditionUI?.groups?.length
                ? "Update condition"
                : "Add condition"}
            </ActionButton>
          </PropField>
          <div class="footer">
            <Icon
              name="InfoOutline"
              size="S"
              color="var(--spectrum-global-color-gray-700)"
            />
            <Body size="XS" color="var(--spectrum-global-color-gray-700)">
              Only the first branch which matches its condition will run
            </Body>
          </div>
        </Layout>
      </div>
    {/if}
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
    width: 480px;
    font-size: 16px;
    background-color: var(--background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px 4px 4px 4px;
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
</style>
