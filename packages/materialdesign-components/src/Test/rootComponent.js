export const rootComponent = window => {
  return function(opts) {
    const node = window.document.createElement("DIV")
    const $set = props => {
      props._bb.hydrateChildren(node)
    }
    const $destroy = () => {
      if (opts.target && node) opts.target.removeChild(node)
    }
    this.$set = $set
    this.$set(opts.props)
    this.$destroy = $destroy
    opts.target.appendChild(node)
  }
}
