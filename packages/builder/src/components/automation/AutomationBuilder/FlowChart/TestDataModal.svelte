<script>
  import { ModalContent, Tabs, Tab, TextArea, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"

  let failedParse = null
  // clone the trigger so we're not mutating the reference
  let trigger = cloneDeep(
    $automationStore.selectedAutomation.automation.definition.trigger
  )

  if (!$automationStore.selectedAutomation.automation.testData) {
    $automationStore.selectedAutomation.automation.testData = {}
  }

  // get the outputs so we can define the fields
  let schemaProperties = Object.entries(trigger.schema.outputs.properties || {})

  // check to see if there is existing test data in the store
  $: testData = $automationStore.selectedAutomation.automation.testData

  // Checj the schema to see if required fields have been entered
  $: isError = !trigger.schema.outputs.required.every(
    required => testData[required]
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
</script>

<ModalContent
  title="Add test data"
  confirmText="Test"
  showConfirmButton={true}
  disabled={isError}
  onConfirm={() => {
    automationStore.actions.addTestDataToAutomation(testData)
    automationStore.actions.test($automationStore.selectedAutomation, testData)
  }}
  cancelText="Cancel"
>
  <Tabs selected="Form" quiet
    ><Tab icon="Form" title="Form"
      ><AutomationBlockSetup
        bind:testData
        {schemaProperties}
        block={trigger}
      /></Tab
    >
    <Tab icon="FileJson" title="JSON">
      <Label>JSON</Label><TextArea
        value={JSON.stringify(
          $automationStore.selectedAutomation.automation.testData,
          null,
          2
        )}
        error={failedParse}
        on:change={e => parseTestJSON(e)}
      />
    </Tab>
  </Tabs>
</ModalContent>
