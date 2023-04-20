<script>
  import { goto } from "@roxi/routify"
  import {
    ModalContent,
    notifications,
    Body,
    Layout,
    Tabs,
    Tab,
    Heading,
    TextArea,
    Dropzone,
  } from "@budibase/bbui"
  import { datasources, queries } from "stores/backend"
  import { writable } from "svelte/store"
  import { _ } from "../../../../../lang/i18n"

  export let navigateDatasource = false
  export let datasourceId
  export let createDatasource = false
  export let onCancel

  const data = writable({
    url: "",
    raw: "",
    file: undefined,
  })

  let lastTouched = "url"

  const getData = async () => {
    let dataString

    // parse the file into memory and send as string
    if (lastTouched === "file") {
      dataString = await $data.file.text()
    } else if (lastTouched === "url") {
      const response = await fetch($data.url)
      dataString = await response.text()
    } else if (lastTouched === "raw") {
      dataString = $data.raw
    }

    return dataString
  }

  async function importQueries() {
    try {
      const dataString = await getData()

      if (!datasourceId && !createDatasource) {
        throw new Error(
          $_(
            "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.No_datasource"
          )
        )
      }

      const body = {
        data: dataString,
        datasourceId,
      }

      const importResult = await queries.import(body)
      if (!datasourceId) {
        datasourceId = importResult.datasourceId
      }

      // reload
      await datasources.fetch()
      await queries.fetch()

      if (navigateDatasource) {
        $goto(`./datasource/${datasourceId}`)
      }

      notifications.success(
        `${$_(
          "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Imported_successfully"
        )}`
      )
      return true
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Error_importing"
        )
      )
      return false
    }
  }
</script>

<ModalContent
  onConfirm={() => importQueries()}
  {onCancel}
  confirmText={$_(
    "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Import"
  )}
  cancelText="Back"
  size="L"
>
  <Layout noPadding>
    <Heading size="S"
      >{$_(
        "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Import"
      )}</Heading
    >
    <Body size="XS"
      >{$_(
        "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Import_collection"
      )}</Body
    >
    <Tabs selected="File">
      <!-- Commenting until nginx csp issue resolved -->
      <!-- <Tab title="Link">
        <Input
          bind:value={$data.url}
          on:change={() => (lastTouched = "url")}
          label="Enter a URL"
          placeholder="e.g. https://petstore.swagger.io/v2/swagger.json"
        />
      </Tab> -->
      <Tab
        title={$_(
          "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.File"
        )}
      >
        <Dropzone
          gallery={false}
          value={$data.file ? [$data.file] : []}
          on:change={e => {
            $data.file = e.detail?.[0]
            lastTouched = "file"
          }}
          fileTags={[
            "OpenAPI 3.0",
            "OpenAPI 2.0",
            "Swagger 2.0",
            "cURL",
            "YAML",
            "JSON",
          ]}
          maximum={1}
        />
      </Tab>
      <Tab
        title={$_(
          "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Raw_Text"
        )}
      >
        <TextArea
          bind:value={$data.raw}
          on:change={() => (lastTouched = "raw")}
          label={$_(
            "components.backend.DatasourceNavigation.modals.ImportRestQueriesModal.Paste_text"
          )}
          placeholder={'e.g. curl --location --request GET "https://example.com"'}
        />
      </Tab>
    </Tabs>
  </Layout>
</ModalContent>
