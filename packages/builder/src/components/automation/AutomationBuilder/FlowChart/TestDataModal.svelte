<script>
  import { tick } from "svelte"
  import { ModalContent, notifications } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import TestDataEditor from "../../SetupPanel/TestDataEditor.svelte"
  import { cloneDeep } from "lodash/fp"
  import {
    buildTriggerSchemaProperties,
    isTriggerValidForTestData,
    normalizeParsedJsonForTrigger,
    parseTestDataForTrigger,
  } from "../../SetupPanel/testDataUtils"

  let failedParse = null
  let trigger = {}
  let schemaProperties = {}

  $: currentTestData = $selectedAutomation.data.testData

  // Can be updated locally to avoid race condition when testing
  $: testData = parseTestDataForTrigger(trigger, currentTestData)

  // clone the trigger so we're not mutating the reference
  $: trigger = cloneDeep($selectedAutomation.data.definition.trigger)
  $: schemaProperties = buildTriggerSchemaProperties(trigger)

  // Check the schema to see if required fields have been entered
  $: isError =
    !isTriggerValidForTestData(trigger) ||
    !(trigger.schema.outputs.required || []).every(
      required => testData?.[required] || required !== "row"
    )

  async function parseTestJSON(e) {
    let jsonUpdate

    try {
      jsonUpdate = JSON.parse(e.detail)
      failedParse = null
    } catch (e) {
      failedParse = "Invalid JSON"
      return false
    }

    jsonUpdate = normalizeParsedJsonForTrigger(trigger, jsonUpdate)

    const updatedAuto =
      automationStore.actions.addTestDataToAutomation(jsonUpdate)
    if (!updatedAuto) {
      return
    }
    await automationStore.actions.save(updatedAuto)
  }

  const testAutomation = async () => {
    // Ensure testData reactiveness is processed
    await tick()
    try {
      await automationStore.actions.test($selectedAutomation.data, testData)
      automationStore.update(state => ({ ...state, showTestModal: false }))
    } catch (error) {
      notifications.error(error)
    }
  }
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
  <TestDataEditor
    showTitle={false}
    {schemaProperties}
    {testData}
    block={trigger}
    {failedParse}
    jsonValue={JSON.stringify($selectedAutomation.data.testData, null, 2)}
    on:values-change={e => {
      const { testData: updatedTestData } = e.detail
      testData = parseTestDataForTrigger(trigger, updatedTestData)
    }}
    on:json-change={parseTestJSON}
  />
</ModalContent>
