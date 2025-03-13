<script lang="ts">
  export let heading: string
</script>

<li role="presentation">
  <span class="spectrum-Menu-sectionHeading">{heading}</span>
  <ul class="spectrum-Menu" role="group">
    <slot />
  </ul>
</li>
