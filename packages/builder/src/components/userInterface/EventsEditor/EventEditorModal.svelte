<script>
  import { store } from "builderStore"
  import {
    TextButton,
    Button,
    Body,
    Heading,
    DropdownMenu,
  } from "@budibase/bbui"
  import { AddIcon } from "components/common/Icons/"
  import { EVENT_TYPE_MEMBER_NAME } from "../../common/eventHandlers"
  import actionTypes from "./actions"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  export let event

  let addActionButton
  let addActionDropdown
  let selectedAction

  let draftEventHandler = { parameters: [] }

  $: actions = event || []
  $: selectedActionComponent =
    selectedAction &&
    actionTypes.find(t => t.name === selectedAction[EVENT_TYPE_MEMBER_NAME])
      .component

  const closeModal = () => {
    dispatch("close")
    draftEventHandler = { parameters: [] }
    actions = []
  }

  const updateEventHandler = (updatedHandler, index) => {
    actions[index] = updatedHandler
  }

  const deleteEventHandler = index => {
    actions.splice(index, 1)
    actions = actions
  }

  const addAction = actionType => () => {
    const newAction = {
      parameters: {},
      [EVENT_TYPE_MEMBER_NAME]: actionType.name,
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
    closeModal()
  }
</script>

<div class="root">

  <div class="header">
    <Heading size="s" color="dark">Actions</Heading>
    <div bind:this={addActionButton}>
      <TextButton text small blue on:click={addActionDropdown.show}>
        Add Action
        <div style="height: 20px; width: 20px;">
          <AddIcon />
        </div>
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

  <div class="actions-container">
    {#if actions && actions.length > 0}
      {#each actions as action, index}
        <div class="action-container">
          <div on:click={selectAction(action)}>
            <Body size="medium">
              {index + 1}. {action[EVENT_TYPE_MEMBER_NAME]}
            </Body>
          </div>
          {#if action === selectedAction}
            <div class="selected-action-container">
              <svelte:component
                this={selectedActionComponent}
                parameters={selectedAction.parameters} />
              <div class="delete-action-button">
                <TextButton text medium>Delete</TextButton>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>

  <div class="footer">
    <a href="https://docs.budibase.com">Learn more about Actions</a>
    <Button secondary on:click={closeModal}>Cancel</Button>
    <Button primary on:click={saveEventData}>Save</Button>
  </div>
</div>

<style>
  .root {
    max-height: 50vh;
    width: 700px;
    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--spacing-xl);
    padding-bottom: 0;
  }

  .available-actions-container {
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
    flex: 1;
    min-height: 0px;
    padding: var(--spacing-xl);
    padding-bottom: var(--spacing-m);
    padding-top: var(--spacing-m);
    border: var(--border-light);
    border-width: 0 0 1px 0;
  }

  .action-container {
    border: var(--border-light);
    border-width: 1px 0 0 0;
  }

  .delete-action-button {
    padding-top: var(--spacing-l);
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
  }

  .footer {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-s);
    padding: var(--spacing-xl);
    padding-top: var(--spacing-m);
  }

  .footer > a {
    flex: 1;
    color: var(--grey-5);
    font-size: var(--font-size-s);
    text-decoration: none;
  }

  .footer > a:hover {
    color: var(--blue);
  }
</style>
