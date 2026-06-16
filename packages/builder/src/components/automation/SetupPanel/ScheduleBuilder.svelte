<script>
  import {
    Button,
    DatePicker,
    Divider,
    InlineAlert,
    Label,
    Layout,
    Multiselect,
    Select,
    Stepper,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import CronBuilder from "./CronBuilder.svelte"
  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  export let cronExpression

  const FREQUENCIES = [
    { label: "Regular intervals", value: "interval" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Specific dates", value: "specificDates" },
  ]

  const DAYS_OF_WEEK = [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "0" },
  ]

  const MONTHS = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]

  const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, idx) => {
    const day = `${idx + 1}`
    return { label: day, value: day }
  })

  const TIMEZONES = [{ label: "UTC", value: "UTC" }]
  const MIN_INTERVAL_MINUTES = 10
  const MAX_INTERVAL_MINUTES = 720

  let frequency = "daily"
  let intervalMinutes = 30
  let time = "09:00"
  let selectedDaysOfWeek = ["1", "2", "3", "4", "5"]
  let selectedDaysOfMonth = ["1"]
  let selectedMonths = ["1"]
  let advanced = false
  let error
  let nextExecutions

  $: nextExecutions = getNextExecutions(cronExpression)

  const sortNumbers = values => values.map(Number).sort((a, b) => a - b)

  const getTimeParts = value => {
    const [hours = "09", minutes = "00"] = (value || "09:00").split(":")
    return {
      hours: Number(hours),
      minutes: Number(minutes),
    }
  }

  const getNextExecutions = expression => {
    if (!expression || expression === REBOOT_CRON) {
      return null
    }
    try {
      return helpers.cron.getNextExecutionDates(expression).join("\n")
    } catch (err) {
      return null
    }
  }

  const dispatchCron = expression => {
    if (!expression) {
      return
    }
    if (expression === cronExpression) {
      error = null
      return
    }
    const validation = helpers.cron.validate(expression)
    error = validation.err
    if (error) {
      return
    }
    cronExpression = expression
    dispatch("change", expression)
  }

  const updateSchedule = () => {
    let expression
    const { hours, minutes } = getTimeParts(time)

    if (frequency === "interval") {
      const interval = Number(intervalMinutes)
      if (interval < MAX_INTERVAL_MINUTES) {
        expression = `*/${interval} * * * *`
      } else {
        expression = "0 * * * *"
      }
    } else if (frequency === "daily") {
      expression = `${minutes} ${hours} * * *`
    } else if (frequency === "weekly") {
      if (!selectedDaysOfWeek.length) {
        error = "Please select at least one day"
        return
      }
      expression = `${minutes} ${hours} * * ${sortNumbers(selectedDaysOfWeek).join(",")}`
    } else if (frequency === "monthly") {
      if (!selectedDaysOfMonth.length) {
        error = "Please select at least one day"
        return
      }
      expression = `${minutes} ${hours} ${sortNumbers(selectedDaysOfMonth).join(",")} * *`
    } else if (frequency === "specificDates") {
      if (!selectedMonths.length || !selectedDaysOfMonth.length) {
        error = "Please select at least one month and day"
        return
      }
      expression = `${minutes} ${hours} ${sortNumbers(selectedDaysOfMonth).join(",")} ${sortNumbers(selectedMonths).join(",")} *`
    }

    dispatchCron(expression)
  }

  $: if (!advanced) {
    frequency,
      intervalMinutes,
      time,
      selectedDaysOfWeek,
      selectedDaysOfMonth,
      selectedMonths,
      updateSchedule()
  }
</script>

<Layout noPadding gap="S">
  <Select
    label="Run every"
    value={frequency}
    options={FREQUENCIES}
    on:change={e => (frequency = e.detail)}
  />

  {#if frequency === "interval"}
    <Stepper
      label="Minutes"
      value={intervalMinutes}
      min={MIN_INTERVAL_MINUTES}
      max={MAX_INTERVAL_MINUTES}
      on:change={e => (intervalMinutes = e.detail)}
      updateOnChange={false}
    />
  {:else}
    {#if frequency === "weekly"}
      <div>
        <Label>Days of the week</Label>
        <Multiselect
          value={selectedDaysOfWeek}
          options={DAYS_OF_WEEK}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          on:change={e => (selectedDaysOfWeek = e.detail)}
        />
      </div>
    {:else if frequency === "monthly" || frequency === "specificDates"}
      {#if frequency === "specificDates"}
        <div>
          <Label>Months of the year</Label>
          <Multiselect
            value={selectedMonths}
            options={MONTHS}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            on:change={e => (selectedMonths = e.detail)}
          />
        </div>
      {/if}
      <div>
        <Label>Days of the month</Label>
        <Multiselect
          value={selectedDaysOfMonth}
          options={DAYS_OF_MONTH}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          on:change={e => (selectedDaysOfMonth = e.detail)}
        />
      </div>
    {/if}
    <DatePicker
      label="Time"
      value={time}
      timeOnly
      on:change={e => (time = e.detail)}
    />
    <Select label="Timezone" value="UTC" options={TIMEZONES} readonly />
    {#if error}
      <Label><div class="error">{error}</div></Label>
    {/if}
  {/if}

  {#if nextExecutions && !advanced}
    <InlineAlert
      type="info"
      header="Next Executions"
      message={nextExecutions}
    />
  {/if}

  <Divider />
  <Button quiet on:click={() => (advanced = !advanced)}>
    {advanced ? "Hide advanced cron" : "Advanced cron"}
  </Button>
  {#if advanced}
    <CronBuilder
      {cronExpression}
      on:change={e => {
        cronExpression = e.detail
        dispatch("change", e.detail)
      }}
    />
  {/if}
</Layout>

<style>
  .error {
    padding-top: var(--spacing-xs);
    color: var(--spectrum-global-color-red-500);
  }
</style>
