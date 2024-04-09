<script>
  import {
    Layout,
    Table,
    Button,
    Body,
    Heading,
    Divider,
    notifications,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { appStore, tables } from "stores/builder"
  import { appsStore } from "stores/portal"
  import { getContext, onDestroy, onMount } from "svelte"
  import Portal from "svelte-portal"
  import { API } from "api"
  import { DB_TYPE_EXTERNAL } from "constants/backend"
  import EnvSwitch from "./EnvSwitch.svelte"
  import { JsonView } from "@zerodevx/svelte-json-view"

  const sidePanel = getContext("side-panel")

  // const customRenderers = [
  //   { column: "createdAt", component: DateTimeRenderer },
  //   { column: "status", component: StatusRenderer },
  // ]

  let mode = "dev"
  let loaded = false
  let selected
  let attachments
  let storeObjects
  let showOrphans = false

  let orphanSchema = {
    file: {
      type: "string",
      constraints: {
        type: "string",
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "File",
    },
    "File Size": {
      type: "number",
      constraints: {
        type: "number",
        length: {
          maximum: null,
        },
        presence: false,
      },
      name: "Size",
    },
  }

  $: console.log("tables ", $tables)
  $: console.log("app store ", $appStore)

  // Ensure the URLs are hydrated correctly
  // http://localhost:10000/files/signed/prod-budi-app-assets/app_9e1dd5f2de6b49bcbb04409b44a83717/
  //  attachments/a731df01-9e9d-4016-84cc-1f711562e626.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=budibase%2F20240404%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240404T154829Z&X-Amz-Expires=3600&X-Amz-Signature=9f67516893a4fb69d7d6a1c71b3369be9a70b3e425279d06fd169627de992f99&X-Amz-SignedHeaders=host

  // Hello
  let attachmentFiles
  $: if (attachments?.rows) {
    attachmentFiles = attachments?.rows.reduce((acc, row) => {
      //need to check the schema here
      row["Hello"]?.forEach(att => {
        acc.push(att.key)
      })
      return acc
    }, [])
  }
  $: console.log("attachmentFiles ", attachmentFiles)

  let storeByKeys
  $: if (storeObjects) {
    storeByKeys = storeObjects.reduce((acc, row) => {
      acc[row.Key] = row
      return acc
    }, {})
  }
  $: console.log("Store by keys ", storeByKeys)

  let orphans
  $: if (storeByKeys || attachmentFiles) {
    let storeSet = new Set(Object.keys(storeByKeys))
    let attSet = new Set(attachmentFiles)
    orphans = Array.from(storeSet.difference(attSet))
    console.log("ORPHANS ", storeSet.difference(attSet))
  }

  //Need consts or a general UTIL across the app.
  const bytesToString = bytes => {
    if (bytes <= 1000000) {
      return `${(bytes / 1000).toFixed(1)} KB`
    } else {
      return `${(bytes / 1000000).toFixed(1)} MB`
    }
  }

  $: orphanObjects = storeObjects
    ? storeObjects
        .filter(obj => orphans.includes(obj.Key))
        .map(obj => {
          const fileName = obj.Key?.split("/")?.slice(-1)?.[0]
          return {
            ...obj,
            file: fileName,
            "File Size": bytesToString(obj.Size),
          }
        })
    : null

  $: orphanTotal = orphanObjects?.reduce((acc, obj) => {
    acc += obj.Size
    return acc
  }, 0)

  $: rowsByTable = attachments?.rows.reduce((acc, row) => {
    acc[row.tableId] = acc[row.tableId] || []
    acc[row.tableId].push(row)
    return acc
  }, {})

  $: console.log("rows by table", Object.entries(rowsByTable || []))

  $: tablesById = $tables.list
    .filter(table => table.sourceType !== DB_TYPE_EXTERNAL)
    .reduce((acc, table) => {
      acc[table._id] = table
      return acc
    }, {})

  $: console.log("tables by id ", tablesById)

  function viewDetails({ detail }) {
    selected = detail
    sidePanel.open()
  }

  const fetchObjects = async () => {
    const test = await API.listAppBucket($appStore.appId)
    return test
  }

  const fetchAttachments = async appId => {
    const test = await API.getAttachmentRows(appId)
    return test
  }

  onMount(async () => {
    loaded = true
  })

  onDestroy(() => {
    sidePanel.close()
  })
</script>

<Layout noPadding>
  <Layout gap="XS" noPadding>
    <Heading>Media</Heading>
    <Body size="S">Browse all media attachments in your application</Body>
  </Layout>
  <Divider />

  <Layout gap="XS" noPadding>
    <Heading>Attachments</Heading>
    <Body size="S">
      Copy to explain what attachments are and why they can see them.
    </Body>
    <div class="buttons">
      <EnvSwitch
        on:change={e => {
          if (e.detail === true) {
            mode = "prod"
          } else {
            mode = "dev"
          }
        }}
      />
      <Button
        cta
        on:click={async () => {
          storeObjects = await fetchObjects()
          console.log("storeObjects ", storeObjects)
        }}
      >
        Fetch Objects
      </Button>
      <Button
        cta
        on:click={async () => {
          if (mode === "dev") {
            attachments = await fetchAttachments($appStore.appId)
          } else {
            attachments = await fetchAttachments(
              appsStore.getProdAppID($appStore.appId)
            )
          }
          console.log("attachments ", attachments)
        }}
      >
        Fetch attachments
      </Button>
      {#if orphans && storeByKeys && attachmentFiles}
        <Button
          warning
          disabled={orphans?.size === 0}
          on:click={() => {
            showOrphans = !showOrphans
          }}
        >
          Orphans
        </Button>
      {/if}
    </div>
  </Layout>

  {#if !showOrphans}
    <div class="tables">
      {#each Object.entries(rowsByTable || []) as [tableId, rows]}
        <div class="table">
          <div class="header">
            <Heading size="S">{tablesById[tableId]?.name}</Heading>
          </div>

          <Table
            on:click={viewDetails}
            schema={tablesById[tableId].schema}
            allowSelectRows={false}
            allowEditColumns={false}
            allowEditRows={false}
            data={rows}
            placeholderText="No attachments found"
            border={false}
          />
        </div>
        <!-- {JSON.stringify(tablesById[tableId].schema)} -->
      {/each}
    </div>
  {:else}
    <div class="header">
      <Heading size="S">
        {`Storage: ${Math.round(orphanTotal / 1000000)}MB`}
      </Heading>
    </div>
    <Table
      on:click={viewDetails}
      schema={orphanSchema}
      allowSelectRows={false}
      allowEditColumns={false}
      allowEditRows={false}
      data={orphanObjects}
      placeholderText="No attachments found"
      border={false}
    />
  {/if}
</Layout>

{#if selected && !showOrphans}
  <Portal target="#side-panel">
    <div class="storage">
      <!-- Iterate the attachments -->
      {#each selected["Hello"] || [] as att}
        <div class="attachment">
          <Heading>Attachment</Heading>
          {att.name}
        </div>
        <div class="attachment-object">
          <Heading>Object Store data</Heading>
          <div class="jsonwrap">
            <JsonView depth={2} json={storeByKeys[att.key]} />
          </div>
          <div>
            <Button
              cta
              on:click={() => {
                const link = document.createElement("a")
                link.href = storeByKeys[att.key].url
                link.download = storeByKeys[att.key].Key
                link.click()

                URL.revokeObjectURL(storeByKeys[att.key].url)
              }}
            >
              Download
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </Portal>
{:else}
  <Portal target="#side-panel">
    <div class="storage">
      <Heading>Object Store data</Heading>
      <div class="jsonwrap">
        <JsonView depth={2} json={selected} />
      </div>
      <div class="buttons">
        <Button
          cta
          on:click={() => {
            const link = document.createElement("a")
            link.href = selected.url
            link.download = selected.Key
            link.click()

            URL.revokeObjectURL(selected.url)
          }}
        >
          Download
        </Button>
        <Button
          warning
          on:click={async () => {
            try {
              await API.deleteBuilderAttachments([selected.Key])
              notifications.success("Store object deleted")
              selected = null
              sidePanel.close()
            } catch (error) {
              notifications.error("Error updating automation chaining setting")
            }
          }}
        >
          Prune
        </Button>
      </div>
    </div>
  </Portal>
{/if}

<style>
  .storage,
  .attachment-object,
  .attachment {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .jsonwrap {
    font-family: monospace;
    background-color: var(
      --spectrum-textfield-m-background-color,
      var(--spectrum-global-color-gray-50)
    );
    border: 1px solid var(--spectrum-global-color-gray-300);
    font-size: 12px;
    max-height: 240px; /* Adjusted max-height */
    height: 240px;
    --jsonPaddingLeft: 20px;
    --jsonborderleft: 20px;
    overflow: auto;
    overflow: overlay;
    overflow-x: hidden;
    padding-left: var(--spacing-s);
    padding-top: var(--spacing-xl);
    border-radius: 4px;
  }
  .tables {
    display: flex;
    gap: 32px;
    flex-direction: column;
  }
  .table .header {
    padding-bottom: 8px;
  }
  .buttons {
    display: flex;
    gap: 10px;
  }
</style>
