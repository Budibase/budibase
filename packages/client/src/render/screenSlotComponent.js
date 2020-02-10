export const screenSlotComponent = window => {
  return function(opts) {
    const node = window.document.createElement("DIV")
    const $set = props => {
      props._bb.hydrateChildren(props._children, node)
    }
    const $destroy = () => {
      if (opts.target && node) opts.target.removeChild(node)
    }
    this.$set = $set
    this.$destroy = $destroy
    opts.target.appendChild(node)
  }
}
