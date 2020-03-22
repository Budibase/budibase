<script>
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import Select from "../common/Select.svelte"
  import getIcon from "../common/icon"
  import FieldView from "./FieldView.svelte"
  import Modal from "../common/Modal.svelte"
  import { map, join, filter, some, find, keys, isDate } from "lodash/fp"
  import { store } from "../builderStore"
  import { common, hierarchy } from "../../../core/src"
  import { templateApi, pipe, validate } from "../common/core"
  import ActionsHeader from "./ActionsHeader.svelte"

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
  let parentRecord

  $: models = $store.hierarchy.children

  store.subscribe($store => {
    record = $store.currentNode
    const flattened = hierarchy.getFlattenedHierarchy($store.hierarchy)
    getIndexAllowedRecords = index =>
      pipe(
        index.allowedRecordNodeIds,
        [
          filter(id => some(n => n.nodeId === id)(flattened)),
          map(id => find(n => n.nodeId === id)(flattened).name),
          join(", "),
        ]
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
      <h4 class="budibase__title--3">Create / Edit Model</h4>
    {:else}
      <i class="ri-file-list-line button--toggled" />
      <h4 class="budibase__title--3">Create / Edit Field</h4>
    {/if}
  </heading>
  {#if !editingField}
    <form class="uk-form-stacked">
      <h3 class="budibase__label--big">Settings</h3>

      <Textbox label="Name" bind:text={record.name} on:change={nameChanged} />

      <div class="horizontal-stack">
        {#if !record.isSingle}
          <Textbox label="Collection Name" bind:text={record.collectionName} />
        {/if}
        <div>
          <label class="uk-form-label">Parent</label>
          <div class="uk-form-controls">
            <Select
              value={parentRecord}
              on:change={e => {
                store.selectExistingNode(record)
                store.newChildRecord()
              }}>
              {#each models as model}
                <option value={model}>{model.name}</option>
              {/each}
            </Select>
          </div>
        </div>
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
          </tr>
        {/each}
      </tbody>
    </table>
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
    padding: 2rem;
  }

  .horizontal-stack {
    display: flex;
    justify-content: space-between
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

  h4 {
    margin: 0 0 0 10px;
  }
</style>
