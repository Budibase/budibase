<script>
  //   import ClassBuilder from "../ClassBuilder.js"

  //   const cb = new ClassBuilder("notched-outline")
  export let useLabel = true
</script>

<div class="mdc-notched-outline">
  <div class="mdc-notched-outline__leading" />
  {#if useLabel}
    <div class="mdc-notched-outline__notch">
      <slot />
    </div>
  {/if}
  <div class="mdc-notched-outline__trailing" />
</div>
