<script>
  import { styleable } from "@budibase/component-sdk"

  export let className = ""
  export let type
  export let text = ""
  export let styles
</script>

{#if type === 'h1'}
  <h1 class={className} use:styleable={styles}>{text}</h1>
{:else if type === 'h2'}
  <h2 class={className} use:styleable={styles}>{text}</h2>
{:else if type === 'h3'}
  <h3 class={className} use:styleable={styles}>{text}</h3>
{:else if type === 'h4'}
  <h4 class={className} use:styleable={styles}>{text}</h4>
{:else if type === 'h5'}
  <h5 class={className} use:styleable={styles}>{text}</h5>
{:else if type === 'h6'}
  <h6 class={className} use:styleable={styles}>{text}</h6>
{/if}
