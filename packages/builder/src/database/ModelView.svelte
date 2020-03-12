<script>
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import getIcon from "../common/icon"
  import FieldView from "./FieldView.svelte"
  import Modal from "../common/Modal.svelte"
  import { map, join, filter, some, find, keys, isDate } from "lodash/fp"
  import { store } from "../builderStore"
  import { common, hierarchy as h } from "../../../core/src"
  import { templateApi, pipe, validate } from "../common/core"

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

  store.subscribe($store => {
    record = $store.currentNode
    const flattened = h.getFlattenedHierarchy($store.hierarchy)
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

  let getTypeOptions = typeOptions =>
    pipe(
      typeOptions,
      [
        keys,
        map(
          k =>
            `<span style="color:var(--slate)">${k}: </span>${getTypeOptionsValueText(
              typeOptions[k]
            )}`
        ),
        join("<br>"),
      ]
    )

  const nameChanged = ev => {
    const pluralName = n => `${n}s`
    if (record.collectionName === "") {
      record.collectionName = pluralName(ev.target.value)
    }
  }
</script>

<div class="root">

  <form class="uk-form-stacked">
    <h3 class="budibase__title--3">
      <i class="ri-list-settings-line" />
      Create / Edit Model
    </h3>

    <h3 class="budibase__label--big">Settings</h3>

    <Textbox label="Name" bind:text={record.name} on:change={nameChanged} />
    {#if !record.isSingle}
      <Textbox label="Collection Name" bind:text={record.collectionName} />
      <Textbox
        label="Estimated Record Count"
        bind:text={record.estimatedRecordCount} />
    {/if}
    <div class="recordkey">{record.nodeKey()}</div>

  </form>
  <div class="table-controls">
    <span class="budibase__label--big">Fields</span>
    <h4 class="hoverable" on:click={newField}>Add new field</h4>
  </div>
  <!-- <h3 class="budibase__label--big">
    Fields
    <span class="add-field-button" on:click={newField}>
      {@html getIcon('plus')}
    </span>
  </h3> -->

  <table class="fields-table uk-table budibase__table">
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
      {#each record.fields as field}
        <tr>
          <td>
            <i class="ri-more-line" on:click={() => editField(field)} />
          </td>
          <td>
            <div>{field.name}</div>
          </td>
          <td>{field.type}</td>
          <td>({console.log(field.typeOptions)}) {field.typeOptions.values}</td>
          <td>
            <!-- <span class="edit-button" on:click={() => editField(field)}>
              {@html getIcon('edit')}
            </span> -->
            <span class="edit-button" on:click={() => deleteField(field)}>
              {@html getIcon('trash')}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if editingField}
    <Modal
      bind:isOpen={editingField}
      onClosed={() => onFinishedFieldEdit(false)}>

      <h3 class="budibase__title--3">
        <i class="ri-file-list-line" />
        Create / Edit Field
      </h3>
      <FieldView
        field={fieldToEdit}
        onFinished={onFinishedFieldEdit}
        allFields={record.fields}
        store={$store} />
    </Modal>
  {/if}

  <!-- <h3 class="budibase__title--3">Indexes</h3> -->

  <!-- {#each record.indexes as index}
    <div class="index-container">
      <div class="index-name">
        {index.name}
        <span style="margin-left: 7px" on:click={() => editIndex(index)}>
          {@html getIcon('edit')}
        </span>
      </div>
      <div class="index-field-row">
        <span class="index-label">records indexed:</span>
        <span>{getIndexAllowedRecords(index)}</span>
        <span class="index-label" style="margin-left: 15px">type:</span>
        <span>{index.indexType}</span>
      </div>
      <div class="index-field-row">
        <span class="index-label">map:</span>
        <code class="index-mapfilter">{index.map}</code>
      </div>
      {#if index.filter}
        <div class="index-field-row">
          <span class="index-label">filter:</span>
          <code class="index-mapfilter">{index.filter}</code>
        </div>
      {/if}
    </div>
  {:else}
    <div class="no-indexes">No indexes added.</div>
  {/each} -->

</div>

<style>
  .root {
    height: 100%;
    padding: 2rem;
  }

  .recordkey {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary100);
  }

  .fields-table {
    margin: 1rem 1rem 0rem 0rem;
    border-collapse: collapse;
  }

  .edit-button {
    cursor: pointer;
    color: var(--secondary25);
  }

  .edit-button:hover {
    cursor: pointer;
    color: var(--secondary75);
  }

  tbody > tr:hover {
    background-color: var(--primary10);
  }

  tbody > tr:hover .edit-button {
    color: var(--secondary75);
  }

  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ri-more-line:hover {
    cursor: pointer;
  }

  h4 {
    margin: 0;
  }
</style>
