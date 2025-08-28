<script lang="ts">
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
  import { datasources, queries } from "@/stores/builder"
  import { writable } from "svelte/store"
  import type { Datasource } from "@budibase/types"

  export let navigateDatasource = false
  export let datasourceId: string | undefined = undefined
  export let createDatasource = false
  export let onCancel: (() => void) | undefined = undefined

  const data = writable<{ url: string; raw: string; file?: any }>({
    url: "",
    raw: "",
    file: undefined,
  })

  let lastTouched = "url"

  $: datasource = $datasources.selected as Datasource

  const getData = async (): Promise<string> => {
    let dataString

    // parse the file into memory and send as string
    if (lastTouched === "file") {
      dataString = await $data.file?.text()
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
        datasource,
      }
      const importResult = await queries.importQueries(body)
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
    } catch (error: any) {
      notifications.error(`Error importing queries - ${error.message}`)

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
