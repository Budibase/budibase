<script>
  export let heading
</script>

<li role="presentation">
  <span class="spectrum-Menu-sectionHeading">{heading}</span>
  <ul class="spectrum-Menu" role="group">
    <slot />
  </ul>
</li>
