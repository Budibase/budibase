<script>
  import { getContext } from "svelte"

  export let requiredSetting

  const { builderStore } = getContext("sdk")
</script>

<span>
  Add the <mark>{requiredSetting.label}</mark> setting to start using your component
</span>
<span>-</span>
<span
  class="spectrum-Link"
  on:click={() => {
    builderStore.actions.highlightSetting(requiredSetting.key)
  }}
>
  Show me
</span>
