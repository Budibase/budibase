import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import { tick } from "svelte"
import MockCronBuilder from "@/test/mocks/MockCronBuilder.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import MockTimeField from "@/test/mocks/MockTimeField.svelte"
import ScheduleBuilderHarness from "@/test/mocks/ScheduleBuilderHarness.svelte"
import { REBOOT_CRON } from "@budibase/shared-core"

vi.mock("@budibase/bbui", () => ({
  Label: MockSlot,
  Layout: MockLayout,
  Multiselect: MockSelect,
  Select: MockSelect,
  TimeField: MockTimeField,
}))

vi.mock("./CronBuilder.svelte", () => ({
  default: MockCronBuilder,
}))

const renderScheduleBuilder = (props: {
  cronExpression: string
  timezone?: string
}) => {
  const result = render(ScheduleBuilderHarness, { props })
  const getChanges = () =>
    JSON.parse(result.getByTestId("changes").textContent || "[]") as Array<{
      cron: string
      timezone: string
    }>
  return { ...result, getChanges }
}

vi.mock("./NextExecutionsTable.svelte", () => ({
  default: MockSlot,
}))

describe("ScheduleBuilder", () => {
  it("does not overwrite an existing cron expression on mount", async () => {
    const { getChanges } = renderScheduleBuilder({
      cronExpression: "0 12 * * *",
      timezone: "UTC",
    })

    await tick()

    expect(getChanges()).toEqual([])
  })

  it("hydrates a daily cron expression into the friendly controls", () => {
    const { getByLabelText, getByTestId } = renderScheduleBuilder({
      cronExpression: "0 9 * * *",
      timezone: "UTC",
    })

    expect(getByLabelText("Period")).toHaveValue("daily")
    expect(getByTestId("time-field")).toHaveAttribute("data-value", "09:00")
  })

  it("hydrates a weekly cron expression into the friendly controls", () => {
    const { getByLabelText } = renderScheduleBuilder({
      cronExpression: "30 14 * * 1,3,5",
      timezone: "UTC",
    })

    expect(getByLabelText("Period")).toHaveValue("weekly")
    expect(getByLabelText("Days of the week")).toHaveValue(["1", "3", "5"])
  })

  it("hydrates a monthly cron expression into the friendly controls", () => {
    const { getByLabelText } = renderScheduleBuilder({
      cronExpression: "15 8 1,15 * *",
      timezone: "UTC",
    })

    expect(getByLabelText("Period")).toHaveValue("monthly")
    expect(getByLabelText("Days of the month")).toHaveValue(["1", "15"])
  })

  it("allows reboot cron from the cron builder", async () => {
    const { getChanges, getByText } = renderScheduleBuilder({
      cronExpression: "0 12 * 1 *",
      timezone: "UTC",
    })

    await fireEvent.click(getByText("Select reboot cron"))

    await waitFor(() => {
      expect(getChanges()).toEqual([{ cron: REBOOT_CRON, timezone: "UTC" }])
    })
  })
})
