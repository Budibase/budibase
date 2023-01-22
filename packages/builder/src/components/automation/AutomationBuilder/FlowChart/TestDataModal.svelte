<script>
  import {
    ModalContent,
    Tabs,
    Tab,
    TextArea,
    Label,
    notifications,
  } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"

  let failedParse = null
  let trigger = {}
  let schemaProperties = {}

  $: {
    // clone the trigger so we're not mutating the reference
    trigger = cloneDeep(
      $automationStore.selectedAutomation.automation.definition.trigger
    )

    // get the outputs so we can define the fields
    let schema = Object.entries(trigger.schema?.outputs?.properties || {})

    if (trigger?.event === "app:trigger") {
      schema = [["fields", { customType: "fields" }]]
    }

    schemaProperties = schema
  }

  // check to see if there is existing test data in the store
  $: testData = $automationStore.selectedAutomation.automation.testData || {}

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
      await automationStore.actions.test(
        $automationStore.selectedAutomation?.automation,
        testData
      )
      $automationStore.showTestPanel = true
    } catch (error) {
      notifications.error("Error testing automation")
    }
  }
</script>

<ModalContent
  title="Add test data"
  confirmText="Test"
  showConfirmButton={true}
  disabled={isError}
  onConfirm={testAutomation}
  cancelText="Cancel"
>
  <Tabs selected="Form" quiet
    ><Tab icon="Form" title="Form">
      <div class="tab-content-padding">
        <AutomationBlockSetup
          {testData}
          {schemaProperties}
          isTestModal
          block={trigger}
        />
      </div></Tab
    >
    <Tab icon="FileJson" title="JSON">
      <div class="tab-content-padding">
        <Label>JSON</Label>
        <div class="text-area-container">
          <TextArea
            value={JSON.stringify(
              $automationStore.selectedAutomation.automation.testData,
              null,
              2
            )}
            error={failedParse}
            on:change={e => parseTestJSON(e)}
          />
        </div>
      </div>
    </Tab>
  </Tabs>
</ModalContent>

<style>
  .text-area-container :global(textarea) {
    min-height: 200px;
    height: 200px;
  }

  .tab-content-padding {
    padding: 0 var(--spacing-xl);
  }
</style>
