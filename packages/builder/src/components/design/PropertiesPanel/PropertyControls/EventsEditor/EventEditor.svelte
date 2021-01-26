<script>
  import {
    Button,
    Body,
    DropdownMenu,
    ModalContent,
    Spacer,
  } from "@budibase/bbui"
  import { AddIcon, ArrowDownIcon } from "components/common/Icons/"
  import actionTypes from "./actions"
  import { createEventDispatcher } from "svelte"
  import { automationStore } from "builderStore"

  const EVENT_TYPE_KEY = "##eventHandlerType"

  export let actions

  let addActionButton
  let addActionDropdown
  let selectedAction

  $: selectedActionComponent =
    selectedAction &&
    actionTypes.find(t => t.name === selectedAction[EVENT_TYPE_KEY]).component

  const deleteAction = index => {
    actions.splice(index, 1)
    actions = actions
  }

  const addAction = actionType => () => {
    const newAction = {
      parameters: {},
      [EVENT_TYPE_KEY]: actionType.name,
    }
    actions.push(newAction)
    selectedAction = newAction
    actions = actions
    addActionDropdown.hide()
  }

  const selectAction = action => () => {
    selectedAction = action
  }
</script>

<div class="actions-container">
  <div class="actions-list">
    <div>
      <div bind:this={addActionButton}>
        <Spacer small />
        <Button wide secondary on:click={addActionDropdown.show}>
          Add Action
        </Button>
        <Spacer medium />
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
      {#each actions as action, index}
        <div class="action-container">
          <div class="action-header" on:click={selectAction(action)}>
            <span class:selected={action === selectedAction}>
              {index + 1}. {action[EVENT_TYPE_KEY]}
            </span>
          </div>
          <i
            class="ri-close-fill"
            style="margin-left: auto;"
            on:click={() => deleteAction(index)} />
        </div>
      {/each}
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

  .action-header > span {
    margin-bottom: var(--spacing-m);
    font-size: var(--font-size-xs);
  }

  .action-header > span:hover,
  .selected {
    cursor: pointer;
    font-weight: 500;
  }

  .actions-list {
    border: var(--border-light);
    padding: var(--spacing-s);
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
    grid-gap: var(--spacing-m);
    grid-template-columns: 260px 1fr;
    grid-auto-flow: column;
    min-height: 0;
    padding-top: 0;
    overflow-y: auto;
  }

  .action-container {
    border-top: var(--border-light);
    display: flex;
    align-items: center;
  }

  .selected-action-container {
    padding: var(--spacing-xl);
  }

  a {
    flex: 1;
    color: var(--grey-5);
    font-size: var(--font-size-s);
    text-decoration: none;
  }

  a:hover {
    color: var(--blue);
  }
</style>
