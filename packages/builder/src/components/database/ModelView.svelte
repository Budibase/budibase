<script>
  import { tick } from "svelte"
  import Textbox from "components/common/Textbox.svelte"
  import Button from "components/common/Button.svelte"
  import Select from "components/common/Select.svelte"
  import ActionButton from "components/common/ActionButton.svelte"
  import getIcon from "components/common/icon"
  import FieldView from "./FieldView.svelte"
  import {
    get,
    compose,
    map,
    join,
    filter,
    some,
    find,
    keys,
    isDate,
  } from "lodash/fp"
  import { store, backendUiStore } from "builderStore"
  import { common, hierarchy } from "../../../../core/src/"
  import { getNode } from "components/common/core"
  import { templateApi, pipe, validate } from "components/common/core"
  import ErrorsBox from "components/common/ErrorsBox.svelte"

  let model
  let editingField = false
  let fieldToEdit
  let isNewField = false
  let newField
  let editField
  let deleteField
  let onFinishedFieldEdit
  let editIndex

  $: parent = model && model.parent()
  $: isChildModel = parent && parent.name !== "root"
  $: modelExistsInHierarchy =
    $store.currentNode && getNode($store.hierarchy, $store.currentNode.nodeId)

  store.subscribe($store => {
    model = $store.currentNode
    const flattened = hierarchy.getFlattenedHierarchy($store.hierarchy)

    newField = () => {
      isNewField = true
      fieldToEdit = templateApi($store.hierarchy).getNewField("string")
      editingField = true
    }

    onFinishedFieldEdit = field => {
      if (field) {
        store.saveField(field)
      }
      editingField = false
    }

    editField = field => {
      isNewField = false
      fieldToEdit = field
      editingField = true
    }

    deleteField = field => {
      store.deleteField(field)
    }

    editIndex = index => {
      store.selectExistingNode(index.nodeId)
    }
  })

  let getTypeOptionsValueText = value => {
    if (
      value === Number.MAX_SAFE_INTEGER ||
      value === Number.MIN_SAFE_INTEGER ||
      new Date(value).getTime() === new Date(8640000000000000).getTime() ||
      new Date(value).getTime() === new Date(-8640000000000000).getTime()
    )
      return "(any)"

    if (value === null) return "(not set)"
    return value
  }

  const nameChanged = ev => {
    const pluralName = n => `${n}s`
    if (model.collectionName === "") {
      model.collectionName = pluralName(ev.target.value)
    }
  }
</script>

<heading>
  {#if !editingField}
    <i class="ri-list-settings-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Model</h3>
  {:else}
    <i class="ri-file-list-line button--toggled" />
    <h3 class="budibase__title--3">Create / Edit Field</h3>
  {/if}
</heading>
{#if !editingField}
  <div class="padding">
    <h4 class="budibase__label--big">Settings</h4>

    {#if $store.errors && $store.errors.length > 0}
      <ErrorsBox errors={$store.errors} />
    {/if}

    <form on:submit|preventDefault class="uk-form-stacked">

      <Textbox label="Name" bind:text={model.name} on:change={nameChanged} />
      {#if isChildModel}
        <div>
          <label class="uk-form-label">Parent</label>
          <div class="uk-form-controls parent-name">{parent.name}</div>
        </div>
      {/if}
    </form>

    <div class="table-controls">
      <span class="budibase__label--big">Fields</span>
      <h4 class="hoverable new-field" on:click={newField}>Add new field</h4>
    </div>

    <table class="uk-table fields-table budibase__table">
      <thead>
        <tr>
          <th>Edit</th>
          <th>Name</th>
          <th>Type</th>
          <th>Values</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each model ? model.fields : [] as field}
          <tr>
            <td>
              <i class="ri-more-line" on:click={() => editField(field)} />
            </td>
            <td>
              <div>{field.name}</div>
            </td>
            <td>{field.type}</td>
            <td>{field.typeOptions.values || ''}</td>
            <td>
              <i
                class="ri-delete-bin-6-line hoverable"
                on:click={() => deleteField(field)} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="uk-margin">
      <ActionButton color="secondary" on:click={store.saveCurrentNode}>
        Save
      </ActionButton>
      {#if modelExistsInHierarchy}
        <ActionButton color="primary" on:click={store.newChildModel}>
          Create Child Model on {model.name}
        </ActionButton>
        <ActionButton
          color="primary"
          on:click={async () => {
            backendUiStore.actions.modals.show('VIEW')
            await tick()
            store.newChildIndex()
          }}>
          Create Child View on {model.name}
        </ActionButton>
        <ActionButton alert on:click={store.deleteCurrentNode}>
          Delete
        </ActionButton>
      {/if}
    </div>
  </div>
{:else}
  <FieldView
    field={fieldToEdit}
    onFinished={onFinishedFieldEdit}
    allFields={model.fields}
    store={$store} />
{/if}

<style>
  .padding {
    padding: 20px;
  }

  .new-field {
    font-size: 16px;
    font-weight: bold;
    color: var(--button-text);
  }

  .fields-table {
    margin: 1rem 1rem 0rem 0rem;
    border-collapse: collapse;
  }

  tbody > tr:hover {
    background-color: var(--primary10);
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ri-more-line:hover {
    cursor: pointer;
  }

  heading {
    padding: 20px 20px 0 20px;
    display: flex;
    align-items: center;
  }

  h3 {
    margin: 0 0 0 10px;
  }

  .parent-name {
    font-weight: bold;
  }
</style>
