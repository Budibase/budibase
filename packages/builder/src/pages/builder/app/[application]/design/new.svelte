<script lang="ts">
  import { onMount } from "svelte"
  import NewScreen from "./_components/NewScreen/index.svelte"

  let newScreenModal: NewScreen

  onMount(() => {
    newScreenModal.open()
  })
</script>

<div class="new-screen-picker">
  <NewScreen bind:this={newScreenModal} inline submitOnClick />
</div>

<style>
  .new-screen-picker {
    display: flex;
    justify-content: center;
    flex: 1 1 auto;
    padding-top: 40px;
  }

  .new-screen-picker :global(.spectrum-Modal) {
    border: none;
    background: none;
  }
</style>
