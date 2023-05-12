<script>
  import {
    ModalContent,
    Layout,
    Detail,
    Body,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import { admin } from "stores/portal"
  import { externalActions } from "./ExternalActions"

  export let blockIdx

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
    return acc
  }, {})

  const plugins = actions.reduce((acc, elm) => {
    const [k, v] = elm
    if (v.custom) {
      acc[k] = v
    }
    return acc
  }, {})
  console.log(plugins)

  const selectAction = action => {
    actionVal = action
    selectedAction = action.name
  }

  async function addBlockToAutomation() {
    try {
      const newBlock = automationStore.actions.constructBlock(
        "ACTION",
        actionVal.stepId,
        actionVal
      )
      await automationStore.actions.addBlockToAutomation(newBlock, blockIdx + 1)
    } catch (error) {
      notifications.error("Error saving automation")
    }
  }
</script>

<ModalContent
  title="Add automation step"
  confirmText="Save"
  size="M"
  disabled={!selectedAction}
  onConfirm={addBlockToAutomation}
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
              width="20"
              height="20"
              src={externalActions[action.stepId].icon}
              alt="zapier"
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
        {@const isDisabled = disabled[idx] && disabled[idx].disabled}
        <div
          class="item"
          class:disabled={isDisabled}
          class:selected={selectedAction === action.name}
          on:click={isDisabled ? null : () => selectAction(action)}
        >
          <div class="item-body">
            <Icon name={action.icon} />
            <Body size="XS">{action.name}</Body>
            {#if isDisabled}
              <Icon name="Help" tooltip={disabled[idx].message} />
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
        {#each Object.entries(plugins) as [idx, action]}
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
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
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
</style>
