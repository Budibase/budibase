<script>
  import "@spectrum-css/statuslight"

  export let size = "M"
  export let celery = false
  export let yellow = false
  export let fuchsia = false
  export let indigo = false
  export let seafoam = false
  export let chartreuse = false
  export let magenta = false
  export let purple = false
  export let neutral = false
  export let info = false
  export let positive = false
  export let notice = false
  export let negative = false
  export let disabled = false
  export let active = false
</script>

<div
  class="spectrum-StatusLight spectrum-StatusLight--size{size}"
  class:spectrum-StatusLight--celery={celery}
  class:spectrum-StatusLight--yellow={yellow}
  class:spectrum-StatusLight--fuchsia={fuchsia}
  class:spectrum-StatusLight--indigo={indigo}
  class:spectrum-StatusLight--seafoam={seafoam}
  class:spectrum-StatusLight--chartreuse={chartreuse}
  class:spectrum-StatusLight--magenta={magenta}
  class:spectrum-StatusLight--purple={purple}
  class:spectrum-StatusLight--neutral={neutral}
  class:spectrum-StatusLight--info={info}
  class:spectrum-StatusLight--positive={positive}
  class:spectrum-StatusLight--notice={notice}
  class:spectrum-StatusLight--negative={negative}
  class:spectrum-StatusLight--disabled={disabled}
  class:spectrum-StatusLight--active={active}
>
  <slot />
</div>
