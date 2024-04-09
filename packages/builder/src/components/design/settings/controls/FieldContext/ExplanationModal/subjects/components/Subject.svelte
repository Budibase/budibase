<script>
  export let heading = ""
</script>

<div class="heading">
  <span class="heading">
    <slot name="heading">
      {heading}
    </slot>
  </span>
</div>
<div class="divider" />
<slot />

<style>
  .heading {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .divider {
    border-bottom: 1px solid var(--grey-4);
    margin: 12px 0 12px;
  }
</style>
