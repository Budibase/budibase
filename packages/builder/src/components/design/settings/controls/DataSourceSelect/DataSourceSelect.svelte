<script>
  import {
    readableToRuntimeBinding,
    runtimeToReadableBinding,
  } from "@/dataBinding"
  import {
    Button,
    Popover,
    Select,
    Layout,
    Drawer,
    DrawerContent,
    Icon,
    Modal,
    ModalContent,
    CoreDropzone,
    notifications,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    tables as tablesStore,
    queries as queriesStore,
    viewsV2 as viewsV2Store,
    views as viewsStore,
    selectedScreen,
    componentStore,
    datasources,
    integrations,
  } from "@/stores/builder"
  import BindingBuilder from "@/components/integration/QueryBindingBuilder.svelte"
  import IntegrationQueryEditor from "@/components/integration/index.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { findAllComponents } from "@/helpers/components"
  import {
    extractFields,
    extractJSONArrayFields,
    extractRelationships,
  } from "@/helpers/bindings"
  import ClientBindingPanel from "@/components/common/bindings/ClientBindingPanel.svelte"
  import DataSourceCategory from "@/components/design/settings/controls/DataSourceSelect/DataSourceCategory.svelte"
  import { API } from "@/api"
  import { sortAndFormat } from "@/helpers/data/format"

  export let value = {}
  export let otherSources
  export let showAllQueries
  export let bindings = []
  export let showDataProviders = true

  const dispatch = createEventDispatcher()

  let anchorRight, dropdownRight
  let drawer
  let tmpQueryParams
  let tmpCustomData
  let modal

  $: text = value?.label ?? "Choose an option"
  $: tables = sortAndFormat.tables($tablesStore.list, $datasources.list)
  $: viewsV1 = $viewsStore.list.map(view => ({
    ...view,
    label: view.name,
    type: "view",
  }))
  $: viewsV2 = sortAndFormat.viewsV2($viewsV2Store.list, $datasources.list)
  $: views = [...(viewsV1 || []), ...(viewsV2 || [])]
  $: queries = $queriesStore.list
    .filter(q => showAllQueries || q.queryVerb === "read" || q.readable)
    .map(query => ({
      label: query.name,
      name: query.name,
      ...query,
      type: "query",
    }))
  $: dataProviders = findAllComponents($selectedScreen.props)
    .filter(component => {
      return (
        component._component?.endsWith("/dataprovider") &&
        component._id !== $componentStore.selectedComponentId
      )
    })
    .map(provider => ({
      label: provider._instanceName,
      name: provider._instanceName,
      providerId: provider._id,
      value: `{{ literal ${safe(provider._id)} }}`,
      type: "provider",
    }))
  $: links = extractRelationships(bindings)
  $: fields = extractFields(bindings)
  $: jsonArrays = extractJSONArrayFields(bindings)
  $: custom = {
    type: "custom",
    label: "JSON / CSV",
  }

  const handleSelected = selected => {
    dispatch("change", selected)
    dropdownRight.hide()
  }

  const fetchQueryDefinition = query => {
    const source = $datasources.list.find(
      ds => ds._id === query.datasourceId
    ).source
    return $integrations[source].query[query.queryVerb]
  }

  const getQueryParams = query => {
    return $queriesStore.list.find(q => q._id === query?._id)?.parameters || []
  }

  const getQueryDatasource = query => {
    return $datasources.list.find(ds => ds._id === query?.datasourceId)
  }

  const openQueryParamsDrawer = () => {
    tmpQueryParams = { ...value.queryParams }
    drawer.show()
  }

  const openCustomDrawer = () => {
    tmpCustomData = runtimeToReadableBinding(bindings, value.data || "")
    drawer.show()
  }

  const getQueryValue = queries => {
    return queries.find(q => q._id === value._id) || value
  }

  const saveQueryParams = () => {
    handleSelected({
      ...value,
      queryParams: tmpQueryParams,
    })
    drawer.hide()
  }

  const saveCustomData = () => {
    handleSelected({
      ...value,
      data: readableToRuntimeBinding(bindings, tmpCustomData),
    })
    drawer.hide()
  }

  const promptForCSV = () => {
    drawer.hide()
    modal.show()
  }

  const handleCSV = async e => {
    try {
      const csv = await e.detail[0]?.text()
      if (csv?.length) {
        const js = await API.csvToJson(csv)
        tmpCustomData = JSON.stringify(js)
      }
      modal.hide()
      saveCustomData()
    } catch (error) {
      notifications.error("Failed to parse CSV")
      modal.hide()
      drawer.show()
    }
  }
