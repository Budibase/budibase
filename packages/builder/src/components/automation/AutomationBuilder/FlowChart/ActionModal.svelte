<script lang="ts">
  import {
    ModalContent,
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
  export let modal

  let syncAutomationsEnabled = $licensing.syncAutomationsEnabled
  let triggerAutomationRunEnabled = $licensing.triggerAutomationRunEnabled
  let collectBlockAllowedSteps = [TriggerStepID.APP, TriggerStepID.WEBHOOK]
  let selectedAction: string | undefined
  let actions = Object.entries($automationStore.blockDefinitions.ACTION).filter(
    ([key, action]) => {
      return key !== AutomationActionStepId.BRANCH && action.deprecated !== true
    }
  )
  let lockedFeatures = [
    ActionStepID.COLLECT,
    ActionStepID.TRIGGER_AUTOMATION_RUN,
  ]

  $: blockRef = $selectedAutomation.blockRefs?.[block.id]
  $: lastStep = blockRef?.terminating
  $: pathSteps =
    block.id && $selectedAutomation?.data
      ? automationStore.actions.getPathSteps(
          blockRef.pathTo,
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

  const external = actions.reduce(
    (acc: Record<string, AutomationStepDefinition>, elm) => {
      const [k, v] = elm
      if (!v.internal && !v.custom) {
        acc[k] = v
      }
      return acc
    },
    {}
  )

  const internal = actions.reduce(
    (acc: Record<string, AutomationStepDefinition>, elm) => {
      const [k, v] = elm
      if (v.internal) {
        acc[k] = v
      }
      delete acc.LOOP

      const stepId = $selectedAutomation.data?.definition.trigger.stepId
      // Filter out Collect block if not App Action or Webhook
      if (stepId && !collectBlockAllowedSteps.includes(stepId)) {
        delete acc.COLLECT
      }
      return acc
    },
    {}
  )

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

      modal.hide()
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
<ModalContent
  title="Add automation step"
  size="L"
  showConfirmButton={false}
  showCancelButton={false}
  disabled={!selectedAction}
>
  <Layout noPadding gap="XS">
    <Detail size="S">Apps</Detail>
    <div class="item-list">
      {#each Object.entries(external) as [idx, action]}
        <div
          class="item"
          class:selected={selectedAction === action.name}
          on:click={() => selectAction(action)}
        >
          <div class="item-body">
            <img
              width={20}
              height={20}
              src={getExternalAction(action.stepId)?.icon}
              alt={getExternalAction(action.stepId)?.name}
            />
            <span class="icon-spacing">
              <Body size="XS">
                {action.stepTitle || idx.charAt(0).toUpperCase() + idx.slice(1)}
              </Body>
            </span>
          </div>
        </div>
      {/each}
    </div>
  </Layout>

  <Layout noPadding gap="XS">
    <Detail size="S">Actions</Detail>
    <div class="item-list">
      {#each Object.entries(internal) as [idx, action]}
        {@const isDisabled = checkDisabled(idx) && checkDisabled(idx).disabled}
        <div
          class="item"
          class:disabled={isDisabled}
          class:selected={selectedAction === action.name}
          on:click={isDisabled ? null : () => selectAction(action)}
        >
          <div class="item-body">
            <Icon name={action.icon} />
            <Body size="XS">{action.name}</Body>
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
</ModalContent>

<style>
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
    gap: var(--spacing-m);
    align-items: center;
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item :global(.spectrum-Tags-itemLabel) {
    cursor: pointer;
  }

  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid var(--spectrum-alias-border-color);
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
    min-height: 3.5rem;
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
