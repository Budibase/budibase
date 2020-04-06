<script>
  import ActionButton from "components/common/ActionButton.svelte"
  import { backendUiStore } from "builderStore"
  import ModelView from "../../ModelView.svelte"
  import * as api from "../api"
</script>

<section>
  <ModelView />
</section>

<style>
  section {
    padding: 30px;
  }
</style>
