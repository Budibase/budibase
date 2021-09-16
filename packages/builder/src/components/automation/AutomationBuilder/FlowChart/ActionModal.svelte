<script>
  import { ModalContent, Layout, Detail, Body, Icon } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import { database } from "stores/backend"
  import { externalActions } from "./ExternalActions"
  $: instanceId = $database._id

  let selectedAction
  let actionVal
  let actions = Object.entries($automationStore.blockDefinitions.ACTION)
  export let blockComplete

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
    return acc
  }, {})

  const selectAction = action => {
    actionVal = action
    selectedAction = action.name
  }

  async function addBlockToAutomation() {
    const newBlock = $automationStore.selectedAutomation.constructBlock(
      "ACTION",
      actionVal.stepId,
      actionVal
    )
    automationStore.actions.addBlockToAutomation(newBlock)
    await automationStore.actions.save(
      $automationStore.selectedAutomation?.automation
    )
  }
</script>

<ModalContent
  title="Create Automation"
  confirmText="Save"
  size="M"
  disabled={!selectedAction}
  onConfirm={() => {
    blockComplete = true
    addBlockToAutomation()
  }}
>
  <Body size="XS">Select an app or event.</Body>
  <Layout noPadding>
    <Body size="S">Apps</Body>

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
              <Body size="XS">{idx.charAt(0).toUpperCase() + idx.slice(1)}</Body
              ></span
            >
          </div>
        </div>
      {/each}
    </div>

    <Detail size="S">Actions</Detail>

    <div class="item-list">
      {#each Object.entries(internal) as [idx, action]}
        <div
          class="item"
          class:selected={selectedAction === action.name}
          on:click={() => selectAction(action)}
        >
          <div class="item-body">
            <Icon name={action.icon} />
            <span class="icon-spacing">
              <Body size="XS">{action.name}</Body></span
            >
          </div>
        </div>
      {/each}
    </div>
  </Layout>
</ModalContent>

<style>
  .icon-spacing {
    margin-left: var(--spacing-m);
  }
  .item-body {
    display: flex;
    margin-left: var(--spacing-m);
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: var(--spectrum-alias-grid-baseline);
  }

  .item {
    cursor: pointer;
    display: grid;
    grid-gap: var(--spectrum-alias-grid-margin-xsmall);
    padding: var(--spectrum-alias-item-padding-s);
    background: var(--spectrum-alias-background-color-secondary);
    transition: 0.3s all;
    border: solid #3b3d3c;
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 2px;
  }
  .item:hover,
  .selected {
    background: var(--spectrum-alias-background-color-tertiary);
  }
</style>
