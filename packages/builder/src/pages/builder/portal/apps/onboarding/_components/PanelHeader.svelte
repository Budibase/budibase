<script>
  import FontAwesomeIcon from "components/common/FontAwesomeIcon.svelte"
  import { Heading, Body } from "@budibase/bbui"

  export let onBack = null
  export let title = ""
  export let subtitle = ""
</script>

<div class="header">
  <img
    alt="Budibase Logo"
    class="budibaseLogo"
    src={"https://i.imgur.com/Xhdt1YP.png"}
  />
  <div class="headingAndBack">
    {#if onBack}
      <button on:click={onBack}>
        <FontAwesomeIcon name="fa-solid fa-chevron-left" />
      </button>
    {/if}
    <Heading>{title}</Heading>
  </div>
  <Body>{subtitle}</Body>
</div>

<style>
  .header {
    margin-bottom: 20px;
  }

  .budibaseLogo {
    width: 42px;
    margin-bottom: 20px;
  }

  .headingAndBack {
    display: flex;
    margin-bottom: 13px;
  }

  button {
    background-color: transparent;
    border: none;
    color: white;
    padding-right: 18px;
    cursor: pointer;
  }
</style>
