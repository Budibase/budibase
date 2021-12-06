<script>
  import { params } from "@roxi/routify"
  import { datasources, integrations, queries } from "stores/backend"
  import {
    Layout,
    Input,
    Select,
    Tabs,
    Tab,
    Banner,
    Divider,
    Button,
    Heading,
    RadioGroup,
    Label,
    TextArea,
    Table,
    notifications,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import EditableLabel from "components/common/inputs/EditableLabel.svelte"
  import CodeMirrorEditor, {
    EditorModes,
  } from "components/common/CodeMirrorEditor.svelte"
  import RestBodyInput from "../_components/RestBodyInput.svelte"
  import { capitalise } from "helpers"
  import { onMount } from "svelte"
  import { fieldsToSchema, schemaToFields } from "helpers/data/utils"
  import {
    RestBodyTypes as bodyTypes,
    SchemaTypeOptions,
  } from "constants/backend"
  import JSONPreview from "components/integration/JSONPreview.svelte"

  let query
  let breakQs = {}
  let url = ""
  // test - { info: { code: 500, time: "455ms", size: "2.09KB" }}
  let response
  let schema

  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: url = buildUrl(url, breakQs)
  $: checkQueryName(url)
  $: responseSuccess =
    response?.info?.code >= 200 && response?.info?.code <= 206

  function getSelectedQuery() {
    return (
      $queries.list.find(q => q._id === $queries.selected) || {
        datasourceId: $params.selectedDatasource,
        parameters: [],
        fields: {},
        queryVerb: "read",
      }
    )
  }

  function breakQueryString(qs) {
    if (!qs) {
      return {}
    }
    if (qs.includes("?")) {
      qs = qs.split("?")[1]
    }
    const params = qs.split("&")
    let paramObj = {}
    for (let param of params) {
      const [key, value] = param.split("=")
      paramObj[key] = value
    }
  }

  function buildQueryString(obj) {
    let str = ""
    for (let [key, value] of Object.entries(obj)) {
      if (!key || key === "") {
        continue
      }
      if (str !== "") {
        str += "&"
      }
      str += `${key}=${value || ""}`
    }
    return str
  }

  function checkQueryName(inputUrl = null) {
    if (query && (!query.name || query.flags.urlName)) {
      query.flags.urlName = true
      query.name = url || inputUrl
    }
  }

  function buildUrl(base, qsObj) {
    if (!base) {
      return base
    }
    const qs = buildQueryString(qsObj)
    let newUrl = base
    if (base.includes("?")) {
      newUrl = base.split("?")[0]
    }
    return qs.length > 0 ? `${newUrl}?${qs}` : newUrl
  }

  function learnMoreBanner() {}

  function buildQuery() {
    const newQuery = { ...query }
    const queryString = buildQueryString(breakQs)
    newQuery.fields.path = url.split("?")[0]
    newQuery.fields.queryString = queryString
    return newQuery
  }

  function saveQuery() {
    query.schema = fieldsToSchema(schema)
  }

  async function runQuery() {
    try {
      response = await queries.preview(buildQuery(query))
      if (response.rows.length === 0) {
        notifications.info("Request did not return any data.")
      } else {
        response.info = response.info || { code: 200 }
        notifications.success("Request sent successfully.")
      }
    } catch (err) {
      notifications.error(err)
    }
  }

  onMount(() => {
    query = getSelectedQuery()
    const qs = query?.fields.queryString
    breakQs = breakQueryString(qs)
    url = buildUrl(query.fields.path, qs)
    schema = schemaToFields(query.schema)
    if (query && !query.transformer) {
      query.transformer = "return data"
    }
    if (query && !query.flags) {
      query.flags = {
        urlName: false,
        bannerCleared: false,
      }
    }
    if (query && !query.fields.bodyType) {
      query.fields.bodyType = "none"
    }
  })
</script>

{#if query}
  <div class="inner">
    <div class="top">
      <Layout gap="S">
        <EditableLabel
          type="heading"
          bind:value={query.name}
          defaultValue="Untitled"
          on:change={() => (query.flags.urlName = false)}
        />
        <div class="url-block">
          <div class="verb">
            <Select
              bind:value={query.queryVerb}
              on:change={() => {}}
              options={Object.keys(queryConfig)}
              getOptionLabel={verb =>
                queryConfig[verb]?.displayName || capitalise(verb)}
            />
          </div>
          <div class="url">
            <Input bind:value={url} />
          </div>
          <Button cta disabled={!url} on:click={runQuery}>Send</Button>
        </div>
        <Tabs selected="Params" quiet noPadding noHorizPadding>
          <Tab title="Params">
            <KeyValueBuilder bind:object={breakQs} name="param" headings />
          </Tab>
          <Tab title="Headers">
            <KeyValueBuilder
              bind:object={query.fields.headers}
              name="header"
              headings
              activity
            />
          </Tab>
          <Tab title="Body">
            <RadioGroup
              bind:value={query.fields.bodyType}
              options={bodyTypes}
              direction="horizontal"
              getOptionLabel={option => option.name}
              getOptionValue={option => option.value}
            />
            <RestBodyInput bind:bodyType={query.fields.bodyType} bind:query />
          </Tab>
          <Tab title="Transformer">
            <Layout noPadding>
              {#if !query.flags.bannerCleared}
                <Banner
                  extraButtonText="Learn more"
                  extraButtonAction={learnMoreBanner}
                  on:change={() => (query.flags.bannerCleared = true)}
                >
                  Add a JavaScript function to transform the query result.
                </Banner>
              {/if}
              <CodeMirrorEditor
                height={200}
                mode={EditorModes.JSON}
                value={query.transformer}
                resize="vertical"
                on:change={e => (query.transformer = e.detail)}
              />
            </Layout>
          </Tab>
        </Tabs>
      </Layout>
    </div>
    <Layout paddingY="S" gap="S">
      <Divider size="S" />
      {#if !response}
        <Heading size="M">Response</Heading>
      {:else}
        <Tabs selected="JSON" quiet noPadding noHorizPadding>
          <Tab title="JSON">
            <div>
              <JSONPreview height="300" data={response.rows[0]} />
            </div>
          </Tab>
          <Tab title="Schema">
            <KeyValueBuilder
              bind:object={response.schema}
              name="header"
              headings
              activity
              options={SchemaTypeOptions}
            />
          </Tab>
          <Tab title="Raw">
            <TextArea disabled value={response.text} height="300" />
          </Tab>
          <Tab title="Preview">
            {#if response}
              <Table
                schema={response?.schema}
                data={response?.rows}
                allowEditColumns={false}
                allowEditRows={false}
                allowSelectRows={false}
              />
            {/if}
          </Tab>
          <div class="stats">
            <Label size="L">
              Status: <span class={responseSuccess ? "green" : "red"}
                >{response?.info.code}</span
              >
            </Label>
            <Label size="L">
              Time: <span class={responseSuccess ? "green" : "red"}
                >{response?.info.time}</span
              >
            </Label>
            <Label size="L">
              Size: <span class={responseSuccess ? "green" : "red"}
                >{response?.info.size}</span
              >
            </Label>
            <Button disabled={!responseSuccess} cta on:click={saveQuery}
              >Save query</Button
            >
          </div>
        </Tabs>
      {/if}
    </Layout>
  </div>
{/if}

<style>
  .inner {
    width: 960px;
    margin: 0 auto;
    height: 100%;
  }
  .url-block {
    display: flex;
    gap: var(--spacing-s);
  }
  .verb {
    flex: 1;
  }
  .url {
    flex: 4;
  }
  .top {
    min-height: 50%;
  }
  .stats {
    display: flex;
    gap: var(--spacing-xl);
    margin-left: auto !important;
    margin-right: 0;
    align-items: center;
  }
  .green {
    color: #53a761;
  }
  .red {
    color: #ea7d82;
  }
</style>
