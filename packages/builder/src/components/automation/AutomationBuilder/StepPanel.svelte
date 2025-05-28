<script lang="ts">
  import {
    ActionButton,
    Button,
    Divider,
    Icon,
    Modal,
    DetailSummary,
  } from "@budibase/bbui"
  import {
    type Automation,
    type AutomationStep,
    type AutomationTrigger,
    type BlockRef,
    AutomationTriggerStepId,
    isBranchStep,
    isTrigger,
    AutomationFeature,
  } from "@budibase/types"
  import { memo } from "@budibase/frontend-core"
  import {
    automationStore,
    selectedAutomation,
    evaluationContext,
  } from "@/stores/builder"
  import BlockData from "../SetupPanel/BlockData.svelte"
  import BlockProperties from "../SetupPanel/BlockProperties.svelte"
  import BlockHeader from "../SetupPanel/BlockHeader.svelte"
  import { PropField } from "../SetupPanel"
  import RoleSelect from "@/components/common/RoleSelect.svelte"
  import { type AutomationContext } from "@/stores/builder/automations"
  import CreateWebhookModal from "@/components/automation/Shared/CreateWebhookModal.svelte"
  import { getVerticalResizeActions } from "@/components/common/resizable"

  const [resizable, resizableHandle] = getVerticalResizeActions()

  const memoAutomation = memo<Automation | undefined>($selectedAutomation.data)
  const memoBlock = memo<AutomationStep | AutomationTrigger | undefined>()
  const memoContext = memo({} as AutomationContext)

  let role: string | undefined
  let webhookModal: Modal | undefined
  let configPanel: HTMLDivElement | undefined

  $: memoAutomation.set($selectedAutomation.data)
  $: memoContext.set($evaluationContext)

  $: selectedNodeId = $automationStore.selectedNodeId
  $: blockRefs = $selectedAutomation.blockRefs
  $: blockRef = selectedNodeId ? blockRefs[selectedNodeId] : undefined
  $: block = automationStore.actions.getBlockByRef($memoAutomation, blockRef)

  $: memoBlock.set(block)

  $: isStep = !!$memoBlock && !isTrigger($memoBlock)
  $: pathSteps = loadPathSteps(blockRef, $memoAutomation)
  $: loopBlock = pathSteps.find(
    x => $memoBlock && x.blockToLoop === $memoBlock.id
  )

  $: isAppAction = block?.stepId === AutomationTriggerStepId.APP
  $: isAppAction && fetchPermissions($memoAutomation?._id)
  $: isAppAction &&
    automationStore.actions.setPermissions(role, $memoAutomation)

  // Reset the panel scroll when the target node is changed
  $: resetScroll(selectedNodeId)

  const resetScroll = (selectedNodeId: string | undefined) => {
    if (configPanel && configPanel?.scrollTop > 0 && selectedNodeId) {
      configPanel.scrollTop = 0
    }
  }

  const fetchPermissions = async (automationId?: string) => {
    if (!automationId) {
      return
    }
    role = await automationStore.actions.getPermissions(automationId)
  }

  const loadPathSteps = (
    blockRef: BlockRef | undefined,
    automation: Automation | undefined
  ) => {
    return blockRef && automation
      ? automationStore.actions.getPathSteps(blockRef.pathTo, automation)
      : []
  }
</script>

<Modal bind:this={webhookModal}>
  <CreateWebhookModal />
</Modal>

<div class="panel heading">
  <div class="details">
    <BlockHeader
      automation={$memoAutomation}
      block={$memoBlock}
      on:update={e => {
        if ($memoBlock && !isTrigger($memoBlock)) {
          automationStore.actions.updateBlockTitle($memoBlock, e.detail)
        }
      }}
    />
    <Icon
      name="Close"
      hoverable
      on:click={() => {
        automationStore.actions.selectNode()
      }}
    />
  </div>
  {#if isStep}
    <div class="step-actions">
      {#if $memoBlock && !isBranchStep($memoBlock) && ($memoBlock.features?.[AutomationFeature.LOOPING] || !$memoBlock.features)}
        <ActionButton
          quiet
          noPadding
          icon="RotateCW"
          on:click={async () => {
            if (loopBlock) {
              await automationStore.actions.removeLooping(blockRef)
            } else {
              await automationStore.actions.addLooping(blockRef)
            }
          }}
        >
          {loopBlock ? `Stop Looping` : `Loop`}
        </ActionButton>
      {/if}
      <ActionButton
        quiet
        noPadding
        icon="DeleteOutline"
        on:click={async () => {
          if (!blockRef) {
            return
          }
          await automationStore.actions.deleteAutomationBlock(blockRef.pathTo)
        }}
      >
        Delete
      </ActionButton>
    </div>
  {/if}
</div>
<Divider noMargin />
<div class="panel config" use:resizable>
  <div class="content" bind:this={configPanel}>
    {#if loopBlock}
      <div class="loop">
        <DetailSummary name="Loop details" padded={false} initiallyShow>
          <BlockProperties
            block={loopBlock}
            context={$memoContext}
            automation={$memoAutomation}
          />
        </DetailSummary>
      </div>
      <Divider noMargin />
    {:else if isAppAction}
      <PropField label="Role" fullWidth>
        <RoleSelect bind:value={role} />
      </PropField>
    {/if}
    <span class="props">
      <BlockProperties
        block={$memoBlock}
        context={$memoContext}
        automation={$memoAutomation}
      />
    </span>

    {#if block?.stepId === AutomationTriggerStepId.WEBHOOK}
      <Button
        secondary
        on:click={() => {
          if (!webhookModal) return
          webhookModal.show()
        }}
      >
        Set Up Webhook
      </Button>
    {/if}
  </div>
  <div
    role="separator"
    class="divider"
    class:disabled={false}
    use:resizableHandle
  />
</div>

<div class="panel data">
  <BlockData
    context={$memoContext}
    block={$memoBlock}
    automation={$memoAutomation}
    on:run={() => {
      automationStore.update(state => ({
        ...state,
        showTestModal: true,
      }))
    }}
  />
</div>

<style>
  .step-actions {
    display: flex;
    gap: var(--spacing-l);
    align-items: center;
    margin-top: var(--spacing-s);
  }
  .heading.panel {
    display: flex;
    flex-direction: column;
  }
  .panel,
  .config.panel .content {
    padding: var(--spacing-l);
  }
  .config.panel {
    padding: 0px;
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    max-height: 550px;
    transition:
      height 300ms ease-out,
      max-height 300ms ease-out;
    height: 400px;
    box-sizing: border-box;
  }
  .config.panel .content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .config.panel .loop,
  .config.panel .content .props {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .config.panel :global(.spectrum-Divider) {
    flex: 0 0 auto;
  }
  .data.panel {
    padding: 0px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
  }
  .divider {
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    height: 16px;
    width: 100%;
  }
  .divider:after {
    content: "";
    position: absolute;
    background: var(--spectrum-global-color-gray-200);
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    transition: background 130ms ease-out;
  }
  .divider:hover {
    cursor: row-resize;
  }
  .divider:hover:after {
    background: var(--spectrum-global-color-gray-300);
  }
  .divider.disabled {
    cursor: auto;
  }
  .divider.disabled:after {
    background: var(--spectrum-global-color-gray-200);
  }
  .details {
    display: flex;
    gap: var(--spacing-l);
  }
  .config :global(.property-group-container) {
    border: 0px;
  }
</style>
