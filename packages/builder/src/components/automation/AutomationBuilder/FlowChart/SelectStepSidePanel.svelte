<script lang="ts">
  import {
    Detail,
    Body,
    Icon,
    notifications,
    Tags,
    Tag,
    Search,
  } from "@budibase/bbui"
  import Panel from "@/components/design/Panel.svelte"
  import { AutomationActionStepId, BlockDefinitionTypes } from "@budibase/types"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { admin, licensing } from "@/stores/portal"
  import { externalActions } from "./ExternalActions"
  import { TriggerStepID, ActionStepID } from "@/constants/backend/automations"
  import type { AutomationStepDefinition } from "@budibase/types"
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"
  import NewPill from "@/components/common/NewPill.svelte"

  export let block
  export let onClose = () => {}

  let searchString: string = ""
  let searchRef: HTMLInputElement | undefined = undefined

  $: syncAutomationsEnabled = $licensing.syncAutomationsEnabled
  $: triggerAutomationRunEnabled = $licensing.triggerAutomationRunEnabled
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

  $: disabledStates = {
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

  $: checkDisabled = (idx: string) => {
    return disabledStates[idx as keyof typeof disabledStates]
  }

  $: categories = [
    {
      name: "Data",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.CREATE_ROW,
          AutomationActionStepId.UPDATE_ROW,
          AutomationActionStepId.DELETE_ROW,
          AutomationActionStepId.QUERY_ROWS,
          AutomationActionStepId.API_REQUEST,
          AutomationActionStepId.EXECUTE_QUERY,
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
      name: "AI",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.PROMPT_LLM,
          AutomationActionStepId.CLASSIFY_CONTENT,
          AutomationActionStepId.TRANSLATE,
          AutomationActionStepId.SUMMARISE,
          AutomationActionStepId.GENERATE_TEXT,
          AutomationActionStepId.EXTRACT_FILE_DATA,
        ].includes(k as AutomationActionStepId)
      ),
    },
    {
      name: "Apps",
      items: actions.filter(([k]) =>
        [
          AutomationActionStepId.OPENAI,
          AutomationActionStepId.zapier,
          AutomationActionStepId.n8n,
          AutomationActionStepId.integromat,
          AutomationActionStepId.discord,
          AutomationActionStepId.slack,
        ].includes(k as AutomationActionStepId)
      ),
    },
  ]

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

  $: filteredCategories = categories
    .map(category => ({
      ...category,
      items: category.items.filter(([_, action]) => {
        const term = searchString.trim().toLowerCase()
        if (!term) return true
        const name = action.name?.toLowerCase() || ""
        const stepTitle = action.stepTitle?.toLowerCase() || ""
        return name.includes(term) || stepTitle.includes(term)
      }),
    }))
    .filter(category => category.items.length > 0)

  $: filteredPlugins = Object.entries(plugins).filter(([_, action]) => {
    const term = searchString.trim().toLowerCase()
    if (!term) return true
    const name = action.name?.toLowerCase() || ""
    const stepTitle = action.stepTitle?.toLowerCase() || ""
    return name.includes(term) || stepTitle.includes(term)
  })

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

  onMount(() => {
    searchRef?.focus()
  })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container" transition:fly|local={{ x: 260, duration: 300 }}>
  <Panel
    title="Automation Step"
    showCloseButton
    onClickCloseButton={onClose}
    customWidth={400}
    borderLeft
  >
    <div class="step-panel-content">
      <div class="search-container">
        <Search
          placeholder="Search"
          value={searchString}
          on:change={e => (searchString = e.detail)}
          bind:inputRef={searchRef}
        />
      </div>
      {#each filteredCategories as category, i}
        {#if i > 0}
          <div class="section-divider" />
        {/if}
        <Detail size="M" weight={600}>{category.name}</Detail>
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
                    width={17.5}
                    height={17.5}
                    src={getExternalAction(action.stepId)?.icon}
                    alt={getExternalAction(action.stepId)?.name}
                    class="external-icon"
                  />
                {:else}
                  <div class="icon-container">
                    <Icon
                      name={action.icon}
                      size="M"
                      color="rgb(142, 185, 252)"
                    />
                  </div>
                {/if}
                <Body size="S" weight="400">
                  {action.internal === false
                    ? action.stepTitle ||
                      idx.charAt(0).toUpperCase() + idx.slice(1)
                    : action.name}
                </Body>
                {#if isDisabled && !syncAutomationsEnabled && !triggerAutomationRunEnabled && lockedFeatures.includes(action.stepId)}
                  <div class="tag-color">
                    <Tags>
                      <Tag icon="lock" emphasized>Premium</Tag>
                    </Tags>
                  </div>
                {:else if isDisabled}
                  <Icon name="question" tooltip={checkDisabled(idx).message} />
                {:else if action.new}
                  <NewPill />
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/each}
      {#if filteredPlugins.length}
        <div class="section-divider" />
        <div class="section-header">
          <Detail size="M" weight={700}>Plugins</Detail>
        </div>
        <div class="item-list">
          {#each filteredPlugins as [_, action]}
            <div
              class="item"
              class:selected={selectedAction === action.name}
              on:click={() => selectAction(action)}
            >
              <div class="item-body">
                <div class="item-icon">
                  <Icon name={action.icon} size="M" />
                </div>
                <div class="item-label">
                  <Body size="S" weight="400">{action.name}</Body>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </Panel>
</div>

<style>
  .container {
    position: fixed;
    right: 0;
    z-index: 99;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }

  .step-panel-content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 10px 15px 10px 15px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .search-container {
    margin-bottom: var(--spacing-xl);
  }
  .section-header,
  .step-panel-content :global(.spectrum-Detail) {
    margin-bottom: var(--spacing-s);
    color: var(--spectrum-global-color-gray-700) !important;
  }
  .section-divider {
    border-top: 0.5px solid var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-200);
    margin: 18px 0 10px 0;
    width: 100%;
  }
  .item-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .item {
    border-radius: 8px;
    padding: var(--spacing-s) var(--spacing-m);
    margin-bottom: 0px;
    transition:
      box-shadow 0.2s,
      background 0.2s;
    border: 0.5px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-alias-background-color-secondary);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
  }
  .icon-container {
    background-color: rgba(75, 117, 255, 0.2);
    border: 0.5px solid rgba(75, 117, 255, 0.2);
    padding: 4px;
    border-radius: 6px;
  }
  .item:not(.disabled):hover,
  .selected {
    background: var(--spectrum-global-color-gray-200);
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
    gap: var(--spacing-m);
    width: 100%;
  }
  .item-icon,
  .external-icon {
    width: 17.5px;
    height: 17.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--spectrum-global-color-gray-100);
    border: 0.5px solid var(--spectrum-global-color-gray-200);
    padding: 4px;
    border-radius: 5px;
  }
  .item-label {
    font-size: 15px;
    font-weight: 400;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--spectrum-global-color-gray-900) !important;
  }
  .tag-color :global(.spectrum-Tags-item) {
    background: var(--spectrum-global-color-gray-300);
  }
</style>
