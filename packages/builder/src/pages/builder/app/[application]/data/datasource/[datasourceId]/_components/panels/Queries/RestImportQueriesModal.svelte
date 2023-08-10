<script>
  import { goto } from "@roxi/routify"
  import {
    keepOpen,
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
        throw new Error("No datasource id")
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

      notifications.success("Imported successfully")
    } catch (error) {
      notifications.error("Error importing queries")

      return keepOpen
    }
  }
</script>

<ModalContent
  onConfirm={() => importQueries()}
  {onCancel}
  confirmText={"Import"}
  cancelText="Back"
  size="L"
>
  <Layout noPadding>
    <Heading size="S">Import</Heading>
    <Body size="XS"
      >Import your rest collection using one of the options below</Body
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
      <Tab title="File">
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
      <Tab title="Raw Text">
        <TextArea
          bind:value={$data.raw}
          on:change={() => (lastTouched = "raw")}
          label={"Paste raw text"}
          placeholder={'e.g. curl --location --request GET "https://example.com"'}
        />
      </Tab>
    </Tabs>
  </Layout>
</ModalContent>
