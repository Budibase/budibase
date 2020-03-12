<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import * as api from "../api"

  export let modalOpen = false
  export let model = {}

  const onClosed = () => (modalOpen = false)
</script>

<Modal {onClosed} bind:isOpen={modalOpen} title={'Record'}>
  <h4 class="budibase__title--4">Create / Edit Record</h4>
  <div class="actions">
    <form>
      <div class="uk-margin">
        <label class="uk-form-label" for="form-stacked-text">Text</label>
        <div class="uk-form-controls">
          <input
            class="uk-input"
            id="form-stacked-text"
            type="text"
            placeholder="Some text..." />
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="form-stacked-select">Select</label>
        <div class="uk-form-controls">
          <select class="uk-select" id="form-stacked-select">
            <option>Option 01</option>
            <option>Option 02</option>
          </select>
        </div>
      </div>

      <div class="uk-margin">
        <div class="uk-form-label">Radio</div>
        <div class="uk-form-controls">
          <label>
            <input class="uk-radio" type="radio" name="radio1" />
            Option 01
          </label>
          <br />
          <label>
            <input class="uk-radio" type="radio" name="radio1" />
            Option 02
          </label>
        </div>
      </div>

    </form>
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton
      disabled={false}
      on:click={() => api.createNewRecord(recordInfo)}>
      Save
    </ActionButton>
  </div>
</Modal>
