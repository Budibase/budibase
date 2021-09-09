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
/* global document, Element */

'use strict';

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    var ancestor = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (ancestor.matches(s)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return null;
  };
}

if (typeof window.CustomEvent !== 'function') {
  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

(function() {
  // IE 11 compat
  let stops = [
    'light',
    'lightest',
    'dark',
    'darkest'
  ];

  function makeCompatibleLinks(link) {
    let component = link.getAttribute('data-dependency');

    let links = [
      createLink('../components/' + component + '/index.css', component),
      createLink('../components/' + component + '/index-diff.css', component),
    ];

    if (component !== 'icons') {
      links = links.concat(stops.map(function(stop) {
        return createLink('../components/' + component + '/multiStops/' + stop + '.css', component);
      }));
    }

    links.forEach(insertLink.bind(this, link));

    // Remove the replaced link
    link.parentNode.removeChild(link);
  }

  function createLink(href, component) {
    let link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.setAttribute('data-dependency', component);
    return link;
  }

  function insertLink(where, link) {
    console.log('  Inserting new link: ' + link.href.substr(link.href.lastIndexOf('components/')));
    where.parentNode.insertBefore(link, where);
  }

  function convertVarsToMultistops(root) {
    // Read in each link tag with index-vars.css
    let links = root.querySelectorAll('[data-dependency]');

    // Replace with index.css + index-diff.css + multiStops/*.css
    Array.prototype.slice.call(links).forEach(function(link) {
      console.log('🔗 Found link ' + link.getAttribute('data-dependency'));
      makeCompatibleLinks(link);
    });
  }

  // Only run for browsers that don't support CSS custom properties
  if (!window.CSS || !CSS.supports('color', 'var(--primary)')) {
    convertVarsToMultistops(document);
    window.fastLoadDisabled = true;
  }

  // Expose for manual testing
  window.testMultistops = function() {
    convertVarsToMultistops(document);
  };
}());