</script>

<div class="container" bind:this={anchorRight}>
  <Select
    readonly
    value={text}
    options={[text]}
    on:click={dropdownRight.show}
  />
  {#if value?.type === "query"}
    <div class="icon">
      <Icon hoverable name="Settings" on:click={openQueryParamsDrawer} />
    </div>
    <Drawer title={"Query Bindings"} bind:this={drawer}>
      <Button slot="buttons" cta on:click={saveQueryParams}>Save</Button>
      <DrawerContent slot="body">
        <Layout noPadding gap="XS">
          {#if getQueryParams(value).length > 0}
            <BindingBuilder
              customParams={tmpQueryParams}
              on:change={v => {
                tmpQueryParams = { ...v.detail }
              }}
              queryBindings={getQueryParams(value)}
              bind:bindings
            />
          {/if}
          <IntegrationQueryEditor
            height={200}
            query={getQueryValue(queries)}
            schema={fetchQueryDefinition(value)}
            datasource={getQueryDatasource(value)}
            editable={false}
          />
        </Layout>
      </DrawerContent>
    </Drawer>
  {/if}
  {#if value?.type === "custom"}
    <div class="icon">
      <Icon hoverable name="Settings" on:click={openCustomDrawer} />
    </div>
    <Drawer title="Custom data" bind:this={drawer}>
      <div slot="buttons" style="display:contents">
        <Button primary on:click={promptForCSV}>Load CSV</Button>
        <Button cta on:click={saveCustomData}>Save</Button>
      </div>
      <div slot="description">Provide a JSON array to use as data</div>
      <ClientBindingPanel
        slot="body"
        value={tmpCustomData}
        on:change={event => (tmpCustomData = event.detail)}
        {bindings}
        allowJS
        allowHelpers
      />
    </Drawer>
  {/if}
</div>
<Popover bind:this={dropdownRight} anchor={anchorRight}>
  <div class="dropdown">
    <DataSourceCategory
      heading="Tables"
      dataSet={tables}
      {value}
      onSelect={handleSelected}
    />
    {#if views?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Views"
        dataSet={views}
        {value}
        onSelect={handleSelected}
        identifiers={["tableId", "name"]}
      />
    {/if}
    {#if queries?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Queries"
        dataSet={queries}
        {value}
        onSelect={handleSelected}
        identifiers={["_id"]}
      />
    {/if}
    {#if links?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Relationships"
        dataSet={links}
        {value}
        onSelect={handleSelected}
        identifiers={["tableId", "fieldName"]}
      />
    {/if}
    {#if fields?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Fields"
        dataSet={fields}
        {value}
        onSelect={handleSelected}
        identifiers={["providerId", "tableId", "fieldName"]}
      />
    {/if}
    {#if jsonArrays?.length}
      <DataSourceCategory
        dividerState={true}
        heading="JSON Arrays"
        dataSet={jsonArrays}
        {value}
        onSelect={handleSelected}
        identifiers={["providerId", "tableId", "fieldName"]}
      />
    {/if}
    {#if showDataProviders && dataProviders?.length}
      <DataSourceCategory
        dividerState={true}
        heading="Data Providers"
        dataSet={dataProviders}
        {value}
        onSelect={handleSelected}
        identifiers={["providerId"]}
      />
    {/if}
    <DataSourceCategory
      dividerState={true}
      heading="Other"
      dataSet={[custom]}
      {value}
      onSelect={handleSelected}
    />
    {#if otherSources?.length}
      <DataSourceCategory
        dividerState={false}
        dataSet={otherSources}
        {value}
        onSelect={handleSelected}
      />
    {/if}
  </div>
</Popover>

<Modal bind:this={modal}>
  <ModalContent title="Load CSV" showConfirmButton={false}>
    <CoreDropzone compact extensions=".csv" on:change={handleCSV} />
  </ModalContent>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container :global(:first-child) {
    flex: 1 1 auto;
  }

  .dropdown {
    padding: var(--spacing-m) 0;
    z-index: 99999999;
  }

  .icon {
    margin-left: 8px;
  }
</style>
