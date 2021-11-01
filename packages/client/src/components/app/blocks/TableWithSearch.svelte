<script>
  import { getContext } from "svelte"
  import { BlockBuilder } from "./block-builder"
  import Component from "components/Component.svelte"

  // Common props
  export let searchColumns
  export let dataSource

  // Data provider props
  export let filter
  export let sortColumn
  export let sortOrder
  export let paginate

  // Table props
  export let tableColumns
  export let showAutoColumns
  export let rowCount
  export let quiet
  export let size

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  let instance
  $: {
    const builder = new BlockBuilder($component)

    const form = builder.createComponent("form", {
      dataSource,
    })

    let newFilter = [...(filter || [])]

    // Add search bar if required
    if (searchColumns?.length) {
      const searchContainer = builder
        .createComponent("container", {
          direction: "row",
          hAlign: "right",
          vAlign: "middle",
          gap: "M",
          wrap: true,
        })
        .setStyles({
          "margin-bottom": "20px",
        })

      searchColumns?.forEach(column => {
        const field = builder.createComponent("stringfield", {
          field: column,
          placeholder: column,
          label: column,
        })

        searchContainer.addChild(field)

        newFilter.push({
          field: column,
          operator: "equal",
          type: "string",
          valueType: "Binding",
          value: `{{ [${form.id}].[${column}] }}`,
        })
      })

      form.addChild(searchContainer)
    }

    const dataProvider = builder.createComponent("dataprovider", {
      dataSource,
      filter: newFilter,
      sortColumn,
      sortOrder,
      paginate,
      limit: rowCount,
    })

    const table = builder.createComponent("table", {
      dataProvider: `{{ literal [${dataProvider.id}] }}`,
      columns: tableColumns,
      showAutoColumns,
      rowCount,
      quiet,
      size,
    })

    dataProvider.addChild(table)

    form.addChild(dataProvider)
    instance = form.build()
    console.log("new instance")
  }
</script>

<div use:styleable={$component.styles}>
  <Component {instance} />
</div>
