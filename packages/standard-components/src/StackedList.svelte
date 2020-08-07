<script>
  export let imageUrl = ""
  export let heading = ""
  export let text1 = ""
  export let text2 = ""
  export let text3 = ""
  export let destinationUrl = ""

  $: showImage = !!imageUrl
</script>

<div class="container">
  <a href={destinationUrl}>
    <div class="content">
      {#if showImage}
        <div class="image-block">
          <img class="image" src={imageUrl} alt="" />
        </div>
      {/if}
      <h2 class="heading">{heading}</h2>
      <h4 class="text">{text1}</h4>
      <h4 class="text">{text2}</h4>
      <h4 class="text3">{text3}</h4>
    </div>
  </a>
</div>

<style>
  a {
    text-decoration: none;
    color: inherit;
  }
  .container {
    padding: 20px;
  }

  .content {
    display: grid;
    grid-template-columns: 120px 300px 1fr 1fr 1fr;
    align-items: center;
    gap: 20px;
    min-height: 80px;
  }

  @media (max-width: 800px) {
    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  .image-block {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .image {
    padding: 2px;
    max-width: 80px;
    max-height: 80px;
    margin-right: 20px;
  }

  .heading {
    font-size: 24px;
    margin: 0;
    min-width: 200px;
  }

  .text {
    font-size: 16px;
    font-weight: 400;
  }

  .text3 {
    text-align: end;
    font-size: 16px;
    font-weight: 400;
  }

  @media (max-width: 800px) {
    .text3 {
      text-align: start;
    }
  }
</style>
