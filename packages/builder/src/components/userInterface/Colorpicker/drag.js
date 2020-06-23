export default function(node) {
  function handleMouseDown() {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }

  function handleMouseMove(event) {
    let mouseX = event.clientX
    node.dispatchEvent(
      new CustomEvent("drag", {
        detail: mouseX,
      })
    )
  }

  function handleMouseUp() {
    window.removeEventListener("mousedown", handleMouseDown)
    window.removeEventListener("mousemove", handleMouseMove)
    node.dispatchEvent(new CustomEvent("dragend"))
  }

  node.addEventListener("mousedown", handleMouseDown)
}
