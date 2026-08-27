<script>
  import { tick } from "svelte"
  import {
    ModalContent,
    TextArea,
    notifications,
    ActionButton,
    Select,
  } from "@budibase/bbui"
  import { automationStore, roles, selectedAutomation } from "@/stores/builder"
  import { auth } from "@/stores/portal"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"
  import { AutomationEventType } from "@budibase/types"
  import { Constants } from "@budibase/frontend-core"
  import { onMount } from "svelte"

  let failedParse = null
  let trigger = {}
  let schemaProperties = {}
  let previewRolesLoading = false
  let previewRoleId = $auth.user?.roleId || Constants.Roles.ADMIN

  $: previewRoleOptions = $roles.map(role => ({
    label: role.uiMetadata?.displayName || role.name,
    value: role._id,
  }))

  const refreshPreviewRoles = async () => {
    const workspaceId = $selectedAutomation.data?.appId
    if (!workspaceId || previewRolesLoading) {
      return
    }
    previewRolesLoading = true
    try {
      await roles.fetchByAppId(workspaceId)
    } catch (error) {
      notifications.error(error)
    } finally {
      previewRolesLoading = false
    }
  }

  onMount(refreshPreviewRoles)

  const rowTriggers = [
    AutomationEventType.ROW_DELETE,
    AutomationEventType.ROW_UPDATE,
    AutomationEventType.ROW_SAVE,
    AutomationEventType.ROW_ACTION,
  ]

  /**
   * Parses the automation test data and ensures it is valid
   * @param {object} testData contains all config for the test
   * @returns {object} valid testData
   * @todo Parse *all* data for each trigger type and relay adequate feedback
   */
  const parseTestData = testData => {
    const autoTrigger = $selectedAutomation.data?.definition?.trigger
    const { tableId } = autoTrigger?.inputs || {}

    // Ensure the tableId matches the trigger table for row trigger automations
    if (
      rowTriggers.includes(autoTrigger?.event) &&
      testData?.row?.tableId !== tableId
    ) {
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
   * @param {object} trigger The automation trigger config
   * @returns {boolean} validation status
   * @todo Parse *all* trigger types relay adequate feedback
   */
  const isTriggerValid = trigger => {
    if (rowTriggers.includes(trigger?.event) && !trigger?.inputs?.tableId) {
      return false
    }
    return true
  }

  $: currentTestData = $selectedAutomation.data.testData

  // Can be updated locally to avoid race condition when testing
  $: testData = parseTestData(currentTestData)

  $: {
    // clone the trigger so we're not mutating the reference
    trigger = cloneDeep($selectedAutomation.data.definition.trigger)

    // get the outputs so we can define the fields
    let schema = Object.entries(trigger.schema?.outputs?.properties || {})

    if (trigger?.event === AutomationEventType.APP_TRIGGER) {
      schema = [["fields", { customType: "fields" }]]
    }
    schemaProperties = schema
  }

  // Check the schema to see if required fields have been entered
  $: isError =
    !isTriggerValid(trigger) ||
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

    if (rowTriggers.includes(trigger?.event)) {
      const tableId = trigger?.inputs?.tableId

      if (!jsonUpdate.row) {
        jsonUpdate.row = {}
      }

      // Reset the tableId as it must match the trigger
      if (jsonUpdate?.row?.tableId !== tableId) {
        jsonUpdate.row.tableId = tableId
      }
    }

    const updatedAuto =
      automationStore.actions.addTestDataToAutomation(jsonUpdate)
    await automationStore.actions.save(updatedAuto)
  }

  const testAutomation = async () => {
    // Ensure testData reactiveness is processed
    await tick()
    try {
      await automationStore.actions.test($selectedAutomation.data, {
        ...testData,
        previewRoleId,
      })
      automationStore.update(state => ({ ...state, showTestModal: false }))
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
  <div class="test-as">
    <span>Test as</span>
    <div class="test-as-picker">
      <Select
        value={previewRoleId}
        options={previewRoleOptions}
        placeholder={false}
        loading={previewRolesLoading}
        on:click={refreshPreviewRoles}
        on:change={event => (previewRoleId = event.detail)}
      />
    </div>
  </div>
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
          testData = parseTestData(updatedTestData)
        }}
      />
    </div>
  {/if}
  {#if selectedJSON}
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

  .test-as {
    display: grid;
    grid-template-columns: 1fr 320px;
    align-items: center;
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-m);
  }

  .test-as-picker {
    width: 100%;
  }

  .options {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
