<script lang="ts">
  import { tick } from "svelte"
  import {
    ModalContent,
    TextArea,
    notifications,
    ActionButton,
    CoreSelect,
  } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"
  import {
    AutomationCustomIOType,
    AutomationEventType,
    AutomationTestData,
    AutomationTrigger,
    BaseIOStructure,
  } from "@budibase/types"

  let failedParse: string | undefined = undefined
  let trigger: AutomationTrigger | undefined = undefined
  let schemaProperties: [string, BaseIOStructure][] = []

  const rowTriggers = [
    AutomationEventType.ROW_DELETE,
    AutomationEventType.ROW_UPDATE,
    AutomationEventType.ROW_SAVE,
    AutomationEventType.ROW_ACTION,
  ]

  const isRowTrigger = () => {
    const event = $selectedAutomation.data?.definition?.trigger?.event
    if (!event) return false
    return rowTriggers.includes(event)
  }

  /**
   * Parses the automation test data and ensures it is valid
   * @todo Parse *all* data for each trigger type and relay adequate feedback
   */
  const parseTestData = (testData: AutomationTestData): AutomationTestData => {
    const { tableId } =
      $selectedAutomation.data?.definition?.trigger?.inputs || {}

    // Ensure the tableId matches the trigger table for row trigger automations
    if (isRowTrigger() && testData?.row?.tableId !== tableId) {
      return {
        // Reset Core fields
        row: { tableId },
        meta: {},
        id: "",
        revision: "",
      }
    } else {
      // Leave the core data as it is
      return cloneDeep(testData)
    }
  }

  /**
   * Before executing a test run, relay if an automation is in a valid state
   * @todo Parse *all* trigger types relay adequate feedback
   */
  const isTriggerValid = (trigger: AutomationTrigger): boolean => {
    if (
      trigger.event &&
      rowTriggers.includes(trigger.event) &&
      !trigger?.inputs?.tableId
    ) {
      return false
    }
    return true
  }

  $: currentTestData = $selectedAutomation.data?.testData

  // Can be updated locally to avoid race condition when testing
  $: testData = currentTestData ? parseTestData(currentTestData) : undefined

  $: {
    if (!$selectedAutomation.data) return

    // clone the trigger so we're not mutating the reference
    trigger = cloneDeep($selectedAutomation.data.definition.trigger)

    // get the outputs so we can define the fields
    let schema = Object.entries(trigger.schema?.outputs?.properties || {})

    if (trigger?.event === AutomationEventType.APP_TRIGGER) {
      schema = [["fields", { customType: AutomationCustomIOType.FIELDS }]]
    }
    schemaProperties = schema
  }

  // Check the schema to see if required fields have been entered
  $: isError =
    (trigger && !isTriggerValid(trigger)) ||
    !(trigger?.schema.outputs.required || []).every(
      required =>
        testData?.[required as keyof typeof testData] || required !== "row"
    )

  async function parseTestJSON(e: { detail: string }) {
    let jsonUpdate

    try {
      jsonUpdate = JSON.parse(e.detail)
      failedParse = undefined
    } catch (e) {
      failedParse = "Invalid JSON"
      return false
    }

    if (trigger?.event && rowTriggers.includes(trigger.event)) {
      const tableId = trigger?.inputs?.tableId

      // Reset the tableId as it must match the trigger
      if (jsonUpdate?.row?.tableId !== tableId) {
        jsonUpdate.row.tableId = tableId
      }
    }

    const updatedAuto =
      automationStore.actions.addTestDataToAutomation(jsonUpdate)
    if (updatedAuto) {
      await automationStore.actions.save(updatedAuto)
    }
  }

  const testAutomation = async () => {
    if (!$selectedAutomation.data) {
      return
    }

    // Ensure testData reactiveness is processed
    await tick()
    try {
      await automationStore.actions.test($selectedAutomation.data, testData)
      $automationStore.showTestPanel = true
    } catch (error) {
      notifications.error(error)
    }
  }

  const toggle = () => {
    selectedValues = !selectedValues
    selectedJSON = !selectedJSON
  }
  let selectedValues = true
  let selectedJSON = false
</script>

<ModalContent
  title="Add test data"
  confirmText="Run test"
  size="L"
  showConfirmButton={true}
  disabled={isError}
  onConfirm={testAutomation}
  cancelText="Cancel"
>
  <div class="size">
    <div class="options">
      <ActionButton quiet selected={selectedValues} on:click={toggle}
        >Use values</ActionButton
      >
      <ActionButton quiet selected={selectedJSON} on:click={toggle}
        >Use JSON</ActionButton
      >
    </div>
  </div>

  {#if selectedValues}
    <div class="tab-content-padding">
      <AutomationBlockSetup
        {schemaProperties}
        isTestModal
        {testData}
        block={trigger}
        on:update={e => {
          const { testData: updatedTestData } = e.detail
          testData = updatedTestData
        }}
      />
    </div>
  {/if}
  {#if selectedJSON && $selectedAutomation.data}
    <div class="text-area-container">
      <TextArea
        value={JSON.stringify($selectedAutomation.data.testData, null, 2)}
        error={failedParse}
        on:change={async e => await parseTestJSON(e)}
      />
    </div>
  {/if}
</ModalContent>

<style>
  .text-area-container :global(textarea) {
    min-height: 300px;
    height: 300px;
  }

  .tab-content-padding {
    padding: 0 var(--spacing-s);
  }

  .options {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
