<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { Button, DropdownMenu, Spacer } from "@budibase/bbui"
  import actionTypes from "./actions"

  const flipDurationMs = 150

  const EVENT_TYPE_KEY = "##eventHandlerType"

  export let actions

  // dndzone needs an id on the array items, so this adds some temporary ones.
  if (actions) {
    actions = actions.map((action, i) => {
      return { ...action, id: i }
    })
  }

  let addActionButton
  let addActionDropdown
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
      id: actions ? actions.length + 1 : 0,
    }
    if (!actions) {
      actions = []
    }
    actions = [...actions, newAction]
    selectedAction = newAction
    addActionDropdown.hide()
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

<div class="actions-container">
  <div class="actions-list">
    <div>
      <div bind:this={addActionButton}>
        <Button wide secondary on:click={addActionDropdown.show}>
          Add Action
        </Button>
        <Spacer small />
      </div>
      <DropdownMenu
        bind:this={addActionDropdown}
        anchor={addActionButton}
        align="right">
        <div class="available-actions-container">
          {#each actionTypes as actionType}
            <div class="available-action" on:click={addAction(actionType)}>
              <span>{actionType.name}</span>
            </div>
          {/each}
        </div>
      </DropdownMenu>
    </div>

    {#if actions && actions.length > 0}
      <div
        class="action-dnd-container"
        use:dndzone={{ items: actions, flipDurationMs, dropTargetStyle: { outline: 'none' } }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}>
        {#each actions as action, index (action.id)}
          <div
            class="action-container"
            animate:flip={{ duration: flipDurationMs }}>
            <div
              class="action-header"
              class:selected={action === selectedAction}
              on:click={selectAction(action)}>
              {index + 1}.
              {action[EVENT_TYPE_KEY]}
            </div>
            <i
              class="ri-close-fill"
              style="margin-left: auto;"
              on:click={() => deleteAction(index)} />
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <div class="action-config">
    {#if selectedAction}
      <div class="selected-action-container">
        <svelte:component
          this={selectedActionComponent}
          parameters={selectedAction.parameters} />
      </div>
    {/if}
  </div>
</div>

<style>
  .action-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: var(--spacing-m);
  }

  .action-header {
    margin-bottom: var(--spacing-m);
    font-size: var(--font-size-xs);
    color: var(--grey-7);
    font-weight: 500;
  }

  .action-header:hover,
  .action-header.selected {
    cursor: pointer;
    color: var(--ink);
  }

  .actions-list {
    border-right: var(--border-light);
    padding: var(--spacing-l);
  }

  .available-action {
    padding: var(--spacing-s);
    font-size: var(--font-size-xs);
    cursor: pointer;
  }

  .available-action:hover {
    background: var(--grey-2);
  }

  .actions-container {
    height: 40vh;
    display: grid;
    grid-template-columns: 260px 1fr;
    grid-auto-flow: column;
    min-height: 0;
    padding-top: 0;
    overflow-y: auto;
  }

  .action-container {
    border-bottom: 1px solid var(--grey-1);
    display: flex;
    align-items: center;
  }
  .action-container:last-child {
    border-bottom: none;
  }

  .selected-action-container {
    padding: var(--spacing-l);
  }

  i:hover {
    color: var(--red);
    cursor: pointer;
  }
</style>
