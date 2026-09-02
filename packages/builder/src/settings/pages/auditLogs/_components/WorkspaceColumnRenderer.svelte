<script lang="ts">
  interface Props {
    value?: { name?: string } | null
  }

  let { value }: Props = $props()
</script>

<div>{value?.name || ""}</div>
