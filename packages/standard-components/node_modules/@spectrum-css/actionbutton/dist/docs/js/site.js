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
/* global document, window, Element, loadIcons, URLSearchParams */

window.addEventListener('DOMContentLoaded', function() {
  // Navigation
  function selectNavItem(href) {
    var selectedNavItem = document.querySelector('.spectrum-SideNav-item.is-selected')
    if (selectedNavItem) {
      selectedNavItem.classList.remove('is-selected');
    }

    var navLink = document.querySelector('[href="' + href + '"]');
    if (navLink && navLink.parentNode.classList.contains('spectrum-SideNav-item')) {
      var navItem = navLink.parentNode;
      navItem.classList.add('is-selected');
    }
  }

  function loadPage(href) {
    console.log('⚡️ Fast-loading ' + href);

    function handleLoad() {
      var template;
      var newMainContainer;

      function handleLinkOnload(dependencyName, event) {
        console.log('    ✅ ' + dependencyName + ' loaded...');
        loadingDependencies.splice(loadingDependencies.indexOf(dependencyName), 1);

        if (loadingDependencies.length === 0) {
          changeContent();
        }
      }

      function changeContent() {
        // Change title
        document.querySelector('title').innerHTML = template.content.querySelector('title').innerHTML;

        // Change content
        var oldMainContainer = document.querySelector('.spectrum-Site-mainContainer');
        oldMainContainer.parentNode.insertBefore(newMainContainer, oldMainContainer);
        oldMainContainer.parentNode.removeChild(oldMainContainer);

        // Execute JS
        var scripts = newMainContainer.querySelectorAll('script');
        scripts.forEach(function(script) {
          eval(script.innerText);
        });

        currentHREF = href;

        console.log('  ✅ ' + href + ' loaded');

        var event = new Event('PageFastLoaded', {
          detail: {
            href: href
          }
        });
        window.dispatchEvent(event);
      }

      if (req.status === 200) {
        template = document.createElement('template');
        template.innerHTML = this.responseText;

        newMainContainer = template.content.querySelector('.spectrum-Site-mainContainer');

        if (newMainContainer) {
          // Load in extra deps before last link
          var currentDependenciesNodeList = document.querySelectorAll('[data-dependency]');
          var currentDependencies = Array.prototype.slice.call(currentDependenciesNodeList).map(function(link) {
            return link.getAttribute('data-dependency');
          });

          var newDependencies = Array.prototype.slice.call(template.content.querySelectorAll('[data-dependency]')).filter(function(link) {
            return currentDependencies.indexOf(link.getAttribute('data-dependency')) === -1;
          });

          if (newDependencies.length) {
            var loadingDependencies = Array.prototype.slice.call(newDependencies).map(function(link) {
              return link.getAttribute('data-dependency');
            });

            console.log('  ⏳ Loading ' + loadingDependencies.length + ' new dependencies...');

            var beforeLink = currentDependenciesNodeList[currentDependenciesNodeList.length - 1];
            newDependencies.forEach(function(link) {
              link.onload = handleLinkOnload.bind(link, link.getAttribute('data-dependency'));
              document.head.insertBefore(link, beforeLink.nextElementSibling);
              beforeLink = link;
            });
          }
          else {
            changeContent();
          }
        }
        else {
          console.error('Could not find main container within loaded HTML file');
          handleError('Content not found', 'The page loaded successfully, but doesn\'t contain documentation content.', 204);
        }
      }
      else {
        handleError();
      }
    }

    function handleError(text, message, statusCode) {
      var mainContainer = document.querySelector('.spectrum-Site-mainContainer');
      statusCode = statusCode || req.status;
      text = text || req.statusText;
      message = message || 'An error occurred loading ' + href;
      if (req.status === 404) {
        message = 'This page isn\'t available. Try checking the URL or visit a different page.';
      }
      let title = 'Error' + (statusCode ? ' ' + statusCode : '') + ': ' + text;
      mainContainer.innerHTML = '\
<div class="spectrum-IllustratedMessage">\
  <svg class="spectrum-IllustratedMessage-illustration" xmlns="http://www.w3.org/2000/svg" width="200" height="98" viewBox="0 0 199 97.7"><defs><style>.cls-1,.cls-2{fill:none;stroke-linecap:round;stroke-linejoin:round;}.cls-1{stroke-width:3px;}.cls-2{stroke-width:2px;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="illustrations"><path class="cls-1" d="M110.53,85.66,100.26,95.89a1.09,1.09,0,0,1-1.52,0L88.47,85.66"/><line class="cls-1" x1="99.5" y1="95.5" x2="99.5" y2="58.5"/><path class="cls-1" d="M105.5,73.5h19a2,2,0,0,0,2-2v-43"/><path class="cls-1" d="M126.5,22.5h-19a2,2,0,0,1-2-2V1.5h-31a2,2,0,0,0-2,2v68a2,2,0,0,0,2,2h19"/><line class="cls-1" x1="105.5" y1="1.5" x2="126.5" y2="22.5"/><path class="cls-2" d="M47.93,50.49a5,5,0,1,0-4.83-5A4.93,4.93,0,0,0,47.93,50.49Z"/><path class="cls-2" d="M36.6,65.93,42.05,60A2.06,2.06,0,0,1,45,60l12.68,13.2"/><path class="cls-2" d="M3.14,73.23,22.42,53.76a1.65,1.65,0,0,1,2.38,0l19.05,19.7"/><path class="cls-1" d="M139.5,36.5H196A1.49,1.49,0,0,1,197.5,38V72A1.49,1.49,0,0,1,196,73.5H141A1.49,1.49,0,0,1,139.5,72V32A1.49,1.49,0,0,1,141,30.5H154a2.43,2.43,0,0,1,1.67.66l6,5.66"/><rect class="cls-1" x="1.5" y="34.5" width="58" height="39" rx="2" ry="2"/></g></g></svg>\
  <h2 class="spectrum-Heading spectrum-Heading--pageTitle spectrum-IllustratedMessage-heading">' + title + '</h2>\
  <p class="spectrum-Body--secondary spectrum-IllustratedMessage-description">' + message + '</p>\
</div>\
';
      document.querySelector('title').innerHTML = title;
    }

    var req = new XMLHttpRequest();
    req.addEventListener('load', handleLoad);
    req.addEventListener('error', function(event) {
      handleError('Request Failed', event.statusText);
    });
    req.open('GET', './' + href);
    req.send();
  }

  function navigate(href) {
    window.history.pushState({}, '', href);

    selectNavItem(href);

    loadPage(href);
  }

  function getHREF() {
    return window.location.pathname.split('/').pop();
  }

  let currentHREF = getHREF();
  window.addEventListener('popstate', function(event) {
    var href = getHREF();

    if (href !== currentHREF) {
      selectNavItem(href);

      loadPage(href);
    }
  });

  document.addEventListener('click', function(event) {
    if (window.fastLoadDisabled) {
      return;
    }

    var target = event.target.closest('a');
    if (target && target.classList.contains('js-fastLoad')) {
      navigate(target.getAttribute('href'));
      hideSideBar();
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Switcher
  var switcher = new SpectrumSwitcher({
    callback: function(event) {
      switch (event.property) {
        case 'scale':
          setPickerValue(scalePicker, event.value);
          break;
        case 'theme':
          setPickerValue(themePicker, event.value);
          break;
        case 'direction':
          setPickerValue(directionPicker, event.value);
          break;
      }
    }
  });

  // Sidebar
  var sideBar = document.querySelector('#site-sidebar');
  var overlay = document.querySelector('#site-overlay');
  var scaleMQL = window.matchMedia('(max-width: 768px)');
  function handleScaleMQLChange() {
    if (scaleMQL.matches) {
      switcher.scale = 'large';
    }
    else {
      switcher.scale = 'medium';
    }
    if (scalePicker) {
      setPickerValue(scalePicker, switcher.scale);
    }
  }
  scaleMQL.addListener(handleScaleMQLChange);

  document.body.addEventListener('change', function(event) {
    if (event.target.id === 'switcher-scale') {
      switcher.scale = event.detail.value;
    }
    else if (event.target.id === 'switcher-theme') {
      switcher.theme = event.detail.value;
    }
    else if (event.target.id === 'switcher-direction') {
      switcher.direction = event.detail.value;
    }
  });

  let scalePicker = document.querySelector('#switcher-scale');
  let themePicker = document.querySelector('#switcher-theme');
  let directionPicker = document.querySelector('#switcher-direction');
  window.addEventListener('PageFastLoaded', function updateScalePickers() {
    scalePicker = document.querySelector('#switcher-scale');
    themePicker = document.querySelector('#switcher-theme');
    directionPicker = document.querySelector('#switcher-direction');
    if (scalePicker) {
      setPickerValue(scalePicker, switcher.scale);
    }
    if (themePicker) {
      setPickerValue(themePicker, switcher.theme);
    }
    if (directionPicker) {
      setPickerValue(directionPicker, switcher.direction);
    }
  });

  var sidebarMQL = window.matchMedia('(max-width: 960px)');
  function handleSidebarMQLChange() {
    if (!sidebarMQL.matches) {
      // Get rid of the overlay if we resize while the sidebar is open
      hideSideBar();
    }
  }
  sidebarMQL.addListener(handleSidebarMQLChange);

  handleScaleMQLChange();
  handleSidebarMQLChange();

  function showSideBar() {
    if (sidebarMQL.matches) {
      overlay.addEventListener('click', hideSideBar);
      sideBar.classList.add('is-open');
      overlay.classList.add('is-open');
    }
  }

  function hideSideBar() {
    overlay.removeEventListener('click', hideSideBar);
    overlay.classList.remove('is-open');
    if (sideBar) {
      sideBar.classList.remove('is-open');
    }
    if (window.siteSearch) {
      window.siteSearch.hideResults();
    }
  }

  document.querySelector('#site-menu').addEventListener('click', function(event) {
    if (sideBar.classList.contains('is-open')) {
      hideSideBar();
    }
    else {
      showSideBar();
    }
  });

  // Search isn't supported on IE 11 and sideBar will not be exist in test mode
  if (typeof Search !== 'undefined' && document.querySelector('#site-search')) {
    window.siteSearch = new Search(document.querySelector('#site-search'))
  }

  window.addEventListener('SearchFocused', function() {
    showSideBar();

    // Immediately hide results, otherwise they show up in the wrong position since we're in the middle of animation
    siteSearch.hideResults();
  });
});
