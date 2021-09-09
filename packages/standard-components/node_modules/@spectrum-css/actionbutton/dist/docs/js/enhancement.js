/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// Rating
(function() {
  function setFocus(rating, focused) {
    rating.classList[focused ? 'add' : 'remove']('is-focused');
  }

  function setValue(rating, value) {
    var input = rating.querySelector('.spectrum-Rating-input');
    input.value = value;
    Array.prototype.forEach.call(rating.querySelectorAll('.spectrum-Rating-icon'), function(el, index) {
      el.classList[index <= value - 1 ? 'add' : 'remove']('is-selected');
      el.classList[index === value - 1 ? 'add' : 'remove']('is-currentValue');
    });
  }

  document.addEventListener('focusin', function(event) {
    var rating = event.target.closest('.spectrum-Rating');

    if (rating) {
      setFocus(rating, true);
    }
  });

  document.addEventListener('focusout', function(event) {
    var rating = event.target.closest('.spectrum-Rating');

    if (rating) {
      setFocus(rating, false);
    }
  });

  document.addEventListener('change', function(event) {
    var input = event.target.closest('.spectrum-Rating-input');
    if (input) {
      if (input.hasAttribute('readonly')) {
        event.preventDefault();
        input.value = event.defaultValue;
      } else {
        var value = parseInt(input.value, 10);
        var rating = event.target.closest('.spectrum-Rating');
        setValue(rating, value);
      }
    }
  });

  document.addEventListener('click', function(event) {
    var icon = event.target.closest('.spectrum-Rating-icon');
    if (icon) {
      var rating = event.target.closest('.spectrum-Rating');
      var value = Array.prototype.indexOf.call(rating.querySelectorAll('.spectrum-Rating-icon'), icon) + 1;
      setValue(rating, value);
    }
  });
}());

// Textfield
(function() {
  function setFocus(textfield, input, focused) {
    var focusClass = input.classList.contains('focus-ring') ? 'is-keyboardFocused' : 'is-focused';
    if (focused) {
      textfield.classList.add(focusClass);
    } else {
      textfield.classList.remove('is-keyboardFocused');
      textfield.classList.remove('is-focused');
    }
  }

  document.addEventListener('focusin', function(event) {
    var textfield = event.target.closest('.spectrum-Textfield');

    if (textfield) {
      setFocus(textfield, event.target, true);
    }
  });

  document.addEventListener('focusout', function(event) {
    var textfield = event.target.closest('.spectrum-Textfield');

    if (textfield) {
      setFocus(textfield, event.target, false);
    }
  });
}());

// Inputgroup
(function() {
  function setFocus(inputgroup, input, focused) {
    var focusClass = input.classList.contains('focus-ring') ? 'is-keyboardFocused' : 'is-focused';
    if (focused) {
      inputgroup.classList.add(focusClass);
    } else {
      inputgroup.classList.remove('is-keyboardFocused');
      inputgroup.classList.remove('is-focused');
    }
  }

  document.addEventListener('focusin', function(event) {
    var inputgroup = event.target.closest('.spectrum-InputGroup');

    if (inputgroup) {
      setFocus(inputgroup, event.target, true);
    }
  });

  document.addEventListener('focusout', function(event) {
    var inputgroup = event.target.closest('.spectrum-InputGroup');

    if (inputgroup) {
      setFocus(inputgroup, event.target, false);
    }
  });
}());

// Stepper
(function() {
  function setFocus(stepper, input, focused) {
    var focusClass = input.classList.contains('focus-ring') ? 'is-keyboardFocused' : 'is-focused';
    if (focused) {
      stepper.classList.add(focusClass);
    } else {
      stepper.classList.remove('is-keyboardFocused');
      stepper.classList.remove('is-focused');
    }
  }

  document.addEventListener('focusin', function(event) {
    var stepper = event.target.closest('.spectrum-Stepper');

    if (stepper) {
      setFocus(stepper, event.target, true);
    }
  });

  document.addEventListener('focusout', function(event) {
    var stepper = event.target.closest('.spectrum-Stepper');

    if (stepper) {
      setFocus(stepper, event.target, false);
    }
  });
}());

