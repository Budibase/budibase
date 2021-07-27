<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import {
    Icon,
    Button,
    Layout,
    DrawerContent,
    ActionMenu,
    MenuItem,
  } from "@budibase/bbui"
  import actionTypes from "./actions"
  import { generate } from "shortid"

  const flipDurationMs = 150

  const EVENT_TYPE_KEY = "##eventHandlerType"

  export let actions

  // dndzone needs an id on the array items, so this adds some temporary ones.
  $: {
    if (actions) {
      actions.forEach(action => {
        if (!action.id) {
          action.id = generate()
        }
      })
    }
  }

  let selectedAction = actions?.length ? actions[0] : null

  $: selectedActionComponent =
    selectedAction &&
    actionTypes.find(t => t.name === selectedAction[EVENT_TYPE_KEY]).component

  // Select the first action if we delete an action
  $: {
    if (selectedAction && !actions?.includes(selectedAction)) {
      selectedAction = actions?.[0]
    }
  }

  const deleteAction = index => {
    actions.splice(index, 1)
    actions = actions
  }

  const addAction = actionType => () => {
    const newAction = {
      parameters: {},
      [EVENT_TYPE_KEY]: actionType.name,
      id: generate(),
    }
    if (!actions) {
      actions = []
    }
    actions = [...actions, newAction]
    selectedAction = newAction
  }

  const selectAction = action => () => {
    selectedAction = action
  }

  function handleDndConsider(e) {
    actions = e.detail.items
  }
  function handleDndFinalize(e) {
    actions = e.detail.items
  }
</script>

<DrawerContent>
  <Layout noPadding gap="S" slot="sidebar">
    {#if actions && actions.length > 0}
      <div
        class="actions"
        use:dndzone={{
          items: actions,
          flipDurationMs,
          dropTargetStyle: { outline: "none" },
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
      >
        {#each actions as action, index (action.id)}
          <div
            class="action-container"
            animate:flip={{ duration: flipDurationMs }}
            class:selected={action === selectedAction}
            on:click={selectAction(action)}
          >
            <Icon name="DragHandle" size="XL" />
            <div class="action-header">
              {index + 1}.&nbsp;{action[EVENT_TYPE_KEY]}
            </div>
            <Icon
              name="Close"
              hoverable
              size="S"
              on:click={() => deleteAction(index)}
            />
          </div>
        {/each}
      </div>
    {/if}
    <ActionMenu>
      <Button slot="control" secondary>Add Action</Button>
      {#each actionTypes as actionType}
        <MenuItem on:click={addAction(actionType)}>
          {actionType.name}
        </MenuItem>
      {/each}
    </ActionMenu>
  </Layout>
  <Layout noPadding>
    {#if selectedAction}
      <div class="selected-action-container">
        <svelte:component
          this={selectedActionComponent}
          parameters={selectedAction.parameters}
        />
      </div>
    {/if}
  </Layout>
</DrawerContent>

<style>
  .actions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-s);
  }

  .action-header {
    color: var(--spectrum-global-color-gray-700);

    flex: 1 1 auto;
  }

  .action-container {
    background-color: var(--background);
    padding: var(--spacing-s) var(--spacing-m);
    border-radius: 4px;
    border: var(--border-light);
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    gap: var(--spacing-m);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .action-container:hover,
  .action-container.selected {
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-global-color-gray-500);
    cursor: pointer;
  }
  .action-container:hover .action-header,
  .action-container.selected .action-header {
    color: var(--spectrum-global-color-gray-900);
  }
</style>
