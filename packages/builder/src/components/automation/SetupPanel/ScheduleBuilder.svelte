<script lang="ts">
  import {
    DatePicker,
    Label,
    Layout,
    Multiselect,
    Select,
  } from "@budibase/bbui"
  import CronBuilder from "./CronBuilder.svelte"
  import NextExecutionsTable from "./NextExecutionsTable.svelte"
  import { helpers, REBOOT_CRON } from "@budibase/shared-core"

  interface Option<T extends string | number> {
    label: string
    value: T
  }

  type Frequency = "interval" | "daily" | "weekly" | "monthly" | "cron"
  type ScheduleError = string | string[] | undefined

  interface ScheduleUpdate {
    cron: string
    timezone: string
  }

  export let cronExpression: string | undefined
  export let timezone = "UTC"
  export let onchange: ((update: ScheduleUpdate) => void) | undefined =
    undefined

  const FREQUENCIES: Option<Frequency>[] = [
    { label: "Regular intervals", value: "interval" },
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Cron expression", value: "cron" },
  ]

  const DAYS_OF_WEEK: Option<string>[] = [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "0" },
  ]

  const DAYS_OF_MONTH: Option<string>[] = Array.from(
    { length: 31 },
    (_, idx) => {
      const day = `${idx + 1}`
      return { label: day, value: day }
    }
  )

  const TIMEZONES: Option<string>[] = [
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
  const INTERVAL_OPTIONS: Option<number>[] = [
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

  let frequency: Frequency = cronExpression ? "cron" : "daily"
  let intervalMinutes = 30
  let time: string | undefined = "09:00"
  let selectedDaysOfWeek = ["1", "2", "3", "4", "5"]
  let selectedDaysOfMonth = ["1"]
  let error: ScheduleError
  let nextExecutions: string[] | null
  let savedCronExpression = cronExpression
  let savedTimezone = timezone

  $: timezone = timezone || "UTC"
  $: nextExecutions = getNextExecutions(cronExpression, timezone)

  const sortNumbers = (values: string[]) =>
    values.map(Number).sort((a, b) => a - b)

  const getTimeParts = (value: string | undefined) => {
    const [hours = "09", minutes = "00"] = (value || "09:00").split(":")
    return {
      hours: Number(hours),
      minutes: Number(minutes),
    }
  }

  const getNextExecutions = (
    expression: string | undefined,
    timezone: string
  ): string[] | null => {
    if (!expression || expression === REBOOT_CRON) {
      return null
    }
    try {
      return helpers.cron.getNextExecutionDates(expression, 4, timezone)
    } catch (err) {
      return null
    }
  }

  const dispatchCron = (expression: string | undefined) => {
    if (!expression) {
      return
    }
    const validation =
      expression === REBOOT_CRON
        ? { valid: true }
        : helpers.cron.validate(expression)
    error = "err" in validation ? validation.err : undefined
    if (error) {
      return
    }
    if (expression === savedCronExpression && timezone === savedTimezone) {
      return
    }
    cronExpression = expression
    savedCronExpression = expression
    savedTimezone = timezone
    onchange?.({ cron: expression, timezone })
  }

  const updateSchedule = () => {
    if (frequency === "cron") {
      return
    }

    let expression: string | undefined
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
    }

    dispatchCron(expression)
  }

  $: {
    frequency,
      intervalMinutes,
      time,
      selectedDaysOfWeek,
      selectedDaysOfMonth,
      updateSchedule()
  }
</script>

<Layout noPadding gap="S">
  <Select
    label="Period"
    value={frequency}
    options={FREQUENCIES}
    on:change={(event: CustomEvent<Frequency | undefined>) => {
      if (event.detail) {
        frequency = event.detail
      }
    }}
  />

  {#if frequency === "interval"}
    <Select
      label="Interval"
      value={intervalMinutes}
      options={INTERVAL_OPTIONS}
      on:change={(event: CustomEvent<number | undefined>) => {
        if (event.detail) {
          intervalMinutes = event.detail
        }
      }}
    />
  {:else if frequency === "cron"}
    <CronBuilder
      {cronExpression}
      {timezone}
      onchange={dispatchCron}
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
          on:change={(event: CustomEvent<string[]>) => {
            selectedDaysOfWeek = event.detail
          }}
        />
      </div>
    {:else if frequency === "monthly"}
      <div>
        <Label>Days of the month</Label>
        <Multiselect
          value={selectedDaysOfMonth}
          options={DAYS_OF_MONTH}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          on:change={(event: CustomEvent<string[]>) => {
            selectedDaysOfMonth = event.detail
          }}
        />
      </div>
    {/if}
    <div>
      <Label>Time</Label>
      <DatePicker bind:value={time} timeOnly />
    </div>
    {#if error}
      <Label><div class="error">{error}</div></Label>
    {/if}
  {/if}

  <Select
    label="Timezone"
    value={timezone}
    options={TIMEZONES}
    on:change={(event: CustomEvent<string | undefined>) => {
      if (event.detail) {
        timezone = event.detail
        dispatchCron(cronExpression)
      }
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
