<script>
  import FilterBuilder from "components/design/settings/controls/FilterEditor/FilterBuilder.svelte"
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
  } from "@budibase/bbui"
  import PropField from "components/automation/SetupPanel/PropField.svelte"
  import AutomationBindingPanel from "components/common/bindings/ServerBindingPanel.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import FlowItemActions from "./FlowItemActions.svelte"
  import { automationStore, selectedAutomation } from "stores/builder"
  import { QueryUtils } from "@budibase/frontend-core"
  import { cloneDeep } from "lodash/fp"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let pathTo
  export let branchIdx
  export let step
  export let isLast
  export let bindings

  let drawer
  let condition
  let open = true

  $: branch = step.inputs?.branches?.[branchIdx]
  $: editableConditionUI = cloneDeep(branch.conditionUI || {})
  $: condition = QueryUtils.buildQuery(editableConditionUI)

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
    pathTo: (pathTo || []).concat({ branchIdx }),
  }
</script>

<Drawer bind:this={drawer} title="Branch condition" forceModal>
  <Button
    cta
    slot="buttons"
    on:click={() => {
      drawer.hide()
      dispatch("change", {
        conditionUI: editableConditionUI,
        condition,
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
  <div class={`block branch-node hoverable`} class:selected={false}>
    <FlowItemHeader
      {open}
      itemName={branch.name}
      block={step}
      deleteStep={async () => {
        await automationStore.actions.deleteBranch(
          branchBlockRef.pathTo,
          $selectedAutomation
        )
      }}
      on:update={async e => {
        let stepUpdate = cloneDeep(step)
        let branchUpdate = stepUpdate.inputs?.branches.find(
          stepBranch => stepBranch.id == branch.id
        )
        branchUpdate.name = e.detail

        const updatedAuto = automationStore.actions.updateStep(
          pathTo,
          $selectedAutomation,
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
              $selectedAutomation,
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
              $selectedAutomation,
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
            <Icon name="Info" />
            <Body size="S">
              Only the first branch which matches it's condition will run
            </Body>
          </div>
        </Layout>
      </div>
    {/if}
  </div>

  <div class="separator" />

  <FlowItemActions block={branchBlockRef} />

  {#if step.inputs.children[branch.id]?.length}
    <div class="separator" />
  {/if}
</div>

<style>
  .branch-actions {
    display: flex;
    gap: var(--spacing-l);
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
