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
window.addEventListener('load', function() {
  var markupExample = document.querySelector('.markup-example');
  var toast = document.querySelector('.notification-toast');

  var toastTimeout;
  function showToast() {
    toast.style.visibility = 'visible';
    requestAnimationFrame(function() {
      toast.style.opacity = 1;
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(function() {
        hideToast();
      }, 2000);
    });
  }

  function hideToast() {
    toast.style.opacity = 0;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      toast.style.visibility = 'hidden';
    }, 500);
  }

  window.addEventListener('click', function(event) {
    var icon = event.target.closest('.spectrum-Icon');
    if (icon) {
      var iconMarkup = icon.outerHTML.replace(/^ +/gm, '');
      iconMarkup = iconMarkup.replace('<use', '  <use');
      iconMarkup = iconMarkup.replace(' xmlns:xlink="http://www.w3.org/1999/xlink"', '');
      markupExample.value = iconMarkup;

      try {
        markupExample.select();
        document.execCommand('copy');
        markupExample.blur();

        showToast();
      }
      catch(error) {
        console.error('Could not copy code to clipboard: ' + error);
      }
    }
  });
});
