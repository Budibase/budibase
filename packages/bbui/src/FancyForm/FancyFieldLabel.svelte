<script>
  export let placeholder = true
</script>

<div class:placeholder>
  <slot />
</div>

<style>
  div {
    font-size: 14px;
    font-weight: 500;
    transform: translateY(-50%);
    position: absolute;
    top: 18px;
    color: var(--spectrum-global-color-gray-600);
    transition: font-size 130ms ease-out, top 130ms ease-out;
  }
  div.placeholder {
    top: 50%;
    font-size: 15px;
    transform: translateY(-50%);
  }
</style>
