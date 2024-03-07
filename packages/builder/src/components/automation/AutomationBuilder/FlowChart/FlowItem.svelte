<script>
  import {
    automationStore,
    selectedAutomation,
    permissions,
  } from "stores/builder"
  import {
    Icon,
    Divider,
    Layout,
    Detail,
    Modal,
    Button,
    notifications,
    Label,
    AbsTooltip,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import { ActionStepID, TriggerStepID } from "constants/backend/automations"
  import { Handle, Position } from "@xyflow/svelte"
  import AddStepControl from "./AddStepControl.svelte"

  export let data
  const { block, testDataModal } = data

  let selected
  let webhookModal
  let open = true
  let showLooping = false
  let role

  $: automationId = $selectedAutomation?._id
  $: isTrigger = block.type === "TRIGGER"
  $: steps = $selectedAutomation?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length
  $: loopBlock = $selectedAutomation?.definition.steps.find(
    x => x.blockToLoop === block.id
  )
  $: isAppAction = block?.stepId === TriggerStepID.APP
  $: isAppAction && setPermissions(role)
  $: isAppAction && getPermissions(automationId)

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

  async function removeLooping() {
    try {
      await automationStore.actions.deleteAutomationBlock(loopBlock)
    } catch (error) {
      notifications.error("Error saving automation")
    }
  }

  async function deleteStep() {
    try {
      if (loopBlock) {
        await automationStore.actions.deleteAutomationBlock(loopBlock)
      }
      await automationStore.actions.deleteAutomationBlock(block, blockIdx)
    } catch (error) {
      notifications.error("Error saving automation")
    }
  }

  async function addLooping() {
    const loopDefinition = $automationStore.blockDefinitions.ACTION.LOOP
    const loopBlock = automationStore.actions.constructBlock(
      "ACTION",
      "LOOP",
      loopDefinition
    )
    loopBlock.blockToLoop = block.id
    await automationStore.actions.addBlockToAutomation(loopBlock, blockIdx)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`block ${block.type} hoverable`} class:selected on:click={() => {}}>
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
            <Icon hoverable name={showLooping ? "ChevronDown" : "ChevronUp"} />
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
          />
        </Layout>
      </div>
      <Divider noMargin />
    {/if}
  {/if}

  <FlowItemHeader
    {open}
    {block}
    {testDataModal}
    idx={blockIdx}
    {addLooping}
    {deleteStep}
    on:toggle={() => (open = !open)}
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
          schemaProperties={Object.entries(block.schema.inputs.properties)}
          {block}
          {webhookModal}
        />
        {#if lastStep}
          <Button on:click={() => testDataModal.show()} cta>
            Finish and test automation
          </Button>
        {/if}
      </Layout>
    </div>
  {/if}
  {#if blockIdx === steps.length - 1}
    <div class="add-step">
      <AddStepControl {lastStep} {blockIdx} />
    </div>
  {/if}
</div>

{#if !isTrigger}
  <Handle type="target" position={Position.Top} />
{/if}
{#if blockIdx < steps.length - 1}
  <Handle type="source" position={Position.Bottom} />
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

  .add-step {
    position: absolute;
    bottom: 0;
    transform: translateY(50%) translateX(-50%);
    left: 50%;
  }
</style>
