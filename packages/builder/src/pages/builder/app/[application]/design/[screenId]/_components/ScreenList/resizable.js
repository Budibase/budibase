export const getHorizontalResizeActions = (initialValue, setValue = () => {}) => {
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
    let startWidth = null;
    let startPosition = null;

    const handleMouseMove = (e) => {
      const change = e.pageX - startPosition;
      element.style.width = `${startWidth + change}px`
    }

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      element.style.removeProperty('transition'); // remove temporary transition override
      setValue(element.clientHeight);
    }

    const handleMouseDown = (e) => {
      if (e.target.hasAttribute("disabled") && e.target.getAttribute("disabled") !== "false") {
        return;
      }

      element.style.transition = "width 0ms"; // temporarily override any width transitions
      startWidth = element.clientWidth;
      startPosition = e.pageX;

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    node.addEventListener("mousedown", handleMouseDown);

    return {
      destroy() {
        node.removeEventListener("mousedown", handleMouseDown);
      }
    }
  }

  return [
    elementAction,
    dragHandleAction
  ]
};

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
      if (e.target.hasAttribute("disabled") && e.target.getAttribute("disabled") !== "false") {
        return;
      }

      element.style.transition = "height 0ms"; // temporarily override any height transitions
      startHeight = element.clientHeight;
      startPosition = e.pageY;

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    node.addEventListener("mousedown", handleMouseDown);

    return {
      destroy() {
        node.removeEventListener("mousedown", handleMouseDown);
      }
    }
  }

  return [
    elementAction,
    dragHandleAction
  ]
};
