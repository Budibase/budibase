<script>
  import RecordCard from "./RecordCard.svelte"

  export let record = {}
</script>

<div class="root">
  <div class="title">{record.name}</div>
  <div class="inner">
    <div class="node-path">{record.nodeKey()}</div>
  </div>
</div>

<style>

</style>
