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
  <div class="actions-list" slot="sidebar">
    <Layout>
      <ActionMenu>
        <Button slot="control" secondary>Add Action</Button>
        {#each actionTypes as actionType}
          <MenuItem on:click={addAction(actionType)}>
            {actionType.name}
          </MenuItem>
        {/each}
      </ActionMenu>

      {#if actions && actions.length > 0}
        <div
          class="action-dnd-container"
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
            >
              <div
                class="action-header"
                class:selected={action === selectedAction}
                on:click={selectAction(action)}
              >
                {index + 1}.
                {action[EVENT_TYPE_KEY]}
              </div>
              <div
                on:click={() => deleteAction(index)}
                style="margin-left: auto;"
              >
                <Icon size="S" hoverable name="Close" />
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </Layout>
  </div>
  <Layout>
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
  .action-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: var(--spacing-s);
  }

  .action-header {
    margin-bottom: var(--spacing-m);
    font-size: var(--font-size-s);
    color: var(--grey-7);
    font-weight: 600;
  }

  .action-header:hover,
  .action-header.selected {
    cursor: pointer;
    color: var(--ink);
  }

  .action-container {
    border-bottom: 1px solid var(--grey-1);
    display: flex;
    align-items: center;
  }
  .action-container:last-child {
    border-bottom: none;
  }
</style>
