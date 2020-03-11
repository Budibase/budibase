<script>
  import { getContext } from "svelte"
  import ripple from "../Ripple.js"

  export let onClick = null
  export let icon = ""
  export let context = ""

  let cls = !!context ? `material-icons mdc-${context}__icon` : "material-icons"

  $: useRipple = onClick !== null
</script>

<i class={cls}>{icon}</i>
{#if useRipple}
  <div use:ripple>
    <i on:click={onClick} class={cls}>{icon}</i>
  </div>
{:else}
  <i class={cls}>{icon}</i>
{/if}

<style>
  div {
    border-radius: 50%;
    padding-top: 2px;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
  }
</style>
