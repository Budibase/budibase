<script>
  import Modal from "../../../common/Modal.svelte"
  import ActionButton from "../../../common/ActionButton.svelte"
  import { backendUiStore } from "../../../builderStore"
  import ModelView from "../../ModelView.svelte"
  import ActionsHeader from "../../ActionsHeader.svelte"
  import * as api from "../api"
</script>

<section>
  <h4 class="budibase__title--4">
    <i class="ri-list-settings-line" />
    Create / Edit Model
  </h4>
  <div class="actions">
    <ModelView />
    <ActionsHeader />
  </div>
</section>
