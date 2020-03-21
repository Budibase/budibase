<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import IndexView from "../../IndexView.svelte"
  import ActionsHeader from "../../ActionsHeader.svelte"
  import * as api from "../api"

  export let modalOpen = false
  export let onClosed

  let recordInfo = {}

</script>

<section>
  <IndexView />
  <ActionsHeader />

  <!-- <div class="actions">
    <ActionButton alert on:click={onClosed}>Cancel</ActionButton>
    <ActionButton disabled={false} on:click={() => api.saveRecord(recordInfo)}>
      Save
    </ActionButton>
  </div> -->
</section>
