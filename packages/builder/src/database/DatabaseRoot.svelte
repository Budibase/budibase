<script>
  import HierarchyRow from "./HierarchyRow.svelte"
  import RecordView from "./RecordView.svelte"
  import IndexView from "./IndexView.svelte"
  import ActionsHeader from "./ActionsHeader.svelte"
  import { store } from "../builderStore"
  import getIcon from "../common/icon"
  import DropdownButton from "../common/DropdownButton.svelte"
  import { hierarchy as hierarchyFunctions } from "../../../core/src"

  const hierarchyWidth = "200px"

  const defaultNewIndexActions = [
    {
      label: "New Root Index",
      onclick: store.newRootIndex,
    },
  ]

  const defaultNewRecordActions = [
    {
      label: "New Root Record",
      onclick: store.newRootRecord,
    },
  ]

  let newIndexActions = defaultNewIndexActions
  let newRecordActions = defaultNewRecordActions

  store.subscribe(db => {
    if (!db.currentNode || hierarchyFunctions.isIndex(db.currentNode)) {
      newRecordActions = defaultNewRecordActions
      newIndexActions = defaultNewIndexActions
    } else {
      newRecordActions = [
        ...defaultNewRecordActions,
        {
          label: `New Child Record of ${db.currentNode.name}`,
          onclick: store.newChildRecord,
        },
      ]

      newIndexActions = [
        ...defaultNewIndexActions,
        {
          label: `New Index on ${db.currentNode.name}`,
          onclick: store.newChildIndex,
        },
      ]
    }
  })
</script>

<div class="root">
  <!--
    <div class="actions-header">
    {#if $store.currentNode}
      <ActionsHeader left={hierarchyWidth} />
    {/if}
  </div>
  -->
  <div class="node-view">
    {#if !$store.currentNode}
      <div class="main">
        <div class="hero">
          <div class="col">
            <div class="hero-content">
              <h1 class="budibase__title--2">Databases</h1>
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
            <div class="budibase__title--3">Database</div>
            <button class="button-record">Create new record</button>
            <button class="button-index">Create new index</button>
          </div>
          <div class="tabs">
            <div class="tabs-records">Records</div>
            <div class="tabs-indexes">Indexes</div>
          </div>
          <div class="container-fluid" style="margin-top: 10px">
            <div class="table-row header">
              <div class="text">Records</div>
              <div class="num">Fields</div>
              <div class="num">Indexes</div>
              <div class="num">Edit</div>
            </div>

            <div class="table-row">
              <div class="text">User</div>
              <div class="num">65,536</div>
              <div class="num">5,120</div>
              <a class="link" href="budibase.com">Edit</a>
            </div>

            <div class="table-row">
              <div class="text">Lead</div>
              <div class="num">2,484</div>
              <div class="num">5,536</div>
              <a class="link" href="budibase.com">Edit</a>
            </div>

            <div class="table-row">
              <div class="text">Customer</div>
              <div class="num">0</div>
              <div class="num">249,846</div>
              <a class="link" href="budibase.com">Edit</a>
            </div>
          </div>
        </div>
      </div>

      
    {:else if $store.currentNode.type === 'record'}
      <RecordView />
    {:else}
      <IndexView />
    {/if}
  </div>
</div>

<style>
  .root {
    height: 100%;
    position: relative;
  }

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
    grid-column: 4 / 5;
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

  .button-index {
    grid-column: 5 / 6;
    background: rgb(0, 85, 255, 0.05);
    color: #0055ff;
    font-weight: 600;
    font-size: 18px;
    padding: 5px 0px 5px 0px;
    border-radius: 4px;
    border-color: transparent;
    height: 50px;
    max-width: 200px;
  }

  .tabs {
    display: flex;
    margin-top: 40px;
  }

  .tabs-records {
    font-size: 18px;
    font-weight: 700;
  }

  .tabs-indexes {
    font-size: 18px;
    font-weight: 700;
    opacity: 0.4;
    margin-left: 20px;
  }

  .table-row {
    display: flex;
    flex-direction: row;
    -webkit-flex-direction: row;
    flex-grow: 0;
    -webkit-flex-grow: 0;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    background: #fff;
  }

  .text {
    width: 180px;
  }

  .num {
    width: 200px;
  }

  .link {
    width: 200px;
    text-decoration: none;
    color: #0055ff;
  }

  .text {
    flex-grow: 1;
    -webkit-flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 20px;
  }

  /*
 * General good-look styles, not mandatory.
 */

  .table-row {
    border: 1px solid #e0e0e0;
    border-collapse: collapse;
    padding-top: 5px;
    height: 50px;
    align-items: center;
  }

  .table-row.header {
    background-color: #fff;
    font-weight: 700;
    font-size: 18px;
    padding-top: 8px;
    padding-bottom: 8px;
    color: #173157;
    text-transform: inherit;
  }

  .node-view {
    overflow-y: auto;
    flex: 1 1 auto;
  }
</style>
