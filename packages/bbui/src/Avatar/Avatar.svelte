<script lang="ts">
  import "@spectrum-css/avatar/dist/index-vars.css"

  type AvatarSize = "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL"

  let sizes = new Map<AvatarSize, string>([
    ["XXS", "--spectrum-alias-avatar-size-50"],
    ["XS", "--spectrum-alias-avatar-size-75"],
    ["S", "--spectrum-alias-avatar-size-200"],
    ["M", "--spectrum-alias-avatar-size-400"],
    ["L", "--spectrum-alias-avatar-size-500"],
    ["XL", "--spectrum-alias-avatar-size-600"],
    ["XXL", "--spectrum-alias-avatar-size-700"],
  ])
  export let size: AvatarSize = "M"
  export let url: string = ""
  export let disabled: boolean = false
  export let initials: string = "JD"
  export let color: string = ""

  const defaultColor = "#3aab87"

  let avatarColor: string
  let style: string

  $: avatarColor = color || getColor(initials)
  $: style = getStyle(size, avatarColor)

  const getColor = (initials: string): string => {
    if (!initials?.length) {
      return defaultColor
    }
    const code = initials[0].toLowerCase().charCodeAt(0)
    const hue = ((code % 26) / 26) * 360
    return `hsl(${hue}, 50%, 50%)`
  }

  const getStyle = (sizeKey: AvatarSize, color: string): string => {
    const sizeValue = sizes.get(sizeKey)
    if (!sizeValue) {
      return `background:${color};`
    }
    const size = `var(${sizeValue})`
    const fontSize = `calc(${size} / 2)`
    return `width:${size}; height:${size}; font-size:${fontSize}; background:${color};`
  }
</script>

{#if url}
  <img
    class:is-disabled={disabled}
    class="spectrum-Avatar"
    src={url}
    alt="Avatar"
    style="width: var({sizes.get(size)}); height: var({sizes.get(size)});"
  />
{:else}
  <div class="spectrum-Avatar" class:is-disabled={disabled} {style}>
    {initials || ""}
  </div>
{/if}

<style>
  div {
    color: white;
    display: grid;
    place-items: center;
    font-weight: 600;
    border-radius: 50%;
    overflow: hidden;
    user-select: none;
    text-transform: uppercase;
    flex-shrink: 0;
  }
</style>
