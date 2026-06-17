<script>
  import {
    DatePicker,
    Label,
    Layout,
    Multiselect,
    Select,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import CronBuilder from "./CronBuilder.svelte"
  import NextExecutionsTable from "./NextExecutionsTable.svelte"
  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  const dispatch = createEventDispatcher()

  export let cronExpression
  export let timezone = "UTC"

  const FREQUENCIES = [
    { label: "Regular intervals", value: "interval" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Specific dates", value: "specificDates" },
    { label: "Cron expression", value: "cron" },
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

  const TIMEZONES = [
    { label: "UTC", value: "UTC" },
    { label: "Europe/London", value: "Europe/London" },
    { label: "Europe/Paris", value: "Europe/Paris" },
    { label: "Europe/Berlin", value: "Europe/Berlin" },
    { label: "America/New York", value: "America/New_York" },
    { label: "America/Chicago", value: "America/Chicago" },
    { label: "America/Denver", value: "America/Denver" },
    { label: "America/Los Angeles", value: "America/Los_Angeles" },
    { label: "America/Toronto", value: "America/Toronto" },
    { label: "America/Sao Paulo", value: "America/Sao_Paulo" },
    { label: "Asia/Dubai", value: "Asia/Dubai" },
    { label: "Asia/Kolkata", value: "Asia/Kolkata" },
    { label: "Asia/Singapore", value: "Asia/Singapore" },
    { label: "Asia/Tokyo", value: "Asia/Tokyo" },
    { label: "Australia/Sydney", value: "Australia/Sydney" },
    { label: "Pacific/Auckland", value: "Pacific/Auckland" },
  ]
  const MINUTES_PER_HOUR = 60
  const INTERVAL_OPTIONS = [
    { label: "10 mins", value: 10 },
    { label: "15 mins", value: 15 },
    { label: "20 mins", value: 20 },
    { label: "30 mins", value: 30 },
    { label: "60 mins", value: 60 },
    { label: "2 hrs", value: 120 },
    { label: "3 hrs", value: 180 },
    { label: "4 hrs", value: 240 },
    { label: "6 hrs", value: 360 },
    { label: "12 hrs", value: 720 },
  ]

  let frequency = "daily"
  let intervalMinutes = 30
  let time = "09:00"
  let selectedDaysOfWeek = ["1", "2", "3", "4", "5"]
  let selectedDaysOfMonth = ["1"]
  let selectedMonths = ["1"]
  let error
  let nextExecutions
  let savedCronExpression = cronExpression
  let savedTimezone = timezone

  $: timezone = timezone || "UTC"
  $: nextExecutions = getNextExecutions(cronExpression, timezone)

  const sortNumbers = values => values.map(Number).sort((a, b) => a - b)

  const getTimeParts = value => {
    const [hours = "09", minutes = "00"] = (value || "09:00").split(":")
    return {
      hours: Number(hours),
      minutes: Number(minutes),
    }
  }

  const getNextExecutions = (expression, timezone) => {
    if (!expression || expression === REBOOT_CRON) {
      return null
    }
    try {
      return helpers.cron.getNextExecutionDates(expression, 4, timezone)
    } catch (err) {
      return null
    }
  }

  const dispatchCron = expression => {
    if (!expression) {
      return
    }
    const validation = helpers.cron.validate(expression)
    error = validation.err
    if (error) {
      return
    }
    if (expression === savedCronExpression && timezone === savedTimezone) {
      return
    }
    cronExpression = expression
    savedCronExpression = expression
    savedTimezone = timezone
    dispatch("change", { cron: expression, timezone })
  }

  const updateSchedule = () => {
    if (frequency === "cron") {
      return
    }

    let expression
    const { hours, minutes } = getTimeParts(time)

    if (frequency === "interval") {
      const interval = Number(intervalMinutes)
      if (interval < MINUTES_PER_HOUR) {
        expression = `*/${interval} * * * *`
      } else if (interval % MINUTES_PER_HOUR === 0) {
        expression = `0 */${interval / MINUTES_PER_HOUR} * * *`
      } else {
        error = "Use advanced cron for intervals that are not whole hours"
        return
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

  $: {
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
    label="Period"
    value={frequency}
    options={FREQUENCIES}
    on:change={e => (frequency = e.detail)}
  />

  {#if frequency === "interval"}
    <Select
      label="Interval"
      value={intervalMinutes}
      options={INTERVAL_OPTIONS}
      on:change={e => (intervalMinutes = e.detail)}
    />
  {:else if frequency === "cron"}
    <CronBuilder
      {cronExpression}
      {timezone}
      on:change={e => {
        dispatchCron(e.detail)
      }}
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
    {#if error}
      <Label><div class="error">{error}</div></Label>
    {/if}
  {/if}

  <Select
    label="Timezone"
    value={timezone}
    options={TIMEZONES}
    on:change={e => {
      timezone = e.detail
      dispatchCron(cronExpression)
    }}
  />

  {#if nextExecutions && !error && frequency !== "cron"}
    <NextExecutionsTable executions={nextExecutions} />
  {/if}
</Layout>

<style>
  .error {
    padding-top: var(--spacing-xs);
    color: var(--spectrum-global-color-red-500);
  }
</style>
