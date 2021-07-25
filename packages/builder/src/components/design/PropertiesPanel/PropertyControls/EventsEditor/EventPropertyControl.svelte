<script>
  import { ActionButton, Button, Drawer } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { notifications } from "@budibase/bbui"
  import EventEditor from "./EventEditor.svelte"
  import { automationStore } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value = []
  export let name

  let drawer

  const saveEventData = async () => {
    // any automations that need created from event triggers
    const automationsToCreate = value.filter(
      action => action["##eventHandlerType"] === "Trigger Automation"
    )
    for (let action of automationsToCreate) {
      await createAutomation(action.parameters)
    }

    dispatch("change", value)
    notifications.success("Component actions saved.")
    drawer.hide()
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
      fields: Object.keys(parameters.fields).reduce((fields, key) => {
        fields[key] = "string"
        return fields
      }, {}),
    }

    automationStore.actions.addBlockToAutomation(newBlock)
    await automationStore.actions.save($automationStore.selectedAutomation)
    parameters.automationId = $automationStore.selectedAutomation.automation._id
    delete parameters.newAutomationName
  }
</script>

<ActionButton on:click={drawer.show}>Define actions</ActionButton>
<Drawer bind:this={drawer} title={"Actions"}>
  <svelte:fragment slot="description">
    Define what actions to run.
  </svelte:fragment>
  <Button cta slot="buttons" on:click={saveEventData}>Save</Button>
  <EventEditor slot="body" bind:actions={value} eventType={name} />
</Drawer>
