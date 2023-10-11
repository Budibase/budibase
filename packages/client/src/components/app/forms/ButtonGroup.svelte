<script>
  import { getContext } from "svelte"
  import Container from "components/app/Container.svelte"
  import BlockComponent from "../../BlockComponent.svelte"
  import Block from "../../Block.svelte"

  const { styleable } = getContext("sdk")
  const component = getContext("component")

  export let buttons = []
  export let direction
  export let hAlign
  export let vAlign
  export let gap = "S"
  export let wrap

  $: console.log("client buttons/wrap", buttons, wrap)
</script>

<!-- <div use:styleable={$component.styles}> -->
  <Block>
    <Container {direction} {hAlign} {vAlign} {gap} {wrap}>
      {#each buttons as { text, type, quiet, disabled, onClick, size }}
        <BlockComponent
          type="button"
          props={{
            text,
            onClick,
            type,
            quiet,
            disabled,
            size
          }}
        />
      {/each}
    </Container>
  </Block>
<!-- </div> -->
