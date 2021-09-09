/**
 * Detect Element Resize
 *
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * version: 0.5.3
 **/

;(function() {
  function resetTriggers(element) {
    var triggers = element.__resizeTriggers__,
      expand = triggers.firstElementChild,
      contract = triggers.lastElementChild,
      expandChild = expand ? expand.firstElementChild : null
    if (contract) {
      contract.scrollLeft = contract.scrollWidth
      contract.scrollTop = contract.scrollHeight
    }
    if (expandChild) {
      expandChild.style.width = expand.offsetWidth + 1 + 'px'
      expandChild.style.height = expand.offsetHeight + 1 + 'px'
    }
    if (expand) {
      expand.scrollLeft = expand.scrollWidth
      expand.scrollTop = expand.scrollHeight
    }
  }

  function checkTriggers(element) {
    return (
      element.offsetWidth != element.__resizeLast__.width ||
      element.offsetHeight != element.__resizeLast__.height
    )
  }

  function scrollListener(e) {
    var element = this
    resetTriggers(this)
    if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__)
    this.__resizeRAF__ = requestFrame(function() {
      if (checkTriggers(element)) {
        element.__resizeLast__.width = element.offsetWidth
        element.__resizeLast__.height = element.offsetHeight
        element.__resizeListeners__.forEach(function(fn) {
          fn.call(e)
        })
      }
    })
  }

  var requestFrame = (function() {
    var raf =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      function(fn) {
        return window.setTimeout(fn, 20)
      }
    return function(fn) {
      return raf(fn)
    }
  })()

  var cancelFrame = (function() {
    var cancel =
      window.cancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.clearTimeout
    return function(id) {
      return cancel(id)
    }
  })()

  /* Detect CSS Animations support to detect element display/re-attach */
  var animation = false,
    animationstartevent = 'animationstart',
    domPrefixes = 'Webkit Moz O ms'.split(' '),
    startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(
      ' '
    )
  {
    var elm = document.createElement('fakeelement')
    if (elm.style.animationName !== undefined) {
      animation = true
    }

    if (animation === false) {
      for (var i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
          animationstartevent = startEvents[i]
          break
        }
      }
    }
  }

  var animationName = 'resizeanim'

  window.addResizeListener = function(element, fn) {
    if (!element.__resizeTriggers__) {
      if (getComputedStyle(element).position == 'static')
        element.style.position = 'relative'

      element.__resizeLast__ = {}
      element.__resizeListeners__ = []
      ;(element.__resizeTriggers__ = document.createElement('div')).className =
        'resize-triggers'
      element.__resizeTriggers__.innerHTML =
        '<div class="expand-trigger"><div></div></div>' +
        '<div class="contract-trigger"></div>'
      element.appendChild(element.__resizeTriggers__)
      resetTriggers(element)
      element.addEventListener('scroll', scrollListener, true)

      /* Listen for a css animation to detect element display/re-attach */
      animationstartevent &&
        element.__resizeTriggers__.addEventListener(
          animationstartevent,
          function(e) {
            if (e.animationName == animationName) {
              resetTriggers(element)
            }
          }
        )
    }
    element.__resizeListeners__.push(fn)
  }

  window.removeResizeListener = function(element, fn) {
    if (element) {
      element.__resizeListeners__.splice(
        element.__resizeListeners__.indexOf(fn),
        1
      )
      if (!element.__resizeListeners__.length) {
        element.removeEventListener('scroll', scrollListener)
        if (element.__resizeTriggers__.parentNode) {
          element.__resizeTriggers__ = !element.removeChild(
            element.__resizeTriggers__
          )
        }
      }
    }
  }
})()
