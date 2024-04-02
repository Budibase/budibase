<script>
  import {
    ModalContent,
    TextArea,
    notifications,
    ActionButton,
  } from "@budibase/bbui"
  import { automationStore, selectedAutomation } from "stores/builder"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"

  let failedParse = null
  let trigger = {}
  let schemaProperties = {}

  $: {
    // clone the trigger so we're not mutating the reference
    trigger = cloneDeep($selectedAutomation.definition.trigger)

    // get the outputs so we can define the fields
    let schema = Object.entries(trigger.schema?.outputs?.properties || {})

    if (trigger?.event === "app:trigger") {
      schema = [["fields", { customType: "fields" }]]
    }

    schemaProperties = schema
  }

  // check to see if there is existing test data in the store
  $: testData = $selectedAutomation.testData || {}

  // Check the schema to see if required fields have been entered
  $: isError = !trigger.schema.outputs.required.every(
    required => testData[required] || required !== "row"
  )

  function parseTestJSON(e) {
    try {
      const obj = JSON.parse(e.detail)
      failedParse = null
      automationStore.actions.addTestDataToAutomation(obj)
    } catch (e) {
      failedParse = "Invalid JSON"
    }
  }

  const testAutomation = async () => {
    try {
      await automationStore.actions.test($selectedAutomation, testData)
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
        {testData}
        {schemaProperties}
        isTestModal
        block={trigger}
      />
    </div>
  {/if}
  {#if selectedJSON}
    <div class="text-area-container">
      <TextArea
        value={JSON.stringify($selectedAutomation.testData, null, 2)}
        error={failedParse}
        on:change={e => parseTestJSON(e)}
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
