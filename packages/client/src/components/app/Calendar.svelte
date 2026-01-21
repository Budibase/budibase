<script lang="ts">
  import { componentStore } from "@/stores"
  import { getContext } from "svelte"

  export let title: string

  const { styleable } = getContext("sdk")
  const component = getContext("component")
</script>

<div use:styleable={$component.styles}>
  <h2>{title}</h2>
</div>
