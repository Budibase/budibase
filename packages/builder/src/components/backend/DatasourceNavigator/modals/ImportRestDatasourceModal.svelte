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

  let data = {
    url: "",
    raw: "",
    file: "",
  }

  let lastTouched = "url"

  $: {
    console.log({ data })
    console.log({ lastTouched })
  }

  const getPayload = () => {
    return {
      type: lastTouched,
      data: data[lastTouched],
    }
  }

  async function importDatasource() {
    try {
      // Create datasource
      const resp = await datasources.import(getPayload())

      // // update the tables incase data source plus
      await queries.fetch()
      await datasources.select(resp._id)
      $goto(`./datasource/${resp._id}`)
      notifications.success(`Datasource imported successfully.`)
      analytics.captureEvent(Events.DATASOURCE.IMPORTED, {
        name: resp.name,
        source: resp.source,
      })
      return true
    } catch (err) {
      notifications.error(`Error importing datasource: ${err}`)
      return false
    }
  }
</script>

<ModalContent
  onConfirm={() => importDatasource()}
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
