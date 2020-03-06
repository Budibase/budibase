<script>
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import getIcon from "../common/icon"
  import FieldView from "./FieldView.svelte"
  import Modal from "../common/SmallModal.svelte"
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
      pipe(index.allowedRecordNodeIds, [
        filter(id => some(n => n.nodeId === id)(flattened)),
        map(id => find(n => n.nodeId === id)(flattened).name),
        join(", "),
      ])

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
    pipe(typeOptions, [
      keys,
      map(
        k =>
          `<span style="color:var(--slate)">${k}: </span>${getTypeOptionsValueText(
            typeOptions[k]
          )}`
      ),
      join("<br>"),
    ])

  const nameChanged = ev => {
    const pluralName = n => `${n}s`
    if (record.collectionName === "") {
      record.collectionName = pluralName(ev.target.value)
    }
  }
</script>

<div class="root">
  <div class="main">
          <div class="hero">
          <div class="col">
            <div class="hero-content">
              <h1 class="budibase__title--2">Records</h1>
              <p class="hero-para">
                Your database is the brains of your web application. Databases
                store, organize, and process information in a way that makes it
                easy for us to go back and find what we’re looking for.
              </p>
              <a class="hero-cta" href="https://docs.budibase.com/">
                Learn how to build your database with Budibase
              </a>
            </div>
          </div>
          <div class="col">
            <img
              src="/_builder/assets/database.png"
              class="hero-img"
              alt="budibase logo" />
          </div>
        </div>
    <div class="content">
      <div class="header-row">
        <h2 class="budibase__title--2">Create new record</h2>
        <button class="button-cancel">Cancel</button>
        <button class="button-record">Save</button>
        </div>


    <h3 class="budibase__label--medium">Settings</h3>
      <div class="form-main">
        <Textbox label="Name" bind:text={record.name} on:change={nameChanged} />
        <!--
        {#if !record.isSingle}
          <Textbox label="Collection Name:" bind:text={record.collectionName} />
          <Textbox
            label="Estimated Record Count:"
            bind:text={record.estimatedRecordCount} />
        {/if}
        -->
        <div class="recordkeycontainer">
          <div class="label">Record Key</div>
          <div class="recordkeybox">
            <div class="recordkey">{record.nodeKey()}</div>
          </div>
        </div>
      </div>
      


  <h3 class="budibase__title--3">
    Fields
    <span class="add-field-button" on:click={newField}>
      Add new field
    </span>
  </h3>

  {#if record.fields.length > 0}
    <table class="fields-table uk-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Values</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {#each record.fields as field}
          <tr>
            <td>{field.name}</td>
            <td>{field.type}</td>
            <td>{field.values}</td>
            <td>
              <span class="edit-button" on:click={() => editField(field)}>
                {@html getIcon('edit')}
              </span>
              <span class="edit-button" on:click={() => deleteField(field)}>
                {@html getIcon('trash')}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}(no fields added){/if}

  {#if editingField}
    <Modal
      title="Add new field"
      bind:isOpen={editingField}
      onClosed={() => onFinishedFieldEdit(false)}>
      <FieldView
        field={fieldToEdit}
        onFinished={onFinishedFieldEdit}
        allFields={record.fields}
        store={$store} />
    </Modal>
  {/if}

  <h3 class="budibase__title--3">Indexes</h3>

  {#each record.indexes as index}
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
  {/each}

</div>
  </div>
</div>

<style>
  .main {
    margin: 40px auto 40px auto;
    width: 1000px;
  }

  .hero {
    padding: 20px 0px 20px 20px;
    background: white;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
  }

  .hero .col {
    width: 50%;
  }

  .hero-content {
    padding: 40px;
  }

  .hero-para {
    font-size: 14px;
    font-weight: 500;
    opacity: 0.6;
    line-height: 1.5lh;
  }

  .hero-cta {
    color: #0055ff;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
  }

  .hero-img {
    display: block;
    width: auto;
    max-height: 250px;
    margin-left: auto;
    margin-right: auto;
  }

  .content {
    max-width: 800px;
    margin: 100px;
  }

  .header-row {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    grid-gap: 20px;
  }

  .budibase__title--3 {
    grid-column: 1 / 2;
  }

  .button-record {
    grid-column: 5 / 6;
    background: #0055ff;
    color: #fff;
    font-weight: 600;
    font-size: 18px;
    padding: 5px 0px 5px 0px;
    border-radius: 4px;
    border-color: transparent;
    height: 50px;
    max-width: 200px;
  }

  .button-cancel {
    grid-column: 4 / 5;
    background: transparent;
    color: rgb(23, 49, 87, 0.6);
    font-weight: 600;
    font-size: 14px;
    padding: 5px 0px 5px 0px;
    border-radius: 4px;
    border-color: transparent;
    height: 50px;
    max-width: 200px;
  }

  .form-main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .recordkeycontainer {
    margin-left: 40px;
    flex-direction: column;
    width: 505px;
  }

  .recordkeybox {
    flex: 1;
    background: white;
    border: 1px solid #DBDBDB;
    height: 40px;
    margin-top: 5px;
    border-radius: 5px;
  }

  .recordkey {
    margin-top: 5px;
    font-size: 16px;
    color: var(--primary100);
    align-items: center;
    padding: 5px 5px 5px 10px;
  }

  .fields-table {
    margin: 1rem 1rem 0rem 0rem;
    border-collapse: collapse;
  }

  .add-field-button {
    cursor: pointer;
    float: right;
    font-size: 14px;
    color: #0055ff;
    font-weight: 500;
  }

  .edit-button {
    cursor: pointer;
    color: var(--secondary25);
  }

  .edit-button:hover {
    cursor: pointer;
    color: var(--secondary75);
  }

  th {
    text-align: left;
  }

  td {
    padding: 1rem 5rem 1rem 0rem;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  thead > tr {
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: var(--secondary75);
    margin-bottom: 20px;
  }

  tbody > tr {
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: var(--primary10);
  }

  tbody > tr:hover {
    background-color: var(--primary10);
  }

  tbody > tr:hover .edit-button {
    color: var(--secondary75);
  }

  .index-container {
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--secondary25);
    padding: 10px;
    margin-bottom: 5px;
  }

  .index-label {
    color: var(--slate);
  }

  .index-name {
    font-weight: bold;
    color: var(--primary100);
  }

  .index-container code {
    margin: 0;
    display: inline;
    background-color: var(--primary10);
    color: var(--secondary100);
    padding: 3px;
  }

  .index-field-row {
    margin: 1rem 0rem 0rem 0rem;
  }

  .no-indexes {
    margin: 1rem 0rem 0rem 0rem;
    font-family: var(--fontnormal);
    font-size: 14px;
  }
</style>
