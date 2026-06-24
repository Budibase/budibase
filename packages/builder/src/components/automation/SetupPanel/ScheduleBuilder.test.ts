import { fireEvent, render, waitFor } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import { tick } from "svelte"
import MockDatePicker from "@/test/mocks/MockDatePicker.svelte"
import MockCronBuilder from "@/test/mocks/MockCronBuilder.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockSelect from "@/test/mocks/MockSelect.svelte"
import MockSlot from "@/test/mocks/MockSlot.svelte"
import ScheduleBuilderHarness from "@/test/mocks/ScheduleBuilderHarness.svelte"
import { REBOOT_CRON } from "@budibase/shared-core"

vi.mock("@budibase/bbui", () => ({
  DatePicker: MockDatePicker,
  Label: MockSlot,
  Layout: MockLayout,
  Multiselect: MockSelect,
  Select: MockSelect,
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

  it("allows reboot cron from the cron builder", async () => {
    const { getChanges, getByText } = renderScheduleBuilder({
      cronExpression: "0 12 * * *",
      timezone: "UTC",
    })

    await fireEvent.click(getByText("Select reboot cron"))

    await waitFor(() => {
      expect(getChanges()).toEqual([{ cron: REBOOT_CRON, timezone: "UTC" }])
    })
  })

  it("disables clearing the schedule time picker", () => {
    const { getByTestId } = renderScheduleBuilder({
      cronExpression: "",
      timezone: "UTC",
    })

    expect(getByTestId("date-picker")).toHaveAttribute(
      "data-disable-clear",
      "true"
    )
  })
})
