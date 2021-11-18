<script>
  import { get } from "svelte/store"
  import { getContext, onDestroy } from "svelte"
  import { ModalContent, Modal } from "@budibase/bbui"
  import FilterModal from "./FilterModal.svelte"
  import { buildLuceneQuery } from "builder/src/helpers/lucene"
  import Button from "../Button.svelte"

  export let dataProvider
  export let allowedFields
  export let buttonText

  const component = getContext("component")
  const { builderStore, ActionTypes, getAction } = getContext("sdk")

  let modal
  let tmpFilters = []
  let filters = []

  $: dataProviderId = dataProvider?.id
  $: addExtension = getAction(
    dataProviderId,
    ActionTypes.AddDataProviderQueryExtension
  )
  $: removeExtension = getAction(
    dataProviderId,
    ActionTypes.RemoveDataProviderQueryExtension
  )
  $: schema = dataProvider?.schema
  $: schemaFields = getSchemaFields(schema, allowedFields)
  $: text = getText(buttonText, filters)

  // Add query extension to data provider
  $: {
    if (filters?.length) {
      const queryExtension = buildLuceneQuery(filters)
      addExtension?.($component.id, queryExtension)
    }
  }

  const getText = (buttonText, filters) => {
    let text = buttonText || "Edit filters"
    if (filters?.length) {
      text += ` (${filters.length})`
    }
    return text
  }

  const getSchemaFields = (schema, allowedFields) => {
    let clonedSchema = {}
    if (!allowedFields?.length) {
      clonedSchema = schema
    } else {
      allowedFields?.forEach(field => {
        clonedSchema[field] = schema[field]
      })
    }
    return Object.values(clonedSchema || {})
  }

  const openEditor = () => {
    if (get(builderStore).inBuilder) {
      return
    }
    tmpFilters = [...filters]
    modal.show()
  }

  const updateQuery = () => {
    filters = [...tmpFilters]
  }

  onDestroy(() => {
    removeExtension?.($component.id)
  })
</script>

<Button onClick={openEditor} {text} />

<Modal bind:this={modal}>
  <ModalContent title={text} size="XL" onConfirm={updateQuery}>
    <FilterModal bind:filters={tmpFilters} {schemaFields} />
  </ModalContent>
</Modal>
