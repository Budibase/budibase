<script lang="ts">
  export let title: string
  export let linkTitle: string | undefined = undefined
  export let linkHref: string = "#"
  export let image: string
  export let color: string
</script>

<div class="hero" style="--color:{color};">
  <div class="text">
    <h1>{title}</h1>
    <p><slot /></p>
    {#if linkTitle}
      <a href={linkHref}>{linkTitle}</a>
    {/if}
  </div>
  <img src={image} alt="hero" />
</div>

<style>
  .hero {
    background: var(--color);
    border-radius: 16px;
    padding: 25px 48px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 520px;
    min-width: 260px;
  }
  h1 {
    font-size: 48px;
    margin: 0;
    font-weight: 500;
    color: white;
  }
  p {
    margin: 0;
    font-size: 16px;
    color: var(--spectrum-global-color-gray-800);
  }
  a {
    font-size: 16px;
    color: white;
  }
  img {
    max-width: 520px;
    max-height: 300px;
  }
</style>
