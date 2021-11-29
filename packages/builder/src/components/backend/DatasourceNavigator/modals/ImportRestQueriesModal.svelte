<script>
  import { goto } from "@roxi/routify"
  import {
    ModalContent,
    notifications,
    Body,
    Layout,
    Tabs,
    Tab,
    Input,
    Heading,
    TextArea,
    Dropzone,
  } from "@budibase/bbui"
  import analytics, { Events } from "analytics"
  import { datasources, queries } from "stores/backend"

  export let modal
  export let datasourceId
  export let createDatasource = false

  let data = {
    url: "",
    raw: "",
    file: "",
  }

  let lastTouched = "url"

  const getData = async () => {
    let dataString

    // parse the file into memory and send as string
    if (lastTouched === "file") {
      dataString = await data.file[0].text()
    } else if (lastTouched === "url") {
      const response = await fetch(data.url)
      dataString = await response.text()
    } else if (lastTouched === "raw") {
      dataString = data.raw
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

      const resp = await queries.import(body)
      datasourceId = resp.datasourceId

      // reload
      await datasources.fetch()
      await queries.fetch()
      await datasources.select(datasourceId)

      $goto(`./datasource/${datasourceId}`)
      notifications.success(`Imported successfully.`)
      analytics.captureEvent(Events.QUERIES.REST.IMPORTED, {
        importType: lastTouched,
        newDatasource: createDatasource,
      })

      return true
    } catch (err) {
      notifications.error(`Error importing: ${err}`)
      return false
    }
  }
</script>

<ModalContent
  onConfirm={() => importQueries()}
  onCancel={() => modal.show()}
  confirmText={"Import"}
  cancelText="Back"
  size="L"
>
  <Layout noPadding>
    <Heading size="S">Import</Heading>
    <Body size="XS"
      >Import your rest collection using one of the options below</Body
    >
    <Tabs selected="Link">
      <Tab title="Link">
        <Input
          bind:value={data.url}
          on:change={() => (lastTouched = "url")}
          label="Enter a URL"
          placeholder="e.g. https://petstore.swagger.io/v2/swagger.json"
        />
      </Tab>
      <Tab title="File">
        <Dropzone
          gallery={false}
          bind:value={data.file}
          on:change={() => (lastTouched = "file")}
          fileTags={["OpenAPI", "Swagger 2.0"]}
        />
      </Tab>
      <Tab title="Raw Text">
        <TextArea
          bind:value={data.raw}
          on:change={() => (lastTouched = "raw")}
          label={"Paste raw text"}
          placeholder={'e.g. curl --location --request GET "https://example.com"'}
        />
      </Tab>
    </Tabs>
  </Layout>
</ModalContent>

<style>
</style>
