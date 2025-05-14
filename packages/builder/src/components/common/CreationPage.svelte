<script lang="ts">
  import { Icon, Heading } from "@budibase/bbui"

  export let showClose: boolean = false
  export let onClose: (() => void) | null = () => {}
  export let heading: string = ""
</script>

<section class="page">
  {#if showClose}
    <div class="closeButton">
      <Icon hoverable name="Close" on:click={onClose} />
    </div>
  {/if}
  <div class="heading">
    <Heading weight="light">{heading}</Heading>
  </div>
  <slot />
</section>

<style>
  .page {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .heading {
    text-align: center;
  }

  .closeButton {
    height: 38px;
    display: flex;
    justify-content: right;
    width: 100%;
  }
</style>