// Picker
(function() {
  var openPicker = null;

  function toggleOpen(picker, force) {
    var isOpen = force !== undefined ? force : !picker.classList.contains('is-open');
    var popover = getPopoverForPicker(picker);

    picker[isOpen ? 'setAttribute' : 'removeAttribute']('aria-expanded', 'true');
    picker.classList[isOpen ? 'add' : 'remove']('is-open');
    picker.classList[isOpen ? 'add' : 'remove']('is-selected');

    if (popover) {
      popover.style.zIndex = 1;
      var rect = picker.getBoundingClientRect();
      popover.style.top = rect.bottom + 'px';
      popover.classList[isOpen ? 'add' : 'remove']('is-open');
      popover.querySelector('.spectrum-Menu-item').focus();
    }

    if (isOpen) {
      if (openPicker && openPicker !== picker) {
        toggleOpen(openPicker, false);
      }
      openPicker = picker;
    }
  }

  function closeAndFocusPicker(picker) {
    if (picker) {
      toggleOpen(picker, false);
      picker.focus();
    }
  }

  window.addEventListener('keydown', function(event) {
    var menuItem = event.target.closest('.spectrum-Menu-item');
    if (menuItem) {
      var menu = menuItem.closest('.spectrum-Menu');
      if (menuItem.classList.contains('spectrum-Menu-item')) {
        var items = Array.prototype.slice.call(menu.querySelectorAll('.spectrum-Menu-item:not(.is-disabled)'));
        var menuItemIndex = items.indexOf(menuItem);
        var newItemIndex = -1;
        if (event.key === 'ArrowDown') {
          newItemIndex = menuItemIndex + 1 < items.length ? menuItemIndex + 1 : 0;
        } else if (event.key === 'ArrowUp') {
          newItemIndex = menuItemIndex - 1 >= 0 ? menuItemIndex - 1 : items.length - 1;
        } else if (event.key === 'Home') {
          newItemIndex = 0;
        } else if (event.key === 'End') {
          newItemIndex = items.length - 1;
        } else if (event.key === 'Escape') {
          var picker = event.target.closest('.spectrum-Picker');
          closeAndFocusPicker(picker);
        } else if (event.key === 'Enter') {
          handleMenuChange(menu, menuItem);

          closeAndFocusPicker(getPickerForMenu(menu));
          event.preventDefault();
        }
        if (newItemIndex !== -1) {
          items[newItemIndex].focus();

          // Don't scroll the list
          event.preventDefault();
        }
      }
    } else {
      if (event.key === 'ArrowDown') {
        var picker = event.target.closest('.spectrum-Picker');
        if (picker) {
          toggleOpen(picker, true);
        }
      }
    }
  });

  function setPickerValue(picker, value, label) {
    var menu = picker.nextElementSibling.querySelector('.spectrum-Menu');
    var menuItem = menu.querySelector('.spectrum-Menu-item[value="' + value + '"]');

    if (menuItem) {
      var selectedMenuItem = menu.querySelector('.spectrum-Menu-item.is-selected');
      if (selectedMenuItem) {
        selectedMenuItem.classList.remove('is-selected');
        selectedMenuItem.removeAttribute('aria-selected');
      }

      menuItem.classList.add('is-selected');
      menuItem.setAttribute('aria-selected', 'true');

      if (!label) {
        var menuLabel = menuItem.querySelector('.spectrum-Menu-itemLabel');
        if (menuLabel) {
          label = menuLabel.innerHTML;
        }
      }
    }

    picker.setAttribute('value', value);
    var fieldButton = picker;
    if (fieldButton && label) {
      var pickerLabel = fieldButton.querySelector('.spectrum-Picker-label');
      if (pickerLabel) {
        pickerLabel.innerHTML = label;
      }
    }

    var event = new CustomEvent('change', {
      bubbles: true,
      detail: {
        label: label,
        value: value
      }
    });

    picker.dispatchEvent(event);
  }

  function getPickerForMenu(menuOrMenuItem) {
    var popover = menuOrMenuItem.closest('.spectrum-Popover');
    return popover && popover.previousElementSibling && popover.previousElementSibling.matches('.spectrum-Picker') ? popover.previousElementSibling : null;
  }

  function getPopoverForPicker(picker) {
    return picker && picker.nextElementSibling && picker.nextElementSibling.matches('.spectrum-Popover') ? picker.nextElementSibling : null;
  }

  function handleMenuChange(menu, menuItem) {
    var value = menuItem.getAttribute('value');
    var menuLabel = menuItem.querySelector('.spectrum-Menu-itemLabel');
    var label = menuLabel.innerHTML;

    var picker = getPickerForMenu(menu);
    if (picker) {
      toggleOpen(picker, false);
      setPickerValue(picker, value, label);
    }
  }

  window.addEventListener('click', function(event) {
    var menu = event.target.closest('.spectrum-Menu');

    var picker = event.target.closest('.spectrum-Picker');
    if (picker) {
      toggleOpen(picker);
    }
    else if (menu) {
      var popover = menu.closest('.spectrum-Popover');
      picker = popover.previousElementSibling && popover.previousElementSibling.matches('.spectrum-Picker') ? popover.previousElementSibling : null;

      var menuItem = event.target.closest('.spectrum-Menu-item');
      if (menuItem) {
        var menuLabel = menuItem.querySelector('.spectrum-Menu-itemLabel');
        if (menuLabel) {
          var pickerLabel = picker.querySelector('.spectrum-Picker-label');
          if (pickerLabel) {
            pickerLabel.innerHTML = menuLabel.innerHTML;

            event.stopPropagation();
            handleMenuChange(menuItem.parentElement, menuItem);
          }
        }
      }
    }
    else {
      if (openPicker) {
        toggleOpen(openPicker, false);
      }
    }
  });

  window.setPickerValue = setPickerValue;
}());

