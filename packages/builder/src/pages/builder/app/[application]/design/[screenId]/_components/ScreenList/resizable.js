
export const getVerticalResizeActions = (initialValue, setValue = () => {}) => {
  let element = null;

  const elementAction = (node) => {
    element = node;

    if (initialValue != null) {
      element.style.height = `${initialValue}px`
    }

    return {
      destroy() {
        element = null;
      }
    }
  }

  const dragHandleAction = (node) => {
    let startHeight = null;
    let startPosition = null;

    const handleMouseMove = (e) => {
      const change = e.pageY - startPosition;
      element.style.height = `${startHeight + change}px`
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      element.style.removeProperty('transition'); // remove temporary transition override
      setValue(element.clientHeight);
    }

    const handleMouseDown = (e) => {
      if (e.detail > 1) {
        // e.detail is the number of rapid clicks, so e.detail = 2 is 
        // a double click. We want to prevent default behaviour in 
        // this case as it highlights nearby selectable elements, which
        // then interferes with the resizing mousemove.
        // Putting this on the double click handler doesn't seem to 
        // work, so it must go here.
        e.preventDefault();
      }

      if (e.target.hasAttribute("disabled") && e.target.getAttribute("disabled") !== "false") {
        return;
      }

      element.style.transition = "height 0ms"; // temporarily override any height transitions
      startHeight = element.clientHeight;
      startPosition = e.pageY;

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleDoubleClick = (e) => {
      element.style.removeProperty("height");
    }

    node.addEventListener("mousedown", handleMouseDown);
    node.addEventListener("dblclick", handleDoubleClick);

    return {
      destroy() {
        node.removeEventListener("mousedown", handleMouseDown);
        node.removeEventListener("dblclick", handleDoubleClick);
      }
    }
  }

  return [
    elementAction,
    dragHandleAction
  ]
};
