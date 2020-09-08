<script>
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import OptionSelect from "./OptionSelect.svelte"

  const dispatch = createEventDispatcher()

  export let value = ""

  function handleSelect(selected) {
    value = selected
    dispatch("change", value)
  }

  let options = $store.allScreens.map(s => ({
    value: s.route,
    label: s.props._instanceName,
  }))
</script>

<OptionSelect {options} {value} onChange={handleSelect} />
