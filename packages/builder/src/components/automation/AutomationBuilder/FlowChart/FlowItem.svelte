<script>
  import { automationStore, selectedAutomation } from "builderStore"
  import {
    Icon,
    Divider,
    Layout,
    Detail,
    Modal,
    Button,
    ActionButton,
    notifications,
    Label,
  } from "@budibase/bbui"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import CreateWebhookModal from "components/automation/Shared/CreateWebhookModal.svelte"
  import ActionModal from "./ActionModal.svelte"
  import FlowItemHeader from "./FlowItemHeader.svelte"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"
  import {
    ActionStepID,
    TriggerStepID,
    Features,
  } from "constants/backend/automations"
  import { permissions } from "stores/backend"

  export let block
  export let testDataModal
  export let idx

  let selected
  let webhookModal
  let actionModal
  let open = true
  let showLooping = false
  let role

  $: collectBlockExists = $selectedAutomation.definition.steps.some(
    step => step.stepId === ActionStepID.COLLECT
  )
  $: automationId = $selectedAutomation?._id
  $: isTrigger = block.type === "TRIGGER"
  $: steps = $selectedAutomation?.definition?.steps ?? []
  $: blockIdx = steps.findIndex(step => step.id === block.id)
  $: lastStep = !isTrigger && blockIdx + 1 === steps.length
  $: totalBlocks = $selectedAutomation?.definition?.steps.length + 1
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
      await automationStore.actions.deleteAutomationBlock(block)
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
          <div style="margin-left: 10px;" on:click={() => {}}>
            <Icon hoverable name={showLooping ? "ChevronDown" : "ChevronUp"} />
          </div>
        </div>
      </div>
    </div>

    <Divider noMargin />
    {#if !showLooping}
      <div class="blockSection">
        <div class="block-options">
          <ActionButton on:click={() => removeLooping()} icon="DeleteOutline" />
        </div>
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
    {idx}
    on:toggle={() => (open = !open)}
  />
  {#if open}
    <Divider noMargin />
    <div class="blockSection">
      <Layout noPadding gap="S">
        {#if !isTrigger}
          <div>
            <div class="block-options">
              {#if !loopBlock && (block?.features?.[Features.LOOPING] || !block.features)}
                <ActionButton on:click={() => addLooping()} icon="Reuse">
                  Add Looping
                </ActionButton>
              {/if}
              <ActionButton
                on:click={() => deleteStep()}
                icon="DeleteOutline"
              />
            </div>
          </div>
        {/if}

        {#if isAppAction}
          <Label>Role</Label>
          <RoleSelect bind:value={role} />
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
</div>
{#if !collectBlockExists || !lastStep}
  <div class="separator" />
  <Icon
    on:click={() => actionModal.show()}
    hoverable
    name="AddCircle"
    size="S"
  />
  {#if isTrigger ? totalBlocks > 1 : blockIdx !== totalBlocks - 2}
    <div class="separator" />
  {/if}
{/if}

<Modal bind:this={actionModal} width="30%">
  <ActionModal {lastStep} {blockIdx} />
</Modal>

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
  }
</style>
