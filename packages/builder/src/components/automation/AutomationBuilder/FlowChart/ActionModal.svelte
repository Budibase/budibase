<script>
  import {
    ModalContent,
    Layout,
    Detail,
    Body,
    Icon,
    Tooltip,
    notifications,
  } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import { admin } from "stores/portal"
  import { externalActions } from "./ExternalActions"

  export let blockIdx
  export let blockComplete

  const disabled = {
    SEND_EMAIL_SMTP: {
      disabled: !$admin.checklist.smtp.checked,
      message: "Please configure SMTP",
    },
  }

  let selectedAction
  let actionVal
  let actions = Object.entries($automationStore.blockDefinitions.ACTION)

  const external = actions.reduce((acc, elm) => {
    const [k, v] = elm
    if (!v.internal) {
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
    return acc
  }, {})

  const selectAction = action => {
    actionVal = action
    selectedAction = action.name
  }

  async function addBlockToAutomation() {
    try {
      const newBlock = $automationStore.selectedAutomation.constructBlock(
        "ACTION",
        actionVal.stepId,
        actionVal
      )
      automationStore.actions.addBlockToAutomation(newBlock, blockIdx + 1)
      await automationStore.actions.save(
        $automationStore.selectedAutomation?.automation
      )
    } catch (error) {
      notifications.error("Error saving automation")
    }
  }
</script>

<ModalContent
  title="Add action"
  confirmText="Save"
  size="L"
  disabled={!selectedAction}
  onConfirm={() => {
    blockComplete = true
    addBlockToAutomation()
  }}
>
  <Body size="S">Select an app or action.</Body>

  <Layout noPadding>
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
              width="24"
              height="24"
              src={externalActions[action.stepId].icon}
              alt="zapier"
            />
            <span class="icon-spacing">
              <Body size="S">{idx.charAt(0).toUpperCase() + idx.slice(1)}</Body
              ></span
            >
          </div>
        </div>
      {/each}
    </div>

    <Detail size="S">Actions</Detail>

    <div class="item-list">
      {#each Object.entries(internal) as [idx, action]}
        {#if disabled[idx] && disabled[idx].disabled}
          <Tooltip text={disabled[idx].message} direction="bottom">
            <div
              class="item"
              class:selected={selectedAction === action.name}
              class:disabled={true}
              on:click={() => selectAction(action)}
            >
              <div class="item-body">
                <Icon name={action.icon} />
                <span class="icon-spacing">
                  <Body size="S">{action.name}</Body></span
                >
              </div>
            </div>
          </Tooltip>
        {:else}
          <div
            class="item"
            class:selected={selectedAction === action.name}
            on:click={() => selectAction(action)}
          >
            <div class="item-body">
              <Icon name={action.icon} />
              <span class="icon-spacing">
                <Body size="S">{action.name}</Body></span
              >
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  .icon-spacing {
    margin-left: var(--spacing-m);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 270px));
    justify-content: space-between;
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid 1px var(--spectrum-alias-border-color);
    border-radius: 5px;
    box-sizing: border-box;
    min-height: 48px;
    display: flex;
    align-items: center;
  }
  .item:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
