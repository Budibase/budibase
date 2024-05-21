<script>
  import Section from "./Section.svelte"

  export let heading
</script>

<Section>
  <span class="exampleSectionHeading">
    <slot name="heading">
      {heading}
    </slot>
  </span>
  <ul>
    <slot />
  </ul>
</Section>

<style>
  .exampleSectionHeading {
    display: inline-block;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  ul {
    padding: 0 0 0 23px;
    margin: 0;
  }
</style>
