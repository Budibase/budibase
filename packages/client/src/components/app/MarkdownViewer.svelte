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
    <Placeholder>
      <div slot="content">
        Add some <mark>Markdown</mark> in the field setting to start using your
        component&nbsp;
        <span
          class="showMe spectrum-Link"
          on:click={() => {
            builderStore.actions.setFocus([
              {
                location: "component_settings",
                key: "value",
                target: $component.id,
              },
            ])
          }}
        >
          Show me
        </span>
      </div>
    </Placeholder>
  {/if}
</div>
