import { fade, blur, slide, fly } from "svelte/transition"

// Default options
const transitions = new Map([
  ["fade", { tn: fade, opt: {} }],
  ["blur", { tn: blur, opt: {} }],
  // These two seem to not result in any effect
  // ["slide", { tn: slide, opt: {} }], 
  // ["scale", { tn: slide, opt: {} }],
  ["fly", { tn: fly, opt: { y: 80 } }],
])

export default function transition(node, { type, options = {} }) {
  const { tn, opt } = transitions.get(type) || {}
  return tn ? tn(node, { ...opt, ...options }) : fade(node, { duration: 0 })
}
