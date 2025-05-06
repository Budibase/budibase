<script lang="ts">
  import {
    Layout,
    Detail,
    Body,
    Icon,
    notifications,
    Tags,
    Tag,
  } from "@budibase/bbui"
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

  // Get all action definitions
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

  // Categories based on requirements
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
    <span class="action-panel-title">Add automation step</span>
    <Icon name="Close" hoverable on:click={onClose} />
  </div>
  <div class="action-panel-content">
    {#each categories as category}
      {#if category.items.length > 0}
        <Layout noPadding gap="XS">
          <Detail weight={200} size="L">{category.name}</Detail>
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
                      width={20}
                      height={20}
                      src={getExternalAction(action.stepId)?.icon}
                      alt={getExternalAction(action.stepId)?.name}
                    />
                  {:else}
                    <Icon name={action.icon} />
                  {/if}
                  {#if action.internal === false}
                    <Body size="M">
                      {action.stepTitle ||
                        idx.charAt(0).toUpperCase() + idx.slice(1)}
                    </Body>
                  {:else}
                    <Body size="M">{action.name}</Body>
                  {/if}
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
        </Layout>
      {/if}
    {/each}

    {#if Object.keys(plugins).length}
      <Layout noPadding gap="XS">
        <Detail size="S">Plugins</Detail>
        <div class="item-list">
          {#each Object.entries(plugins) as [_, action]}
            <div
              class="item"
              class:selected={selectedAction === action.name}
              on:click={() => selectAction(action)}
            >
              <div class="item-body">
                <Icon name={action.icon} />
                <Body size="XS">{action.name}</Body>
              </div>
            </div>
          {/each}
        </div>
      </Layout>
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-l);
    border-bottom: var(--border-light);
    flex: 0 0 48px;
  }
  .action-panel-title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .action-panel-content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
    gap: var(--spacing-m);
    align-items: center;
  }
  .item-list {
    display: grid;
    grid-gap: var(--spectrum-alias-grid-baseline);
  }
  .item :global(.spectrum-Tags-itemLabel) {
    cursor: pointer;
  }
  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid var(--spectrum-alias-border-color);
    border-radius: 8px;
    box-sizing: border-box;
    border-width: 2px;
    height: var(--spectrum-alias-item-height-l);
    display: flex;
  }
  .item:not(.disabled):hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .disabled {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-500);
  }
  .disabled :global(.spectrum-Body) {
    color: var(--spectrum-global-color-gray-600);
  }
  .tag-color :global(.spectrum-Tags-item) {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
