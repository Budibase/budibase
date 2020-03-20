import { MDCRipple } from "@material/ripple"

export default function ripple(
  node,
  props = { colour: "primary", unbounded: true }
) {
  node.classList.add("mdc-ripple-surface")
  let component = new MDCRipple(node)
  component.unbounded = props.unbounded

  if (props.colour === "secondary") {
    node.classList.remove("mdc-ripple-surface--primary")
    node.classList.add("mdc-ripple-surface--accent")
  } else {
    node.classList.add("mdc-ripple-surface--primary")
    node.classList.remove("mdc-ripple-surface--accent")
  }

  return {
    destroy() {
      component.destroy()
      node.classList.remove("mdc-ripple-surface")
      node.classList.remove("mdc-ripple-surface--primary")
      node.classList.remove("mdc-ripple-surface--accent")
      component = null
    },
  }
}
