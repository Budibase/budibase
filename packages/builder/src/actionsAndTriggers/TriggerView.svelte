<script>
  import Textbox from "../common/Textbox.svelte"
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import Dropdown from "../common/Dropdown.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import CodeArea from "../common/CodeArea.svelte"
  import { cloneDeep, filter, keys, some, map, isUndefined } from "lodash/fp"
  import ErrorsBox from "../common/ErrorsBox.svelte"
  import { validateTriggers, pipe, events } from "../common/core"
  import getIcon from "../common/icon"

  export let trigger
  export let onFinished = action => {}
  export let allTriggers
  export let allActions

  let clonedTrigger = cloneDeep(trigger)
  let errors = []
  $: actionNames = map(a => a.name)(allActions)

  let cancel = () => onFinished()
  let save = () => {
    const newTriggersList = [
      ...pipe(
        allTriggers,
        [filter(t => t !== trigger)]
      ),
      clonedTrigger,
    ]

    errors = validateTriggers(newTriggersList, allActions)

    const test = map(
      t => !t.actionName || some(a => a.name === t.actionName)(allActions)
    )(newTriggersList)

    if (errors.length === 0) onFinished(clonedTrigger)
  }
</script>

<div>

  <ErrorsBox {errors} style="margin-bottom:20px" />

  <form class="uk-form-horizontal">

    <Dropdown
      label="Event"
      options={['', ...events]}
      bind:selected={clonedTrigger.eventName} />
    <Dropdown
      label="Action"
      options={['', ...actionNames]}
      bind:selected={clonedTrigger.actionName} />
    <CodeArea
      label="Condition"
      javascript
      bind:text={clonedTrigger.condition} />
    <CodeArea
      label="Action Options Creator"
      javascript
      bind:text={clonedTrigger.optionsCreator} />

  </form>

  <div class="uk-modal-footer uk-text-right">
    <ButtonGroup>
      <ActionButton primary on:click={save}>Save</ActionButton>
      <ActionButton alert on:click={cancel}>Cancel</ActionButton>
    </ButtonGroup>
  </div>
</div>

<style>

</style>
