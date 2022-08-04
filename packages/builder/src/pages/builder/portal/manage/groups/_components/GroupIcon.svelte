<script>
  import { Icon } from "@budibase/bbui"

  export let group
</script>

<div style="background: {group?.color};" class="circle">
  <Icon size="S" name={group?.icon} />
</div>

<style>
  .circle {
    border-radius: 50%;
    height: 30px;
    width: 30px;
    color: white;
    display: grid;
    place-items: center;
  }
</style>
