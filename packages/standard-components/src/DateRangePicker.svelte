<script>
  import { Select } from "@budibase/bbui"
  import { getContext } from "svelte"
  import dayjs from "dayjs"
  import utc from "dayjs/plugin/utc"
  import { onMount } from "svelte"

  dayjs.extend(utc)

  export let dataProvider
  export let field
  export let defaultValue

  const dataContext = getContext("context")
  const component = getContext("component")
  const { styleable, builderStore, ActionTypes, getAction } = getContext("sdk")

  const setQuery = getAction(dataProvider?.id, ActionTypes.SetDataProviderQuery)
  const options = [
    "Last 1 day",
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
  ]
  let value = options.includes(defaultValue) ? defaultValue : "Last 30 days"

  const updateDateRange = option => {
    const query = dataProvider?.state?.query
    if (!query || !setQuery) {
      return
    }

    value = option
    let low = dayjs.utc().subtract(1, "year")
    let high = dayjs.utc().add(1, "day")

    if (option === "Last 1 day") {
      low = dayjs.utc().subtract(1, "day")
    } else if (option === "Last 7 days") {
      low = dayjs.utc().subtract(7, "days")
    } else if (option === "Last 30 days") {
      low = dayjs.utc().subtract(30, "days")
    } else if (option === "Last 3 months") {
      low = dayjs.utc().subtract(3, "months")
    } else if (option === "Last 6 months") {
      low = dayjs.utc().subtract(6, "months")
    }

    // Update data provider query with the new filter
    setQuery({
      ...query,
      range: {
        ...query.range,
        [field]: {
          high: high.format(),
          low: low.format(),
        },
      },
    })
  }

  // Update the range on mount to the initial value
  onMount(() => {
    updateDateRange(value)
  })
</script>

<div use:styleable={$component.styles}>
  <Select
    placeholder={null}
    {options}
    {value}
    on:change={e => updateDateRange(e.detail)}
  />
</div>
