<script>
  import { Select } from "@budibase/bbui"
  import { getContext } from "svelte"
  import dayjs from "dayjs"
  import utc from "dayjs/plugin/utc"
  import { onDestroy } from "svelte"

  dayjs.extend(utc)

  export let dataProvider
  export let field
  export let defaultValue

  const component = getContext("component")
  const { styleable, ActionTypes, getAction } = getContext("sdk")

  $: addExtension = getAction(
    dataProvider?.id,
    ActionTypes.AddDataProviderQueryExtension
  )
  $: removeExtension = getAction(
    dataProvider?.id,
    ActionTypes.RemoveDataProviderQueryExtension
  )
  const options = [
    "Last 1 day",
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last 6 months",
    "Last 1 year",
  ]
  let value = options.includes(defaultValue) ? defaultValue : "Last 30 days"

  $: queryExtension = getQueryExtension(value)
  $: addExtension?.($component.id, "range", field, queryExtension)

  const getQueryExtension = value => {
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

    return { low: low.format(), high: high.format() }
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
