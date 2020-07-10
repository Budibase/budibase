export default function(node) {
  function handleMouseDown() {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    node.dispatchEvent(new CustomEvent("dragstart"))
  }

  function handleMouseMove(event) {
    node.dispatchEvent(
      new CustomEvent("drag", {
        detail: { mouseX: event.clientX, mouseY: event.clientY },
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
