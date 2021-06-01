<script>
  import { Select } from "@budibase/bbui"
  import { getContext } from "svelte"
  import dayjs from "dayjs"
  import utc from "dayjs/plugin/utc"
  import { onMount } from "svelte"

  dayjs.extend(utc)

  export let dataProvider
  export let field

  const dataContext = getContext("context")
  const component = getContext("component")
  const { styleable, builderStore, ActionTypes } = getContext("sdk")

  let value = "Last 30 days"
  const options = [
    "Last 1 hour",
    "Last 1 day",
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
  ]

  const updateDateRange = option => {
    const query = dataProvider?.state?.query
    if (!query) {
      return
    }

    let low = dayjs.utc().subtract(1, "year")
    let high = dayjs.utc().add(1, "day")

    if (option === "Last 1 hour") {
      low = dayjs.utc().subtract(1, "hour")
    } else if (option === "Last 1 day") {
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

    const newQuery = {
      ...query,
      range: {
        ...query.range,
        [field]: {
          high: high.format(),
          low: low.format(),
        },
      },
    }

    const setQuery =
      $dataContext[`${dataProvider.id}_${ActionTypes.SetDataProviderQuery}`]
    if (setQuery) {
      setQuery(newQuery)
    }
  }

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
