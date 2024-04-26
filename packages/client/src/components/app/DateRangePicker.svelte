<script>
  import { Select } from "@budibase/bbui"
  import { getContext, onDestroy } from "svelte"
  import dayjs from "dayjs"
  import utc from "dayjs/plugin/utc"

  dayjs.extend(utc)

  export let dataProvider
  export let field
  export let defaultValue

  const component = getContext("component")
  const { styleable, ActionTypes, getAction } = getContext("sdk")
  const options = [
    "Last 1 day",
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
  ]
  let value = options.includes(defaultValue) ? defaultValue : "Last 30 days"

  $: dataProviderId = dataProvider?.id
  $: addExtension = getAction(
    dataProviderId,
    ActionTypes.AddDataProviderQueryExtension
  )
  $: removeExtension = getAction(
    dataProviderId,
    ActionTypes.RemoveDataProviderQueryExtension
  )
  $: queryExtension = getQueryExtension(field, value)
  $: addExtension?.($component.id, queryExtension)

  const getQueryExtension = (field, value) => {
    if (!field || !value) {
      return null
    }
    let low = dayjs.utc().subtract(1, "year")
    let high = dayjs.utc().add(1, "day")
    if (value === "Last 1 day") {
      low = dayjs.utc().subtract(1, "day")
    } else if (value === "Last 7 days") {
      low = dayjs.utc().subtract(7, "days")
    } else if (value === "Last 30 days") {
      low = dayjs.utc().subtract(30, "days")
    } else if (value === "Last 3 months") {
      low = dayjs.utc().subtract(3, "months")
    } else if (value === "Last 6 months") {
      low = dayjs.utc().subtract(6, "months")
    }
    return {
      range: {
        [field]: {
          low: low.format(),
          high: high.format(),
        },
      },
    }
  }

  onDestroy(() => {
    removeExtension?.($component.id)
  })
</script>

<div use:styleable={$component.styles}>
  <Select
    placeholder={null}
    {options}
    {value}
    on:change={e => (value = e.detail)}
  />
</div>
