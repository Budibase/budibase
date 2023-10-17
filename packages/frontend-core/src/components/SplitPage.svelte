<script>
  import BG from "../../assets/bg.png"
</script>

<div class="split-page">
  <div class="left">
    <div class="content">
      <slot />
    </div>
  </div>
  <div class="right spectrum spectrum--darkest">
    <!-- No alt attribute to avoid flash -->
    <img src={BG} alt=" " />
    <slot name="right" />
  </div>
</div>

<style>
  .split-page {
    height: 100%;
    display: grid;
    grid-template-columns: max(50%, 380px) 1fr;
    justify-content: stretch;
    overflow: hidden;
  }
  .left {
    background: var(--background);
    display: grid;
    place-items: center;
    padding: 40px;
    overflow-y: auto;
  }
  .right {
    overflow: hidden;
    position: relative;
  }
  .right img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  .content {
    width: 100%;
    max-width: 400px;
    min-height: 480px;
  }

  @media (max-width: 740px) {
    .split-page {
      grid-template-columns: 1fr;
    }
    .left {
      padding: 20px;
    }
    .right {
      display: none;
    }
  }
</style>
