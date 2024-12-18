<script>
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import {
    Icon,
    Button,
    Layout,
    DrawerContent,
    ActionButton,
    Search,
  } from "@budibase/bbui"
  import { getAvailableActions } from "./index"
  import { generate } from "shortid"
  import {
    getEventContextBindings,
    getActionBindings,
    makeStateBinding,
    updateReferencesInObject,
  } from "@/dataBinding"
  import { cloneDeep } from "lodash/fp"

  const flipDurationMs = 150
  const EVENT_TYPE_KEY = "##eventHandlerType"
  const actionTypes = getAvailableActions()

  export let key
  export let actions
  export let bindings = []
  export let nested
  export let componentInstance

  let actionQuery
  let selectedAction = actions?.length ? actions[0] : null
  let originalActionIndex

  const setUpdateActions = actions => {
    return actions
      ? cloneDeep(actions)
          .filter(action => {
            return (
              action[EVENT_TYPE_KEY] === "Update State" &&
              action.parameters?.type === "set" &&
              action.parameters.key
            )
          })
          .reduce((acc, action) => {
            acc[action.id] = action
            return acc
          }, {})
      : []
  }

  // Snapshot original action state
  let updateStateActions = setUpdateActions(actions)

  $: {
    // Ensure parameters object is never null
    if (selectedAction && !selectedAction.parameters) {
      selectedAction.parameters = {}
    }
  }
  $: parsedQuery =
    typeof actionQuery === "string" ? actionQuery.toLowerCase().trim() : ""
  $: showAvailableActions = !actions?.length
  $: mappedActionTypes = actionTypes.reduce((acc, action) => {
    let parsedName = action.name.toLowerCase().trim()
    if (parsedQuery.length && parsedName.indexOf(parsedQuery) < 0) {
      return acc
    }
    acc[action.type] = acc[action.type] || []
    acc[action.type].push(action)
    return acc
  }, {})

  // These are ephemeral bindings which only exist while executing actions
  $: eventContextBindings = getEventContextBindings({
    componentInstance,
    settingKey: key,
  })
  $: actionContextBindings = getActionBindings(actions, selectedAction?.id)

  $: allBindings = getAllBindings(
    bindings,
    [...eventContextBindings, ...actionContextBindings],
    actions
  )
  $: {
    // Ensure each action has a unique ID
    if (actions) {
      actions.forEach(action => {
        if (!action.id) {
          action.id = generate()
        }
      })
    }
  }
  $: selectedActionComponent =
    selectedAction &&
    actionTypes.find(t => t.name === selectedAction[EVENT_TYPE_KEY])?.component
  $: {
    // Select the first action if we delete an action
    if (selectedAction && !actions?.includes(selectedAction)) {
      selectedAction = actions?.[0]
    }
  }

  const deleteAction = index => {
    // Check if we're deleting the selected action
    const selectedIndex = actions.indexOf(selectedAction)
    const isSelected = index === selectedIndex

    // Delete the action
    actions.splice(index, 1)
    actions = actions

    // Select a new action if we deleted the selected one
    if (isSelected) {
      selectedAction = actions?.length ? actions[0] : null
    }

    // Update action binding references
    updateReferencesInObject({
      obj: actions,
      modifiedIndex: index,
      action: "delete",
      label: "actions",
    })
  }

  const toggleActionList = () => {
    actionQuery = null
    showAvailableActions = !showAvailableActions
  }

  const addAction = actionType => {
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
    originalActionIndex = actions.findIndex(item => item.id === action.id)
  }

  const onAddAction = actionType => {
    addAction(actionType)
    toggleActionList()
  }

  function handleDndConsider(e) {
    actions = e.detail.items

    // set the initial index of the action being dragged
    if (e.detail.info.trigger === "draggedEntered") {
      originalActionIndex = actions.findIndex(
        action => action.id === e.detail.info.id
      )
    }
  }
  function handleDndFinalize(e) {
    actions = e.detail.items

    // Update action binding references
    updateReferencesInObject({
      obj: actions,
      modifiedIndex: actions.findIndex(
        action => action.id === e.detail.info.id
      ),
      action: "move",
      label: "actions",
      originalIndex: originalActionIndex,
    })

    originalActionIndex = -1
  }

  const getAllBindings = (actionBindings, eventContextBindings, actions) => {
    let allBindings = []
    let cloneActionBindings = cloneDeep(actionBindings)
    if (!actions) {
      return []
    }

    // Ensure bindings are generated for all "update state" action keys
    actions
      .filter(action => {
        // Find all "Update State" actions which set values
        return (
          action[EVENT_TYPE_KEY] === "Update State" &&
          action.parameters?.type === "set" &&
          action.parameters.key
        )
      })
      .forEach(action => {
        // Check we have a binding for this action, and generate one if not
        const stateBinding = makeStateBinding(action.parameters.key)
        const hasKey = actionBindings.some(binding => {
          return binding.runtimeBinding === stateBinding.runtimeBinding
        })
        if (!hasKey) {
          let existing = updateStateActions[action.id]
          if (existing) {
            const existingBinding = makeStateBinding(existing.parameters.key)
            cloneActionBindings = cloneActionBindings.filter(
              binding =>
                binding.runtimeBinding !== existingBinding.runtimeBinding
            )
          }
          allBindings.push(stateBinding)
        }
      })
    // Get which indexes are asynchronous automations as we want to filter them out from the bindings
    const asynchronousAutomationIndexes = actions
      .map((action, index) => {
        if (
          action[EVENT_TYPE_KEY] === "Trigger Automation" &&
          !action.parameters?.synchronous
        ) {
          return index
        }
      })
      .filter(index => index !== undefined)

    // Based on the above, filter out the asynchronous automations from the bindings
    let contextBindings = asynchronousAutomationIndexes
      ? eventContextBindings.filter((binding, index) => {
          return !asynchronousAutomationIndexes.includes(index)
        })
      : eventContextBindings

    allBindings = contextBindings
      .concat(cloneActionBindings)
      .concat(allBindings)

    return allBindings
  }

  const toDisplay = eventKey => {
    const type = actionTypes.find(action => action.name == eventKey)
    return type?.displayName || type?.name
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
<DrawerContent>
  <Layout noPadding gap="S" slot="sidebar">
    {#if showAvailableActions || !actions?.length}
      <div class="actions-list">
        {#if actions?.length > 0}
          <div>
            <ActionButton
              secondary
              icon={"ArrowLeft"}
              on:click={toggleActionList}
            >
              Back
            </ActionButton>
          </div>
        {/if}
        <div class="search-wrap">
          <Search placeholder="Search" bind:value={actionQuery} />
        </div>
        {#each Object.entries(mappedActionTypes) as [categoryId, category], idx}
          <div class="heading" class:top-entry={idx === 0}>{categoryId}</div>
          <ul>
            {#each category as actionType}
              <li on:click={onAddAction(actionType)}>
                <span class="action-name">
                  {actionType.displayName || actionType.name}
                </span>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    {/if}

    {#if actions && actions.length > 0 && !showAvailableActions}
      <div>
        <Button secondary on:click={toggleActionList}>Add Action</Button>
      </div>
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
              {index + 1}.&nbsp;{toDisplay(action[EVENT_TYPE_KEY])}
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
  </Layout>
  <Layout noPadding>
    {#if selectedActionComponent && !showAvailableActions}
      {#key (selectedAction.id, originalActionIndex)}
        <div class="selected-action-container">
          <svelte:component
            this={selectedActionComponent}
            bind:parameters={selectedAction.parameters}
            bindings={allBindings}
            {nested}
          />
        </div>
      {/key}
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

  .actions-list > * {
    padding-bottom: var(--spectrum-global-dimension-static-size-200);
  }

  .actions-list .heading {
    padding-bottom: var(--spectrum-global-dimension-static-size-100);
    padding-top: var(--spectrum-global-dimension-static-size-50);
  }

  .actions-list .heading.top-entry {
    padding-top: 0px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    font-size: var(--font-size-s);
    padding: var(--spacing-m);
    border-radius: 4px;
    background-color: var(--spectrum-global-color-gray-200);
    transition: background-color 130ms ease-in-out, color 130ms ease-in-out,
      border-color 130ms ease-in-out;
    word-wrap: break-word;
  }
  li:not(:last-of-type) {
    margin-bottom: var(--spacing-s);
  }
  li :global(*) {
    transition: color 130ms ease-in-out;
  }
  li:hover {
    color: var(--spectrum-global-color-gray-900);
    background-color: var(--spectrum-global-color-gray-50);
    cursor: pointer;
  }

  .action-name {
    font-weight: 600;
    text-transform: capitalize;
  }
  .heading {
    font-size: var(--font-size-s);
    font-weight: 600;
    text-transform: uppercase;
    color: var(--spectrum-global-color-gray-600);
  }
</style>
