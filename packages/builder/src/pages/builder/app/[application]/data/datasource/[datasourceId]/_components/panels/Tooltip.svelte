<script>
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"
  import { Body } from "@budibase/bbui"

  export let title = ""
  export let href = null
</script>

<a {href} class="tooltip" target="_blank" rel="noopener noreferrer">
  <FontAwesomeIcon name="fa-solid fa-question-circle" />
  <Body weight="bold">{title}</Body>
</a>

<style>
  .tooltip {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .tooltip :global(p) {
    color: var(--grey-9);
  }

  .tooltip :global(svg) {
    margin-top: 1px;
    margin-right: 5px;
    color: var(--grey-7);
  }
</style>