// Treeview
function furthest(el, selector) {
  var lastMatch = null;
  while (el) {
    if (el.matches && el.matches(selector)) {
      lastMatch = el;
    }
    el = el.parentNode;
  }
  return lastMatch;
}

window.addEventListener('click', function(event) {
  var treeviewItem = event.target.closest('.spectrum-TreeView-item');
  if (!treeviewItem) {
    return;
  }

  var isDisabled = treeviewItem.classList.contains('is-disabled');
  if (isDisabled) {
    return;
  }

  var el;

  if ((el = event.target.closest('.spectrum-TreeView-itemIndicator')) !== null) {
    treeviewItem.classList.toggle('is-open');
    event.preventDefault();
  } else if ((el = event.target.closest('.spectrum-TreeView-itemLink')) !== null) {
    if (!(event.shiftKey || event.metaKey)) {
      // Remove other selected items
      let outerTreeview = furthest(el, '.spectrum-TreeView');
      if (outerTreeview) {
        Array.prototype.forEach.call(outerTreeview.querySelectorAll('.spectrum-TreeView-item.is-selected'), function(item) {
          if (item != treeviewItem) {
            item.classList.remove('is-selected');

            var thumbnail = item.querySelector('.spectrum-TreeView-itemThumbnail');
            if (thumbnail) {
              thumbnail.classList.remove('is-focused');
            }
          }
        });
      }
    }
    let selected = treeviewItem.classList.toggle('is-selected');

    var thumbnail = treeviewItem.querySelector('.spectrum-TreeView-itemThumbnail');
    if (thumbnail) {
      thumbnail.classList[selected ? 'add' : 'remove']('is-focused');
    }
    event.preventDefault();
  }
});

// Accordion
window.addEventListener('click', function(event) {
  let heading = event.target.closest('.spectrum-Accordion-itemHeading');
  if (heading) {
    let item = event.target.closest('.spectrum-Accordion-item');
    let isDisabled = item.classList.contains('is-disabled');
    if (!isDisabled) {
      item.classList.toggle('is-open');
      event.preventDefault();
    }
  }
});

// Cyclebutton
window.addEventListener('click', function(event) {
  var button = event.target.closest('.spectrum-CycleButton');
  if (button) {
    var icons = button.querySelectorAll('.spectrum-Icon');
    var currentIcon = button.querySelector('.spectrum-Icon.is-selected');
    var currentIconIndex = Array.prototype.slice.call(icons).indexOf(currentIcon);
    if (currentIcon) {
      currentIcon.classList.remove('is-selected');

      var newIndex = currentIconIndex + 1 < icons.length ? currentIconIndex + 1 : 0;
      icons[newIndex].classList.add('is-selected');
    }
  }
});

