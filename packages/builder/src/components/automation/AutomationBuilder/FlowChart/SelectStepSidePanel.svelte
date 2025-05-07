<script lang="ts">
  import { Detail, Body, Icon, notifications, Tags, Tag } from "@budibase/bbui"
  import { AutomationActionStepId, BlockDefinitionTypes } from "@budibase/types"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { admin, licensing } from "@/stores/portal"
  import { externalActions } from "./ExternalActions"
  import { TriggerStepID, ActionStepID } from "@/constants/backend/automations"
  import type { AutomationStepDefinition } from "@budibase/types"

  export let block
  export let onClose = () => {}

  let syncAutomationsEnabled = $licensing.syncAutomationsEnabled
  let triggerAutomationRunEnabled = $licensing.triggerAutomationRunEnabled
  let collectBlockAllowedSteps = [TriggerStepID.APP, TriggerStepID.WEBHOOK]
  let selectedAction: string | undefined
  let actions = Object.entries($automationStore.blockDefinitions.ACTION).filter(
    ([key, action]) =>
      key !== AutomationActionStepId.BRANCH && action.deprecated !== true
  )

  $: {
    const triggerStepId = $selectedAutomation.data?.definition.trigger.stepId
    if (triggerStepId && !collectBlockAllowedSteps.includes(triggerStepId)) {
      actions = actions.filter(
        ([key]) => key !== AutomationActionStepId.COLLECT
      )
    }
  }
  let lockedFeatures = [
    ActionStepID.COLLECT,
    ActionStepID.TRIGGER_AUTOMATION_RUN,
  ]

  $: blockRef = $selectedAutomation.blockRefs?.[block.id]
  $: lastStep = blockRef?.terminating
  $: pathSteps =
    block.id && $selectedAutomation?.data
      ? automationStore.actions.getPathSteps(
          blockRef?.pathTo,
          $selectedAutomation.data
        )
      : []

  $: collectBlockExists = pathSteps?.some(
    step => step.stepId === ActionStepID.COLLECT
  )

  const disabled = () => {
    return {
      SEND_EMAIL_SMTP: {
        disabled:
          !$admin.checklist?.smtp?.checked || $admin.checklist?.smtp.fallback,
        message: "Please configure SMTP",
      },
      COLLECT: {
        disabled: !lastStep || !syncAutomationsEnabled || collectBlockExists,
        message: collectDisabledMessage(),
      },
      TRIGGER_AUTOMATION_RUN: {
        disabled: !triggerAutomationRunEnabled,
        message: "Please upgrade to a paid plan",
      },
    }
  }

  const checkDisabled = (idx: string) => {
    const disabledActions = disabled()
    return disabledActions[idx as keyof typeof disabledActions]
  }

  const collectDisabledMessage = () => {
    if (collectBlockExists) {
      return "Only one Collect step allowed"
    }
    if (!lastStep) {
      return "Only available as the last step"
    }
  }

  const allActions: Record<string, AutomationStepDefinition> = {}
  actions.forEach(([k, v]) => {
    if (!v.deprecated) {
      allActions[k] = v
    }
  })

  const plugins = actions.reduce(
    (acc: Record<string, AutomationStepDefinition>, elm) => {
      const [k, v] = elm
      if (v.custom) {
        acc[k] = v
      }
      return acc
    },
    {}
  )

  const categories = [
    {
      name: "Records",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.CREATE_ROW,
          AutomationActionStepId.UPDATE_ROW,
          AutomationActionStepId.DELETE_ROW,
          AutomationActionStepId.QUERY_ROWS,
        ].includes(k as AutomationActionStepId)
      ),
    },
    {
      name: "Flow logic",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.FILTER,
          AutomationActionStepId.DELAY,
          AutomationActionStepId.BRANCH,
          AutomationActionStepId.TRIGGER_AUTOMATION_RUN,
          AutomationActionStepId.COLLECT,
        ].includes(k as AutomationActionStepId)
      ),
    },
    {
      name: "Code",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.EXECUTE_BASH,
          AutomationActionStepId.EXECUTE_SCRIPT_V2,
          AutomationActionStepId.SERVER_LOG,
        ].includes(k as AutomationActionStepId)
      ),
    },
    {
      name: "Email",
      items: actions.filter(([k]) =>
        [AutomationActionStepId.SEND_EMAIL_SMTP].includes(
          k as AutomationActionStepId
        )
      ),
    },
    {
      name: "Apps",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.zapier,
          AutomationActionStepId.n8n,
          AutomationActionStepId.integromat,
          AutomationActionStepId.discord,
          AutomationActionStepId.slack,
        ].includes(k as AutomationActionStepId)
      ),
    },
  ]

  const selectAction = async (action: AutomationStepDefinition) => {
    selectedAction = action.name

    try {
      const newBlock = automationStore.actions.constructBlock(
        BlockDefinitionTypes.ACTION,
        action.stepId,
        action
      )
      await automationStore.actions.addBlockToAutomation(
        newBlock,
        blockRef ? blockRef.pathTo : block.pathTo
      )

      // Determine presence of the block before focusing
      const createdBlock = $selectedAutomation.blockRefs[newBlock.id]
      const createdBlockLoc = (createdBlock?.pathTo || []).at(-1)
      await automationStore.actions.selectNode(createdBlockLoc?.id)

      automationStore.actions.closeActionPanel()
      onClose()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving automation")
    }
  }

  const getExternalAction = (stepId: string) => {
    return externalActions[stepId as keyof typeof externalActions]
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="action-panel-root">
  <div class="action-panel-header">
    <Body size="L" weight="700">Add automation step</Body>
    <Icon name="Close" size="L" hoverable on:click={onClose} />
  </div>
  <div class="action-panel-content">
    {#each categories as category, i}
      {#if i > 0}
        <div class="section-divider" />
      {/if}
      <div class="section-header">
        <Detail size="L" weight={700}>{category.name}</Detail>
      </div>
      <div class="item-list">
        {#each category.items as [idx, action]}
          {@const isDisabled =
            checkDisabled(idx) && checkDisabled(idx).disabled}
          <div
            class="item"
            class:disabled={isDisabled}
            class:selected={selectedAction === action.name}
            on:click={isDisabled ? null : () => selectAction(action)}
          >
            <div class="item-body">
              {#if !action.internal && getExternalAction(action.stepId)?.icon}
                <img
                  width={24}
                  height={24}
                  src={getExternalAction(action.stepId)?.icon}
                  alt={getExternalAction(action.stepId)?.name}
                  class="external-icon"
                />
              {:else}
                <div class="item-icon">
                  <Icon name={action.icon} size="L" />
                </div>
              {/if}
              <div class="item-label">
                <Body size="M" weight="500">
                  {action.internal === false
                    ? action.stepTitle ||
                      idx.charAt(0).toUpperCase() + idx.slice(1)
                    : action.name}
                </Body>
              </div>
              {#if isDisabled && !syncAutomationsEnabled && !triggerAutomationRunEnabled && lockedFeatures.includes(action.stepId)}
                <div class="tag-color">
                  <Tags>
                    <Tag icon="LockClosed">Premium</Tag>
                  </Tags>
                </div>
              {:else if isDisabled}
                <Icon name="Help" tooltip={checkDisabled(idx).message} />
              {:else if action.new}
                <Tags>
                  <Tag emphasized>New</Tag>
                </Tags>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/each}

    {#if Object.keys(plugins).length}
      <div class="section-divider" />
      <div class="section-header">
        <Detail size="L" weight={700}>Plugins</Detail>
      </div>
      <div class="item-list">
        {#each Object.entries(plugins) as [_, action]}
          <div
            class="item"
            class:selected={selectedAction === action.name}
            on:click={() => selectAction(action)}
          >
            <div class="item-body">
              <div class="item-icon"><Icon name={action.icon} size="L" /></div>
              <div class="item-label">
                <Body size="M" weight="500">{action.name}</Body>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .action-panel-root {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--background);
    box-shadow: var(--shadow-l);
    min-width: 360px;
    max-width: 360px;
    overflow: hidden;
  }
  .action-panel-header {
    position: sticky;
    top: 0;
    background: var(--background);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 28px 0px 28px;
    border-bottom: 1px solid var(--spectrum-global-color-gray-300);
    flex: 0 0 53px;
  }
  .action-panel-content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 10px 28px 28px 28px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .section-header {
    margin-bottom: var(--spacing-xs);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--spectrum-global-color-gray-700);
    text-transform: uppercase;
  }
  .section-divider {
    height: 1px;
    background: var(--spectrum-global-color-gray-200);
    margin: 10px 0 10px 0;
    width: 100%;
  }
  .item-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .item {
    border-radius: 8px;
    padding: 0px 18px;
    margin-bottom: 0px;
    transition: box-shadow 0.2s, background 0.2s;
    border: 1.5px solid var(--spectrum-alias-border-color);
    background: var(--spectrum-alias-background-color-secondary);
    display: flex;
    align-items: center;
    min-height: 48px;
    box-sizing: border-box;
  }
  .item:not(.disabled):hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .item.disabled {
    opacity: 0.5;
    filter: grayscale(0.5);
    cursor: not-allowed;
  }
  .item-body {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    width: 100%;
  }
  .item-icon,
  .external-icon {
    margin-right: 12px;
    font-size: 24px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .item-label {
    font-size: 15px;
    font-weight: 500;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tag-color :global(.spectrum-Tags-item) {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
