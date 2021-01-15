<script>
  import { Button, Modal } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import EventEditor from "./EventEditor.svelte"
  import BottomDrawer from "components/common/BottomDrawer.svelte"
  import { automationStore } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value
  export let name

  let drawerVisible

  function showDrawer() {
    drawerVisible = true
  }

  const saveEventData = async () => {
    // any automations that need created from event triggers
    const automationsToCreate = value.filter(
      action => action["##eventHandlerType"] === "Trigger Automation"
    )
    automationsToCreate.forEach(action => createAutomation(action.parameters))

    dispatch("change", value)
    notifier.success("Component actions saved.")
  }

  // called by the parent modal when actions are saved
  const createAutomation = async parameters => {
    if (parameters.automationId || !parameters.newAutomationName) return

    await automationStore.actions.create({ name: parameters.newAutomationName })

    const appActionDefinition = $automationStore.blockDefinitions.TRIGGER.APP

    const newBlock = $automationStore.selectedAutomation.constructBlock(
      "TRIGGER",
      "APP",
      appActionDefinition
    )

    newBlock.inputs = {
      fields: Object.entries(parameters.fields).reduce(
        (fields, [key, value]) => {
          fields[key] = value.type
          return fields
        },
        {}
      ),
    }

    automationStore.actions.addBlockToAutomation(newBlock)

    await automationStore.actions.save($automationStore.selectedAutomation)

    parameters.automationId = $automationStore.selectedAutomation.automation._id
    delete parameters.newAutomationName
  }
</script>

<Button secondary small on:click={showDrawer}>Define Actions</Button>

{#if drawerVisible}
  <BottomDrawer title={'Actions'} onClose={() => (drawerVisible = false)}>
    <heading slot="buttons">
      <Button thin blue on:click={saveEventData}>Save</Button>
    </heading>
    <div slot="body">
      <EventEditor event={value} eventType={name} />
    </div>
  </BottomDrawer>
{/if}
