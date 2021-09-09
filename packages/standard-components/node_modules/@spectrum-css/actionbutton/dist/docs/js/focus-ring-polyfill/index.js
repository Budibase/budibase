/**
 *  Copyright 2018 Adobe. All rights reserved.
 *  This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License. You may obtain a copy
 *  of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under
 *  the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *  OF ANY KIND, either express or implied. See the License for the specific language
 *  governing permissions and limitations under the License.
 */

// Provides explicit indication of elements receiving focus through keyboard interaction rather than mouse or touch.
(function(doc) {
  // In case file is imported in SSR context, don't polyfill anything
  if (!doc) {
    return;
  }

  var NAVIGATION_KEYS = [
    'Tab',
    'ArrowUp',
    'ArrowRight',
    'ArrowDown',
    'ArrowLeft',
    'Home',
    'End',
    'PageUp',
    'PageDown',
    'Enter',
    ' ',
    'Escape',

    /* IE9 and Firefox < 37 */
    'Up',
    'Right',
    'Down',
    'Left',
    'Esc'
  ];
  var TEXT_INPUT_TYPES = [
    'text',
    'date',
    'datetime-local',
    'email',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'time',
    'url',
    'week'
  ];
  var keyboardFocus = false;
  var elements = doc.getElementsByClassName('focus-ring');

  function onKeydownHandler(event) {
    if (event.ctrlKey || event.altKey || event.metaKey || NAVIGATION_KEYS.indexOf(event.key) === -1) {
      return;
    }
    keyboardFocus = true;

    if (doc.activeElement &&
        doc.activeElement !== doc.body &&
        doc.activeElement.tagName !== 'TEXTAREA' &&
        !(doc.activeElement.tagName === 'INPUT' &&
          TEXT_INPUT_TYPES.indexOf(doc.activeElement.type) !== -1)) {
      doc.activeElement.classList.add('focus-ring');
    }
  }

  function onMousedownHandler() {
    keyboardFocus = false;

    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove('focus-ring');
    }

  }

  function onFocusHandler(event) {
    var classList = event.target.classList;
    if (classList && keyboardFocus) {
      classList.add('focus-ring');
    }
  }

  function onBlurHandler(event) {
    var classList = event.target.classList;
    classList && classList.remove('focus-ring');
  }

  doc.addEventListener('keydown', onKeydownHandler, true);
  doc.addEventListener('mousedown', onMousedownHandler, true);
  doc.addEventListener('focus', onFocusHandler, true);
  doc.addEventListener('blur', onBlurHandler, true);
})(typeof window === "undefined" ? undefined : document);
