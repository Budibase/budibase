import { fade, blur, scale, fly } from "svelte/transition"

// Default options
const transitions = new Map([
  ["fade", { tn: fade, opt: {} }],
  ["blur", { tn: blur, opt: {} }],
  // This one seems to not result in any effect
  // ["slide", { tn: slide, opt: {} }],
  ["scale", { tn: scale, opt: {} }],
  ["fly", { tn: fly, opt: { y: 80 } }],
])

export default function transition(node, { type, options = {} }) {
  const { tn, opt } = transitions.get(type) || { tn: () => {}, opt: {}}
  return tn(node, { ...opt, ...options })
}