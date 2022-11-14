<script>
  import { getContext } from "svelte"
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import InnerFormBlock from "./InnerFormBlock.svelte"

  export let actionType
  export let dataSource
  export let size
  export let disabled
  export let fields
  export let labelPosition
  export let title
  export let showSaveButton
  export let showDeleteButton
  export let rowId
  export let actionUrl

  const { fetchDatasourceSchema } = getContext("sdk")

  let schema
  let providerId
  let repeaterId

  $: fetchSchema(dataSource)
  $: dataProvider = `{{ literal ${safe(providerId)} }}`
  $: filter = [
    {
      field: "_id",
      operator: "equal",
      type: "string",
      value: !rowId ? `{{ ${safe("url")}.${safe("id")} }}` : rowId,
      valueType: "Binding",
    },
  ]
  // We could simply spread $$props into the inner form and append our
  // additions, but that would create svelte warnings about unused props and
  // make maintenance in future more confusing as we typically always have a
  // proper mapping of schema settings to component exports, without having to
  // search multiple files
  $: innerProps = {
    dataSource,
    actionUrl,
    actionType,
    size,
    disabled,
    fields,
    labelPosition,
    title,
    showSaveButton,
    showDeleteButton,
    schema,
    repeaterId,
  }

  const fetchSchema = async () => {
    schema = (await fetchDatasourceSchema(dataSource)) || {}
  }
</script>

<Block>
  {#if actionType === "Create"}
    <BlockComponent
      type="container"
      props={{
        direction: "column",
        hAlign: "left",
        vAlign: "stretch",
      }}
    >
      <InnerFormBlock {...innerProps} />
    </BlockComponent>
  {:else}
    <BlockComponent
      type="dataprovider"
      context="provider"
      bind:id={providerId}
      props={{
        dataSource,
        filter,
        limit: 1,
        paginate: false,
      }}
    >
      <BlockComponent
        type="repeater"
        context="repeater"
        bind:id={repeaterId}
        props={{
          dataProvider,
          noRowsMessage: "We couldn't find a row to display",
          direction: "column",
          hAlign: "center",
        }}
      >
        <InnerFormBlock {...innerProps} />
      </BlockComponent>
    </BlockComponent>
  {/if}
</Block>
