<script>
  import { MarkdownViewer } from "@budibase/bbui"
  import { getContext } from "svelte"
  import Placeholder from "./Placeholder.svelte"

  export let value

  const component = getContext("component")
  const { builderStore, styleable } = getContext("sdk")
  const height = $component.styles?.normal?.height
</script>

<div use:styleable={$component.styles}>
  {#if value}
    <MarkdownViewer {value} {height} />
  {:else if $builderStore.inBuilder}
    <Placeholder />
  {/if}
</div>
