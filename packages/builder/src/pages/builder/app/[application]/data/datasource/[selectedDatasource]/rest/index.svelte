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
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import EditableLabel from "components/common/inputs/EditableLabel.svelte"
  import CodeMirrorEditor from "components/common/CodeMirrorEditor.svelte"
  import { capitalise } from "helpers"
  import { onMount } from "svelte"

  let query
  let breakQs = {}
  let url = ""

  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: url = buildUrl(url, breakQs)
  $: checkQueryName(url)

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

  function saveQuery() {}

  onMount(() => {
    query = getSelectedQuery()
    const qs = query?.fields.queryString
    breakQs = breakQueryString(qs)
    url = buildUrl(query.fields.path, qs)
    if (query && !query.transformer) {
      query.transformer = "return data"
    }
    if (query && !query.flags) {
      query.flags = {
        urlName: false,
        bannerCleared: false,
      }
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
          <Button cta disabled={!url} on:click={saveQuery}>Send</Button>
        </div>
        <Tabs selected="Params">
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
          <Tab title="Body" />
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
                value={query.transformer}
                resize="vertical"
                on:change={e => (query.transformer = e.detail)}
              />
            </Layout>
          </Tab>
        </Tabs>
      </Layout>
    </div>
    <Layout paddingY="L">
      <Divider size="S" />
      <Heading size="M">Response</Heading>
    </Layout>
  </div>
{/if}

<style>
  .inner {
    width: 840px;
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
</style>
