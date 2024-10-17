<script>
  import {
    automationStore,
    permissions,
    selectedAutomationDisplayData,
    selectedAutomation,
  } from "stores/builder"
  import {
    Icon,
    Divider,
    Layout,
    Detail,
    Modal,
    Label,
    AbsTooltip,
    InlineAlert,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import { ActionStepID, TriggerStepID } from "constants/backend/automations"
  import { AutomationStepType } from "@budibase/types"
  import FlowItemActions from "./FlowItemActions.svelte"

  export let block
  export let blockRef
  export let testDataModal
  export let idx
  export let automation
  export let bindings

  let selected
  let webhookModal
  let open = true
  let showLooping = false
  let role

  $: pathSteps = loadSteps(blockRef)

  const loadSteps = blockRef => {
    return blockRef
      ? automationStore.actions.getPathSteps(blockRef.pathTo, automation)
      : []
  }

  $: collectBlockExists = pathSteps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  $: automationId = automation?._id
  $: isTrigger = block.type === AutomationStepType.TRIGGER
  $: lastStep = blockRef?.terminating

  $: loopBlock = pathSteps.find(x => x.blockToLoop === block.id)
  $: isAppAction = block?.stepId === TriggerStepID.APP
  $: isAppAction && setPermissions(role)
  $: isAppAction && getPermissions(automationId)

  $: triggerInfo = $selectedAutomationDisplayData?.triggerInfo

  async function setPermissions(role) {
    if (!role || !automationId) {
      return
    }
    await permissions.save({
      level: "execute",
      role,
      resource: automationId,
    })
  }

  async function getPermissions(automationId) {
    if (!automationId) {
      return
    }
    const perms = await permissions.forResource(automationId)
    if (!perms["execute"]) {
      role = "BASIC"
    } else {
      role = perms["execute"].role
    }
  }

  async function deleteStep() {
    await automationStore.actions.deleteAutomationBlock(blockRef.pathTo)
  }

  async function removeLooping() {
    let loopBlockRef = $selectedAutomation.blockRefs[blockRef.looped]
    await automationStore.actions.deleteAutomationBlock(loopBlockRef.pathTo)
  }

  async function addLooping() {
    const loopDefinition = $automationStore.blockDefinitions.ACTION.LOOP
    const loopBlock = automationStore.actions.constructBlock(
      "ACTION",
      "LOOP",
      loopDefinition
    )
    loopBlock.blockToLoop = block.id
    await automationStore.actions.addBlockToAutomation(
      loopBlock,
      blockRef.pathTo
    )
  }
</script>

{#if block.stepId !== "LOOP"}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    id={`block-${block.id}`}
    class={`block ${block.type} hoverable`}
    class:selected
    on:click={() => {}}
  >
    {#if loopBlock}
      <div class="blockSection">
        <div
          on:click={() => {
            showLooping = !showLooping
          }}
          class="splitHeader"
        >
          <div class="center-items">
            <svg
              width="28px"
              height="28px"
              class="spectrum-Icon"
              style="color:var(--spectrum-global-color-gray-700);"
              focusable="false"
            >
              <use xlink:href="#spectrum-icon-18-Reuse" />
            </svg>
            <div class="iconAlign">
              <Detail size="S">Looping</Detail>
            </div>
          </div>

          <div class="blockTitle">
            <AbsTooltip type="negative" text="Remove looping">
              <Icon on:click={removeLooping} hoverable name="DeleteOutline" />
            </AbsTooltip>

            <div style="margin-left: 10px;" on:click={() => {}}>
              <Icon
                hoverable
                name={showLooping ? "ChevronDown" : "ChevronUp"}
              />
            </div>
          </div>
        </div>
      </div>

      <Divider noMargin />
      {#if !showLooping}
        <div class="blockSection">
          <Layout noPadding gap="S">
            <AutomationBlockSetup
              schemaProperties={Object.entries(
                $automationStore.blockDefinitions.ACTION.LOOP.schema.inputs
                  .properties
              )}
              {webhookModal}
              block={loopBlock}
              {automation}
              {bindings}
            />
          </Layout>
        </div>
        <Divider noMargin />
      {/if}
    {/if}

    <FlowItemHeader
      {automation}
      {open}
      {block}
      {testDataModal}
      {idx}
      {addLooping}
      {deleteStep}
      on:toggle={() => (open = !open)}
      on:update={async e => {
        const newName = e.detail
        if (newName.length === 0) {
          await automationStore.actions.deleteAutomationName(block.id)
        } else {
          await automationStore.actions.saveAutomationName(block.id, newName)
        }
      }}
    />
    {#if open}
      <Divider noMargin />
      <div class="blockSection">
        <Layout noPadding gap="S">
          {#if isAppAction}
            <div>
              <Label>Role</Label>
              <RoleSelect bind:value={role} />
            </div>
          {/if}
          <AutomationBlockSetup
            schemaProperties={Object.entries(
              block?.schema?.inputs?.properties || {}
            )}
            {block}
            {webhookModal}
            {automation}
            {bindings}
          />
          {#if isTrigger && triggerInfo}
            <InlineAlert
              header={triggerInfo.type}
              message={`This trigger is tied to the "${triggerInfo.rowAction.name}" row action in your ${triggerInfo.table.name} table`}
            />
          {/if}
        </Layout>
      </div>
    {/if}
  </div>
  {#if !collectBlockExists || !lastStep}
    <div class="separator" />
    <FlowItemActions
      {block}
      on:branch={() => {
        automationStore.actions.branchAutomation(
          $selectedAutomation.blockRefs[block.id].pathTo,
          automation
        )
      }}
    />
    {#if !lastStep}
      <div class="separator" />
    {/if}
  {/if}
{/if}

<Modal bind:this={webhookModal} width="30%">
  <CreateWebhookModal />
</Modal>

<style>
  .delete-padding {
    padding-left: 30px;
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
    /* center horizontally */
    align-self: center;
  }

  .blockTitle {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
</style>
