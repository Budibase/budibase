export const screenSlotComponent = window => {
  return function(opts) {
    const node = window.document.createElement("DIV")
    const $set = props => {
      props._bb.initialiseChildren(node)
    }
    const $destroy = () => {
      if (opts.target && node) opts.target.removeChild(node)
    }
    this.$set = $set
    this.$destroy = $destroy
    opts.target.appendChild(node)
  }
}
