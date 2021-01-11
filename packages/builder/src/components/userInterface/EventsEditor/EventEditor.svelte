<script>
  import {
    Button,
    TextButton,
    Body,
    DropdownMenu,
    ModalContent,
  } from "@budibase/bbui"
  import { AddIcon, ArrowDownIcon } from "components/common/Icons/"
  import actionTypes from "./actions"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()
  const eventTypeKey = "##eventHandlerType"

  export let event

  let addActionButton
  let addActionDropdown
  let selectedAction

  let draftEventHandler = { parameters: [] }

  $: actions = event || []
  $: selectedActionComponent =
    selectedAction &&
    actionTypes.find(t => t.name === selectedAction[eventTypeKey]).component

  const updateEventHandler = (updatedHandler, index) => {
    actions[index] = updatedHandler
  }

  const deleteAction = index => {
    actions.splice(index, 1)
    actions = actions
  }

  const addAction = actionType => () => {
    const newAction = {
      parameters: {},
      [eventTypeKey]: actionType.name,
    }
    actions.push(newAction)
    selectedAction = newAction
    actions = actions
    addActionDropdown.hide()
  }

  const selectAction = action => () => {
    selectedAction = action
  }

  const saveEventData = () => {
    dispatch("change", actions)
  }
</script>

<div class="actions-container">
  <div class="actions-list">
    <div>
      <div bind:this={addActionButton}>
        <TextButton text small blue on:click={addActionDropdown.show}>
          <div style="height: 20px; width: 20px;">
            <AddIcon />
          </div>
          Add Action
        </TextButton>
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
              {index + 1}. {action[eventTypeKey]}
            </span>
            <!-- <Body small lh>{index + 1}. {action[eventTypeKey]}</Body> -->
            <!-- <div class="row-expander" class:rotate={action !== selectedAction}>
              <ArrowDownIcon />
            </div> -->
          </div>
          <!-- {#if action === selectedAction}
            <div class="selected-action-container">
              <svelte:component
                this={selectedActionComponent}
                parameters={selectedAction.parameters} />
              <div class="delete-action-button">
                <TextButton text medium on:click={() => deleteAction(index)}>
                  Delete
                </TextButton>
              </div>
            </div>
          {/if} -->
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
        <div class="delete-action-button">
          <!-- <TextButton text medium on:click={() => deleteAction(index)}>
            Delete
          </TextButton> -->
        </div>
      </div>
    {/if}
    <Button thin blue on:click={saveEventData}>Save</Button>
  </div>
</div>

<a href="https://docs.budibase.com">Learn more about Actions</a>

<style>
  .action-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: var(--spacing-m);
  }

  .action-header > span {
    margin-bottom: var(--spacing-m);
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
    font-size: var(--font-size-m);
    cursor: pointer;
  }

  .available-action:hover {
    background: var(--grey-2);
  }

  .actions-container {
    height: 40vh;
    display: grid;
    grid-gap: var(--spacing-m);
    grid-template-columns: 15% 1fr;
    grid-auto-flow: column;
    min-height: 0;
    padding-top: 0;
    overflow-y: auto;
  }

  .action-container {
    border: var(--border-light);
    border-width: 1px 0 0 0;
  }

  .selected-action-container {
    padding-bottom: var(--spacing-s);
    padding-top: var(--spacing-s);
  }

  .delete-action-button {
    padding-top: var(--spacing-l);
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
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
