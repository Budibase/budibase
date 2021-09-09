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
/* global Typekit, document */
/* jshint -W033,-W116 */
window.addEventListener('DOMContentLoaded', function() {
  "use strict"

  var config = {
    /* REPEAT AFTER ME:
     I WILL NOT REUSE THE ADOBE FONTS ID FOR SPECTRUM-CSS DOCS IN MY PRODUCT / PRODUCTION
     I WILL NOT REUSE THE ADOBE FONTS ID FOR SPECTRUM-CSS DOCS IN MY PRODUCT / PRODUCTION
     I WILL NOT REUSE THE ADOBE FONTS ID FOR SPECTRUM-CSS DOCS IN MY PRODUCT / PRODUCTION
     See https://wiki.corp.adobe.com/display/devrel/Using+Typekit+at+Adobe to get set up right. */
     // On pageload, determine to current pages language setting.
     // If it is US-language or unset use the 1st Adobe font web project id (smaller size),
     // otherwise use the 2nd kit with all the language settings (larger size)
    // kitId: document.querySelector('[lang]:not([lang="en-US"])') !== null ? 'pbi5ojv' : 'ruf7eed',
    kitId: document.querySelector('[lang]:not([lang="en-US"])') === null ? 'mge7bvf' : 'rok6rmo',
    scriptTimeout: 3000,
    active: function() {
      var loader = document.getElementById('loader');
      if (loader) {
        setTimeout(function() {
          // Hide the loader
          loader.style.display = 'none';
        }, 125);
      }
    }
  };

  if (!window.Typekit) { // we load the typescript only once
    var h = document.getElementsByTagName("html")[0];
    h.className += " wf-loading";
    var t = setTimeout(function() {
      h.className = h.className.replace(/(\s|^)wf-loading(\s|$)/g, " ");
      h.className += " wf-inactive";
    }, config.scriptTimeout);
    var tk = document.createElement("script"),
      d = false;

    // Always load over https
    tk.src = 'https://use.typekit.net/' + config.kitId + '.js'
    tk.type = "text/javascript";
    tk.async = "true";
    tk.onload = tk.onreadystatechange = function() {
      var a = this.readyState;
      if (d || a && a !== "complete" && a !== "loaded") {
        return;
      }
      d = true;
      clearTimeout(t);
      try {
        Typekit.load(config);
      } catch (b) {}
    };
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(tk, s);
  }
});
