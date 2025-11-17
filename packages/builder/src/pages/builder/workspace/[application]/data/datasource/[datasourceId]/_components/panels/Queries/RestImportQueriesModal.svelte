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
  import type {
    Datasource,
    ImportRestQueryRequest,
    UIFile,
  } from "@budibase/types"

  export let navigateDatasource = false
  export let datasourceId: string | undefined = undefined
  export let createDatasource = false
  export let onCancel: (() => void) | undefined = undefined

  interface ImportFormData {
    url: string
    raw: string
    file?: File
  }

  const data = writable<ImportFormData>({
    url: "",
    raw: "",
  })

  let lastTouched: "url" | "file" | "raw" = "url"

  let datasource: Datasource
  $: datasource = $datasources.selected as Datasource
  let dataStringCache: string | undefined

  const resetCache = () => {
    dataStringCache = undefined
  }

  const getData = async (): Promise<string> => {
    if (dataStringCache) {
      return dataStringCache
    }

    let dataString

    if (lastTouched === "file") {
      dataString = await $data.file?.text()
    } else if (lastTouched === "url") {
      if (!$data.url) {
        return ""
      }
      const response = await fetch($data.url)
      dataString = await response.text()
    } else if (lastTouched === "raw") {
      dataString = $data.raw
    }

    if (typeof dataString !== "string") {
      return ""
    }

    const trimmed = dataString.trim()
    if (!trimmed) {
      return ""
    }

    dataStringCache = dataString
    return dataString
  }

  const onFileChange = async (
    event: CustomEvent<(File | UIFile | undefined)[]>
  ) => {
    const [file] = event.detail ?? []
    $data.file = file instanceof File ? file : undefined
    lastTouched = "file"
    resetCache()
  }

  const onRawChange = async () => {
    lastTouched = "raw"
    resetCache()
  }

  async function importQueries() {
    try {
      const dataString = await getData()
      if (!dataString) {
        notifications.error("Import data is missing")
        return keepOpen
      }

      if (!datasourceId && !createDatasource) {
        throw new Error("No datasource id")
      }

      const body: ImportRestQueryRequest = {
        data: dataString,
        datasourceId,
        datasource,
      }
      const importResult = await queries.importQueries(body)
      if (!datasourceId) {
        datasourceId = importResult.datasourceId
      }

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
  cancelText={createDatasource ? "Cancel" : "Back"}
  size="L"
>
  <Layout noPadding>
    <Heading size="S">Import</Heading>
    <Body size="XS"
      >Import your rest collection using one of the options below</Body
    >
    <Tabs selected="File">
      <Tab title="File">
        <Dropzone
          gallery={false}
          value={$data.file ? [$data.file] : []}
          on:change={onFileChange}
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
          on:change={onRawChange}
          label={"Paste raw text"}
          placeholder={'e.g. curl --location --request GET "https://example.com"'}
        />
      </Tab>
    </Tabs>
  </Layout>
</ModalContent>
