/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// UMD pattern via umdjs
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  }
  else if (typeof module === 'object' && module.exports) {
    // CommonJS-like
    module.exports = factory();
  }
  else {
    // Browser
    root.loadIcons = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  function handleError(string) {
    string = 'loadIcons: '+string;
    var error = new Error(string);

    console.error(error.toString());

    if (typeof callback === 'function') {
      callback(error);
    }
  }

  function injectSVG(svgURL, callback) {
    var error;
    // 200 for web servers, 0 for CEP panels
    if (this.status !== 200 && this.status !== 0) {
      handleError('Failed to fetch icons, server returned ' + this.status);
      return;
    }

    // Parse the SVG
    var parser = new DOMParser();
    try {
      var doc = parser.parseFromString(this.responseText, 'image/svg+xml');
      var svg = doc.firstChild;
    }
    catch (err) {
      handleError('Error parsing SVG: ' + err);
      return;
    }

    // Make sure a real SVG was returned
    if (svg && svg.tagName === 'svg') {
      // Hide the element
      svg.style.display = 'none';

      svg.setAttribute('data-url', svgURL);

      // Insert it into the head
      document.head.insertBefore(svg, null);

      // Pass the SVG to the callback
      if (typeof callback === 'function') {
        callback(null, svg);
      }
    }
    else {
      handleError('Parsed SVG document contained something other than an SVG');
    }
  }

  function loadIcons(svgURL, callback) {
    // Request the SVG sprite
    var req = new XMLHttpRequest();
    req.open('GET', svgURL, true);
    req.addEventListener('load', injectSVG.bind(req, svgURL, callback));
    req.addEventListener('error', function(event) {
      handleError('Request failed');
    });
    req.send();
  }

  return loadIcons;
}));
