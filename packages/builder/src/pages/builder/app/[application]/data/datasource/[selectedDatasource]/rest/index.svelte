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

  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query

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
    const params = qs.split("&")
    let paramObj = {}
    for (let param of params) {
      const [key, value] = param.split("=")
      paramObj[key] = value
    }
  }

  // function buildQueryString(obj) {
  //   let str = ""
  //   for (let [key, value] of Object.entries(obj)) {
  //     if (str !== "") {
  //       str += "&"
  //     }
  //     str += `${key}=${value}`
  //   }
  //   return str
  // }

  function checkQueryName(queryToCheck, url = null) {
    if (queryToCheck && (!queryToCheck.name || queryToCheck.flags.urlName)) {
      queryToCheck.flags.urlName = true
      queryToCheck.name = url || queryToCheck.fields.path
    }
  }

  function learnMoreBanner() {}

  function saveQuery() {}

  onMount(() => {
    query = getSelectedQuery()
    breakQs = breakQueryString(query?.fields.queryString)
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
            <Input
              bind:value={query.fields.path}
              on:change={({ detail }) => checkQueryName(query, detail)}
            />
          </div>
          <Button cta disabled={!query.fields.path} on:click={saveQuery}
            >Send</Button
          >
        </div>
        <Tabs selected="Params">
          <Tab title="Params">
            <KeyValueBuilder bind:object={breakQs} name="param" />
          </Tab>
          <Tab title="Headers" />
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
