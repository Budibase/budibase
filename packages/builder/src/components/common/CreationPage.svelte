<script>
  import { Icon, Heading } from "@budibase/bbui"

  export let showClose = false
  export let onClose = () => {}
  export let heading = ""
</script>

<section class="page">
  <div class="closeButton">
    {#if showClose}
      <Icon hoverable name="Close" on:click={onClose} />
    {/if}
  </div>
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
