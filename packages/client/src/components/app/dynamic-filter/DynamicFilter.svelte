<script>
  import { get } from "svelte/store"
  import { getContext, onDestroy } from "svelte"
  import { ModalContent, Modal, Helpers } from "@budibase/bbui"
  import {
    QueryUtils,
    Constants,
    CoreFilterBuilder,
    Utils,
  } from "@budibase/frontend-core"
  import Button from "../Button.svelte"

  export let dataProvider
  export let allowedFields
  export let size = "M"

  const component = getContext("component")
  const { builderStore, ActionTypes, getAction, fetchDatasourceSchema } =
    getContext("sdk")

  let modal
  let editableFilters
  let filters
  let schemaLoaded = false,
    schema

  $: dataProviderId = dataProvider?.id
  $: datasource = dataProvider?.datasource
  $: isDSPlus = ["table", "link", "viewV2"].includes(datasource?.type)

  $: addExtension = getAction(
    dataProviderId,
    ActionTypes.AddDataProviderQueryExtension
  )
  $: removeExtension = getAction(
    dataProviderId,
    ActionTypes.RemoveDataProviderQueryExtension
  )
  $: fetchSchema(datasource)
  $: schemaFields = getSchemaFields(schema, allowedFields)

  $: filterCount = filters?.groups?.reduce((acc, group) => {
    acc += group?.filters?.length || 0
    return acc
  }, 0)

  $: {
    if (filterCount) {
      const queryExtension = QueryUtils.buildQuery(filters)
      delete queryExtension.onEmptyFilter
      addExtension?.($component.id, queryExtension)
    } else {
      removeExtension?.($component.id)
    }
  }

  async function fetchSchema(datasource) {
    if (datasource) {
      schema = await fetchDatasourceSchema(datasource, {
        enrichRelationships: true,
      })
    }
    schemaLoaded = true
  }

  function getSchemaFields(schema, allowedFields) {
    if (!schemaLoaded) {
      return {}
    }
    let clonedSchema = {}
    if (!allowedFields?.length) {
      clonedSchema = schema || {}
    } else {
      allowedFields?.forEach(field => {
        if (schema?.[field.name]) {
          clonedSchema[field.name] = schema[field.name]
          clonedSchema[field.name].displayName = field.displayName
        } else if (schema?.[field]) {
          clonedSchema[field] = schema[field]
        }
      })
    }

    return Object.values(clonedSchema || {})
      .filter(field => !Constants.BannedSearchTypes.includes(field.type))
      .concat(isDSPlus ? [{ name: "_id", type: "string" }] : [])
  }

  const openEditor = () => {
    if (get(builderStore).inBuilder) {
      return
    }
    editableFilters = filters ? Helpers.cloneDeep(filters) : null

    modal.show()
  }

  const updateQuery = () => {
    filters = Utils.parseFilter(editableFilters)
  }

  onDestroy(() => {
    removeExtension?.($component.id)
  })
</script>

{#if schemaLoaded}
  <Button
    onClick={openEditor}
    icon="ri-filter-3-line"
    text="Filter"
    {size}
    type="secondary"
    quiet
    active={filters?.groups?.length > 0}
  />

  <Modal bind:this={modal}>
    <ModalContent title="Edit filters" size="XL" onConfirm={updateQuery}>
      <CoreFilterBuilder
        on:change={e => {
          editableFilters = e.detail
        }}
        filters={editableFilters}
        {schemaFields}
        {datasource}
        filtersLabel={null}
      />
    </ModalContent>
  </Modal>
{/if}
