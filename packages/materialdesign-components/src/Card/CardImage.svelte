<script>
  import { H6, Sub2 } from "../Typography"
  export let _bb
  export let displayHorizontal = false //aligns image on row with title and subtitle text
  export let url = ""
  export let title = ""
  export let subtitle = ""

  $: useTitle = !!title
  $: useSubTitle = !!subtitle
</script>

{#if !displayHorizontal}
  <div
    class="my-card__media mdc-card__media mdc-card__media--16-9"
    style={`background-image: url(${url})`}>
    <div class="mdc-card__media-content bbmd-card-media__content">
      {#if useTitle}
        <H6 text={title} verticalMargin={0} horizontalMargin={10} />
        {#if useSubTitle}
          <Sub2 text={subtitle} horizontalMargin={10} />
        {/if}
      {/if}
    </div>
  </div>
{:else}
  <div class="bbmd-card--horizontal">
    <div
      class="mdc-card__media mdc-card__media mdc-card__media--square
      bbmd-card--horizontal-image"
      style={`background-image: url(${url})`} />
    <div class="bbmd-card--horizontal-text">
      {#if useTitle}
        <H6 text={title} verticalMargin={0} horizontalMargin={10} />
        {#if useSubTitle}
          <Sub2 text={subtitle} horizontalMargin={10} />
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  .bbmd-card--horizontal {
    display: flex;
    flex-flow: row nowrap;
  }

  .bbmd-card--horizontal-image {
    flex: 0 0 110px;
  }

  .bbmd-card--horizontal-text {
    flex: 1;
    padding: 10px 5px;
  }

  .bbmd-card-media__content {
    top: 125px;
    color: white;
  }
</style>