// Display InputGroup focus style
function toggleInputGroupFocus(event) {
  var classList = event.target.classList;
  var closestSelector;
  // target within InputGroup
  if (classList.contains('spectrum-InputGroup-input') ||
    classList.contains('spectrum-ActionButton spectrum-ActionButton--sizeM')) {
    closestSelector = '.spectrum-InputGroup';
  }
  // target within a Slider
  else if (classList.contains('spectrum-Slider-input')) {
    closestSelector = '.spectrum-Slider-handle';
  } else {
    return;
  }
  var func = event.type === 'focus' ? 'add' : 'remove';
  var closestElement = event.target.closest(closestSelector);
  if (closestElement) {
    closestElement.classList[func]('is-focused');
  }
}

document.addEventListener('focus', toggleInputGroupFocus, true);
document.addEventListener('blur', toggleInputGroupFocus, true);

function isRTL() {
  return document.documentElement.getAttribute('dir') === 'rtl';
}

function toggleRTL(left, right) {
  return isRTL() ? right : left;
}

// Sliders
function makeDoubleSlider(slider) {
  var tracks = slider.querySelectorAll('.spectrum-Slider-track');
  var leftTrack = tracks[0];
  var middleTrack = tracks[1];
  var rightTrack = tracks[2];
  var handles = slider.querySelectorAll('.spectrum-Slider-handle');
  var leftHandle = handles[0];
  var rightHandle = handles[1];

  var handle = null;
  function onMouseDown(e, sliderHandle) {
    if (e.target.classList.contains('spectrum-Slider-handle')) {
      handle = e.target;
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      document.body.classList.add('u-isGrabbing');
    }
  }
  function onMouseUp(e, sliderHandle) {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    document.body.classList.remove('u-isGrabbing');
    handle = null;
  }
  function onMouseMove(e, sliderHandle) {
    if (!handle) {
      return;
    }

    var sliderOffsetWidth = slider.offsetWidth;
    var sliderOffsetLeft = slider.offsetLeft + slider.offsetParent.offsetLeft;

    var x = Math.max(Math.min(e.x - sliderOffsetLeft, sliderOffsetWidth), 0);
    var percent = (x / sliderOffsetWidth) * 100;

    if (isRTL()) {
      percent = 100 - percent;
    }

    if (handle === leftHandle) {
      if (percent < parseFloat(rightHandle.style[toggleRTL('left', 'right')])) {
        handle.style[toggleRTL('left', 'right')] = percent + '%';
        handle.style[toggleRTL('right', 'left')] = 'auto';
        leftTrack.style.width = percent + '%';
      }
    } else {
      if (percent > parseFloat(leftHandle.style[toggleRTL('left', 'right')])) {
        handle.style[toggleRTL('left', 'right')] = percent + '%';
        handle.style[toggleRTL('right', 'left')] = 'auto';
        rightTrack.style.width = (100 - percent) + '%';
      }
    }
    middleTrack.style[toggleRTL('left', 'right')] = leftHandle.style[toggleRTL('left', 'right')];
    middleTrack.style[toggleRTL('right', 'left')] = (100 - parseFloat(rightHandle.style[toggleRTL('left', 'right')])) + '%';
  }

  function init() {
    if (isRTL()) {
      leftHandle.style.right = leftHandle.style.left;
      leftHandle.style.left = leftHandle.style.right;
      rightHandle.style.right = rightHandle.style.left;
      rightHandle.style.left = rightHandle.style.right;
    }

    // Set initial track position
    var startPercent = parseFloat(leftHandle.style[toggleRTL('left', 'right')]);
    var endPercent = parseFloat(rightHandle.style[toggleRTL('left', 'right')]);
    leftTrack.style.width = startPercent + '%';
    middleTrack.style[toggleRTL('left', 'right')] = startPercent + '%';
    middleTrack.style[toggleRTL('right', 'left')] = (100 - endPercent) + '%';
    rightTrack.style.width = (100 - endPercent) + '%';

    if (!slider.classList.contains('is-disabled')) {
      slider.addEventListener('mousedown', onMouseDown);
    }
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === "dir") {
        init();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true //configure it to listen to attribute changes
  });

  init();
}

