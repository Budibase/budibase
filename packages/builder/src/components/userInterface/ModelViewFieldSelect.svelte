<script>
  import OptionSelect from "./OptionSelect.svelte"
  import { backendUiStore } from "builderStore"
  import { onMount } from "svelte"

  export let componentInstance = {}

  let datasource = componentInstance.datasource
  const models = $backendUiStore.models

  let options = []

  $: model = datasource ? models.find(m => m._id === datasource.modelId) : null

  $: if (model) {
    options = datasource.isModel
      ? Object.keys(model.schema)
      : Object.keys(model.views[datasource.name].schema)
  }
</script>

<OptionSelect {options} />
