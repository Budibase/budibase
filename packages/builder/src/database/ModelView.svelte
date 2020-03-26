<script>
  import { tick } from "svelte"
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import Select from "../common/Select.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import getIcon from "../common/icon"
  import FieldView from "./FieldView.svelte"
  import Modal from "../common/Modal.svelte"
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
  import { store, backendUiStore } from "../builderStore"
  import { common, hierarchy } from "../../../core/src"
  import { getNode } from "../common/core"
  import { templateApi, pipe, validate } from "../common/core"
  import ActionsHeader from "./ActionsHeader.svelte"
  import ErrorsBox from "../common/ErrorsBox.svelte"

  let record
  let getIndexAllowedRecords
  let editingField = false
  let fieldToEdit
  let isNewField = false
  let newField
  let editField
  let deleteField
  let onFinishedFieldEdit
  let editIndex

  $: models = $store.hierarchy.children
  $: parent = record && record.parent()
  $: isChildModel = parent.name !== "root"
  $: modelExistsInHierarchy = getNode(
    $store.hierarchy,
    $store.currentNode.nodeId
  )

  store.subscribe($store => {
    record = $store.currentNode
    const flattened = hierarchy.getFlattenedHierarchy($store.hierarchy)

    getIndexAllowedRecords = compose(
      join(", "),
      map(id => flattened.find(n => n.nodeId === id).name),
      filter(id => flattened.some(n => n.nodeId === id)),
      get("allowedRecordNodeIds")
    )

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
    if (record.collectionName === "") {
      record.collectionName = pluralName(ev.target.value)
    }
  }
</script>

<div class="root">
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
    <h4 class="budibase__label--big">Settings</h4>

    {#if $store.errors && $store.errors.length > 0}
      <ErrorsBox errors={$store.errors} />
    {/if}

    <form class="uk-form-stacked">

      <Textbox label="Name" bind:text={record.name} on:change={nameChanged} />
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
        {#each record ? record.fields : [] as field}
          <tr>
            <td>
              <i class="ri-more-line" on:click={() => editField(field)} />
            </td>
            <td>
              <div>{field.name}</div>
            </td>
            <td>{field.type}</td>
            <td>{field.typeOptions.values}</td>
            <td>
              <i
                class="ri-delete-bin-6-line hoverable"
                on:click={() => deleteField(field)} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    {#if modelExistsInHierarchy}
      <div class="uk-margin">
        <ActionButton color="primary" on:click={store.newChildRecord}>
          Create Child Model on {record.name}
        </ActionButton>
        <ActionButton
          color="primary"
          on:click={async () => {
            backendUiStore.actions.modals.show('VIEW')
            await tick()
            store.newChildIndex()
          }}>
          Create Child View on {record.name}
        </ActionButton>
      </div>
    {/if}
    <ActionsHeader />
  {:else}
    <FieldView
      field={fieldToEdit}
      onFinished={onFinishedFieldEdit}
      allFields={record.fields}
      store={$store} />
  {/if}
</div>

<style>
  .root {
    height: 100%;
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
