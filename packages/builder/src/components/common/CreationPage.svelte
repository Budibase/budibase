<script lang="ts">
  import { Icon, Heading } from "@budibase/bbui"

  export let showClose: boolean = false
  export let onClose: (() => void) | null = () => {}
  export let heading: string = ""
</script>

<section class="page">
  {#if showClose}
    <div class="closeButton">
      <Icon hoverable name="x" on:click={() => onClose?.()} />
    </div>
  {/if}
  <div class="heading">
    <Heading size="S" weight="400">{heading}</Heading>
  </div>
  <slot />
</section>

<style>
  .page {
    max-width: 1050px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .heading {
    width: 100%;
    margin-bottom: 20px;
  }

  .closeButton {
    height: 38px;
    display: flex;
    justify-content: right;
    width: 100%;
  }
</style>
