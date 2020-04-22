<script>
  export let heading = ""
  export let subheading = ""
  export let content = ""
  export let imageUrl = ""
  export let button1Text = ""
  export let button2Text = ""
  export let cardClick = () => {}
  export let button1Click = () => {}
  export let button2Click = () => {}

  $: showImage = !!imageUrl
  $: showButton1 = !!button1Text
  $: showButton2 = !!button2Text
  $: showButtons = !!showButton1 && !!showButton2
</script>

<div class="mdc-card" on:click={cardClick}>
  <div class="mdc-card__primary-action demo-card__primary-action" tabindex="0">
    {#if showImage}
      <div
        class="mdc-card__media mdc-card__media--16-9 demo-card__media"
        style="background-image: url(&quot;{imageUrl}&quot;);" />
    {/if}
    <div class="pad">
      <div class="demo-card__primary">
        <h2 class="demo-card__title mdc-typography mdc-typography--headline6">
          {heading}
        </h2>
        <h3
          class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">
          {subheading}
        </h3>
      </div>
      <div class="demo-card__secondary mdc-typography mdc-typography--body2">
        {content}
      </div>

    </div>
  </div>
  {#if showButtons}
    <div class="mdc-card__actions">
      <div class="mdc-card__action-buttons">
        {#if showButton1}
          <button class="mdc-button mdc-card__action mdc-card__action--button">
            <span class="mdc-button__ripple" on:click={button1Click} />
            {button1Text}
          </button>
        {/if}
        {#if showButton2}
          <button
            class="mdc-button mdc-card__action mdc-card__action--button"
            on:click={button2Click}>
            <span class="mdc-button__ripple" />
            {button2Text}
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .pad {
    padding: 10px;
  }
</style>
