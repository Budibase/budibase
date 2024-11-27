<script>
  import {
    ModalContent,
    Layout,
    Detail,
    Icon,
    notifications,
    Tags,
    Tag,
  } from "@budibase/bbui"
  import { AutomationActionStepId } from "@budibase/types"
  import { automationStore, selectedAutomation } from "stores/builder"
  import { admin, licensing } from "stores/portal"
  import { externalActions } from "./ExternalActions"
  import { TriggerStepID, ActionStepID } from "constants/backend/automations"

  export let block
  export let modal

  let syncAutomationsEnabled = $licensing.syncAutomationsEnabled
  let triggerAutomationRunEnabled = $licensing.triggerAutomationRunEnabled
  let collectBlockAllowedSteps = [TriggerStepID.APP, TriggerStepID.WEBHOOK]
  let selectedAction
  let actions = Object.entries($automationStore.blockDefinitions.ACTION).filter(
    entry => {
      const [key] = entry
      return key !== AutomationActionStepId.BRANCH
    }
  )
  let lockedFeatures = [
    ActionStepID.COLLECT,
    ActionStepID.TRIGGER_AUTOMATION_RUN,
  ]

  $: blockRef = $selectedAutomation.blockRefs?.[block.id]
  $: lastStep = blockRef?.terminating
  $: pathSteps = block.id
    ? automationStore.actions.getPathSteps(
        blockRef.pathTo,
        $selectedAutomation?.data
      )
    : []

  $: collectBlockExists = pathSteps?.some(
    step => step.stepId === ActionStepID.COLLECT
  )

  const disabled = () => {
    return {
      SEND_EMAIL_SMTP: {
        disabled: !$admin.checklist.smtp.checked,
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

  const collectDisabledMessage = () => {
    if (collectBlockExists) {
      return "Only one Collect step allowed"
    }
    if (!lastStep) {
      return "Only available as the last step"
    }
  }

  const external = actions.reduce((acc, elm) => {
    const [k, v] = elm
    if (!v.internal && !v.custom) {
      acc[k] = v
    }
    return acc
  }, {})

  const internal = actions.reduce((acc, elm) => {
    const [k, v] = elm
    if (v.internal) {
      acc[k] = v
    }
    delete acc.LOOP

    // Filter out Collect block if not App Action or Webhook
    if (
      !collectBlockAllowedSteps.includes(
        $selectedAutomation.data.definition.trigger.stepId
      )
    ) {
      delete acc.COLLECT
    }
    return acc
  }, {})

  const plugins = actions.reduce((acc, elm) => {
    const [k, v] = elm
    if (v.custom) {
      acc[k] = v
    }
    return acc
  }, {})

  const selectAction = async action => {
    selectedAction = action.name

    try {
      const newBlock = automationStore.actions.constructBlock(
        "ACTION",
        action.stepId,
        action
      )

      await automationStore.actions.addBlockToAutomation(
        newBlock,
        blockRef ? blockRef.pathTo : block.pathTo
      )
      modal.hide()
    } catch (error) {
      console.error(error)
      notifications.error("Error saving automation")
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ModalContent
  title="Add automation step"
  size="XL"
  showConfirmButton={false}
  showCancelButton={false}
  disabled={!selectedAction}
>
  <Layout noPadding gap="XS">
    <Detail size="L">Actions</Detail>
    <div class="item-list">
      {#each Object.entries(internal) as [idx, action]}
        {@const isDisabled = disabled()[idx] && disabled()[idx].disabled}
        <div
          class="item"
          class:disabled={isDisabled}
          class:selected={selectedAction === action.name}
          on:click={isDisabled ? null : () => selectAction(action)}
        >
          <div class="item-body">
            <div class="icon-background">
              <Icon size="M" name={action.icon} />
            </div>
            <p>
              {action.name}
            </p>
            {#if isDisabled && !syncAutomationsEnabled && !triggerAutomationRunEnabled && lockedFeatures.includes(action.stepId)}
              <Tags>
                <Tag icon="LockClosed">Premium</Tag>
              </Tags>
            {:else if isDisabled}
              <Icon name="Help" tooltip={disabled()[idx].message} />
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </Layout>

  {#if Object.keys(plugins).length}
    <Layout noPadding gap="XS">
      <Detail size="L">Plugins</Detail>
      <div class="item-list">
        {#each Object.entries(plugins) as [_, action]}
          <div
            class="item"
            class:selected={selectedAction === action.name}
            on:click={() => selectAction(action)}
          >
            <div class="item-body">
              <div class="icon-background">
                <Icon size="M" name={action.icon} />
              </div>
              <p>
                {action.name}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </Layout>
  {/if}
  <Layout noPadding gap="XS">
    <Detail size="L">Apps</Detail>
    <div class="item-list">
      {#each Object.entries(external) as [idx, action]}
        <div
          class="item"
          class:selected={selectedAction === action.name}
          on:click={() => selectAction(action)}
        >
          <div class="item-body">
            <div class="icon-background-external">
              <img
                width={20}
                height={20}
                src={externalActions[action.stepId].icon}
                alt={externalActions[action.stepId].name}
              />
            </div>
            <p>
              {action.stepTitle || idx.charAt(0).toUpperCase() + idx.slice(1)}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </Layout>
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
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    grid-gap: 10px;
  }

  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid var(--spectrum-global-color-gray-200);
    border-radius: 6px;
    box-sizing: border-box;
    border-width: 1px;
  }
  .item p {
    font-size: 16px !important;
    margin: 0;
    color: var(--spectrum-global-color-gray-900);
  }
  :is(.disabled) p {
    color: var(--spectrum-global-color-gray-600);
  }

  .item:not(.disabled):hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
  .disabled {
    background: var(--spectrum-global-color-gray-200);
    cursor: auto;
    color: var(--spectrum-global-color-gray-300) !important;
  }
  .icon-background {
    background-color: #5e12f7;
    padding: 0;
    border-radius: 6px;
    min-height: 28px;
    min-width: 28px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  .icon-background-external {
    background-color: var(--spectrum-global-color-gray-200);
    padding: 0;
    border-radius: 6px;
    min-height: 28px;
    min-width: 28px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  img {
    border-radius: 6px;
    padding: 2px;
  }
</style>