function makeSlider(slider) {
  var tracks = slider.querySelectorAll('.spectrum-Slider-track');
  var leftTrack = tracks[0];
  var rightTrack = tracks[1];
  var handles = slider.querySelectorAll('.spectrum-Slider-handle');
  var handle = handles[0];
  var isColor = slider.classList.contains('spectrum-Slider--color');
  var fill = slider.querySelector('.spectrum-Slider-fill');

  if (handles.length > 1) {
    makeDoubleSlider(slider);
    return;
  }

  var buffers = slider.querySelectorAll('.spectrum-Slider-buffer');
  if (buffers.length) {
    var leftBuffer = buffers[0];
    var rightBuffer = buffers[1];
    var bufferedAmount = parseInt(handle.style[toggleRTL('left', 'right')], 10) + parseInt(rightBuffer.style.width, 10);
  }

  function onMouseDown(e, sliderHandle) {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    handle.classList.add('is-dragged');
    // to move by merely clicking on the track
    onMouseMove(e);
  }
  function onMouseUp(e, sliderHandle) {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    handle.classList.remove('is-dragged');
  }
  function onMouseMove(e, sliderHandle) {
    var sliderOffsetWidth = slider.offsetWidth;
    var sliderOffsetLeft = slider.offsetLeft + slider.offsetParent.offsetLeft;

    var x = Math.max(Math.min(e.x - sliderOffsetLeft, sliderOffsetWidth), 0);
    var percent = (x / sliderOffsetWidth) * 100;

    if (isRTL()) {
      percent = 100 - percent;
    }

    if (leftTrack && rightTrack && !isColor) {
      leftTrack.style.width = percent + '%';
      rightTrack.style.width = (100 - percent) + '%';
    }

    handle.style[toggleRTL('left', 'right')] = percent + '%';
    handle.style[toggleRTL('right', 'left')] = 'auto';

    if (buffers.length) {
      if (percent >= bufferedAmount) {
        // Hide the right buffer
        rightBuffer.style.width = 0;
        rightBuffer.style.left = 'auto';
        rightBuffer.style.right = 'auto';

        // This disgusting calculation takes into account the pretty gap
        var bufferStyle = window.getComputedStyle(leftBuffer);
        var handleGap = parseInt(bufferStyle[toggleRTL('paddingRight', 'paddingLeft')], 10);
        var handlePosition = toggleRTL(handle.offsetLeft, handle.parentElement.offsetWidth - handle.offsetLeft) + handle.offsetWidth / 2;
        var bufferMaxWidth = handlePosition;

        // The left buffer is offset by the gap and some margin, so we have to add that back to make it actually hit the desired value
        var bufferOffset = parseInt(bufferStyle[toggleRTL('marginLeft', 'marginRight')], 10) * -1;
        var actualMiddle = handle.parentElement.offsetWidth / 2 + bufferOffset + handleGap;

        // Keep the left buffer to account for the nasty gaps
        leftBuffer.style.width = Math.min(bufferMaxWidth, actualMiddle) + 'px';
      } else {
        leftBuffer.style.width = percent + '%';
        rightBuffer.style.width = 'auto';
        rightBuffer.style[toggleRTL('left', 'right')] = percent + '%';
        rightBuffer.style[toggleRTL('right', 'left')] = (100 - bufferedAmount) + '%';
      }
    }

    if (fill) {
      fill.style[toggleRTL('left', 'right')] = (percent < 50 ? percent : 50) + '%';
      fill.style.width = (percent < 50 ? 50 - percent : percent - 50) + '%';
      if (percent > 50) {
        fill.classList.add('spectrum-Slider-fill--right');
      } else {
        fill.classList.remove('spectrum-Slider-fill--right');
      }
    }
  }
  function init() {
    if (isRTL()) {
      handle.style.right = handle.style.left;
      handle.style.left = handle.style.right;
      if (fill) {
        fill.style.right = fill.style.left;
        fill.style.left = fill.style.right;
      }

      if (buffers.length) {
        var oldRightRight = rightBuffer.style.right;
        rightBuffer.style.right = rightBuffer.style.left;
        rightBuffer.style.left = oldRightRight;
        var oldLeftRight = leftBuffer.style.right;
        leftBuffer.style.right = leftBuffer.style.left;
        leftBuffer.style.left = oldLeftRight;
      }

      if (tracks.length) {
        // Flip colors
        if (tracks[0].style.background) {
          tracks[0].style.background = tracks[0].style.background.replace('right', 'left');
        }
      }
    }

    // Set initial track position
    var percent = parseInt(handle.style[toggleRTL('left', 'right')], 10);
    if (leftTrack && rightTrack && !isColor) {
      leftTrack.style.width = percent + '%';
      rightTrack.style.width = (100 - percent) + '%';
    }

    if (!slider.classList.contains('is-disabled')) {
      slider.addEventListener('mousedown', onMouseDown);
    }
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === "dir") {
        init();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true //configure it to listen to attribute changes
  });

  init();
}

