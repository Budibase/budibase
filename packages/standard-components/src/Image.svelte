<script>
  export let className = ""
  export let url = ""
  export let description = ""
  export let height
  export let width

  export let _bb
</script>

<img {height} {width} class={className} src={url} alt={description} />
