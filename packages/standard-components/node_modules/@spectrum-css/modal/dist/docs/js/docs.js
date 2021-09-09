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
/* eslint-disable no-unused-vars */
/* global document, window, loadIcons */

'use strict';

loadIcons('../components/icon/spectrum-css-icons.svg');
loadIcons('img/spectrum-icons.svg');

// Show and hide code samples
function toggleMarkupVisibility(event) {
  event.preventDefault();
  var exampleMarkup = event.target.closest('.spectrum-CSSExample-markup');
  var style = window.getComputedStyle(exampleMarkup);
  var isOpen = exampleMarkup.classList.contains('is-open');
  event.target.innerHTML = isOpen ? 'Show markup' : 'Hide markup';
  exampleMarkup.classList.toggle('is-open');
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('js-markup-toggle')) {
    toggleMarkupVisibility(event);
  }
});