function makeDial(dial) {
  var dialOffsetWidth = dial.offsetWidth;
  var dialOffsetLeft = dial.offsetLeft + dial.offsetParent.offsetLeft;
  var input = dial.querySelector('input');
  var handle = dial.querySelector('.spectrum-Dial-handle');
  var min = -45;
  var max = 225;
  function onMouseDown(e, sliderHandle) {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    document.body.classList.add('u-isGrabbing');
  }
  function onMouseUp(e, sliderHandle) {
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    document.body.classList.remove('u-isGrabbing');
  }
  function onMouseMove(e, sliderHandle) {
    var x = Math.max(Math.min(e.x - dialOffsetLeft, dialOffsetWidth), 0);
    var percent = (x / dialOffsetWidth) * 100;

    var deg = percent * 0.01 * (max - min) + min;
    handle.style.transform = 'rotate(' + deg + 'deg' + ')';
  }

  if (!dial.classList.contains('is-disabled')) {
    dial.addEventListener('mousedown', onMouseDown);
  }
}

function openDialog(dialog, withOverlay) {
  if (withOverlay !== false) {
    document.getElementById('spectrum-underlay').classList.add('is-open');
  }

  dialog.classList.add('is-open');

  // Support wrapped dialogs
  var innerDialog = dialog.querySelector('.spectrum-Modal');
  if (innerDialog) {
    innerDialog.classList.add('is-open');
  }
}

function closeDialog(dialog) {
  document.getElementById('spectrum-underlay').classList.remove('is-open');
  dialog.classList.remove('is-open');
  console.log(dialog);

  // Support wrapped dialogs
  var innerDialog = dialog.querySelector('.spectrum-Modal');
  if (innerDialog) {
    innerDialog.classList.remove('is-open');
  }

  setTimeout(function() {
    dialog.classList.remove('spectrum-CSSExample-dialog');
  }, 130);
}

function animateCircleLoaders() {
  var value = 0;
  setInterval(function() {
    var loaders = document.querySelectorAll('.spectrum-CircleLoader:not(spectrum-CircleLoader--indeterminate)');
    if (loaders.length) {
      changeLoaders(loaders, value++);
      if (value >= 100) {
        value = 0;
      }
    }
  }, 500);
}

function changeLoaders(nodeList, value) {
  Array.prototype.slice.call(nodeList).forEach(function(loader) {
    changeLoader(loader, value);
  });
}

function changeLoader(loader, value, submask1, submask2) {
  submask1 = submask1 || loader.querySelector('.spectrum-CircleLoader-fillSubMask1');
  submask2 = submask2 || loader.querySelector('.spectrum-CircleLoader-fillSubMask2');
  var angle;
  if (value > 0 && value <= 50) {
    angle = -180 + (value / 50 * 180);
    submask1.style.transform = 'rotate(' + angle + 'deg)';
    submask2.style.transform = 'rotate(-180deg)';
  } else if (value > 50) {
    angle = -180 + (value - 50) / 50 * 180;
    submask1.style.transform = 'rotate(0deg)';
    submask2.style.transform = 'rotate(' + angle + 'deg)';
  }
}

function enhanceAll() {
  Array.prototype.forEach.call(document.querySelectorAll('.spectrum-Slider'), function(slider) {
    makeSlider(slider);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.spectrum-Dial'), function(dial) {
    makeDial(dial);
  });
}

animateCircleLoaders();
window.addEventListener('PageFastLoaded', enhanceAll);
window.addEventListener('DOMContentLoaded', enhanceAll);
