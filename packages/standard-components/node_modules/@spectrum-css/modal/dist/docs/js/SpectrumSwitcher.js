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

function SpectrumSwitcher(options) {
  options = options || {};

  this._theme = options.theme || 'light';
  this._scale = options.scale || 'medium';
  this._direction = options.direction || 'ltr';
  this._callback = options.callback || null;

  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
      let property;
      let value;
      if (value = SpectrumSwitcher.ThemeKeys[event.key]) {
        property = 'theme';
      }
      else if (value = SpectrumSwitcher.ScaleKeys[event.key]) {
        property = 'scale';
      }
      else if (value = SpectrumSwitcher.DirectionKeys[event.key]) {
        property = 'direction';
      }

      this[property] = value;

      if (this._callback) {
        this._callback({
          property: property,
          value: value
        });
      }
    }
  }.bind(this));
}

SpectrumSwitcher.Scales = [
  'medium',
  'large'
];

SpectrumSwitcher.ColorStops = [
  'lightest',
  'light',
  'dark',
  'darkest'
];

SpectrumSwitcher.Direction = [
  'ltr',
  'rtl'
];

SpectrumSwitcher.ThemeKeys = {
  '1': 'lightest',
  '2': 'light',
  '3': 'dark',
  '4': 'darkest',
};

SpectrumSwitcher.ScaleKeys = {
  'm': 'medium',
  'l': 'large'
};

SpectrumSwitcher.DirectionKeys = {
  'r': 'rtl',
  'n': 'ltr'
};

Object.defineProperty(SpectrumSwitcher.prototype, 'theme', {
  set: function(theme) {
    SpectrumSwitcher.ColorStops.forEach(function(otherTheme) {
      document.documentElement.classList.remove('spectrum--' + otherTheme);
    });
    document.documentElement.classList.add('spectrum--' + theme);

    let prismLink = document.querySelector('[data-prism]');
    let prismDarkLink = document.querySelector('[data-prism-dark]');
    if (theme === 'dark' || theme === 'darkest') {
      if (prismLink) {
        if (!prismDarkLink) {
          prismDarkLink = document.createElement('link');
          prismDarkLink.setAttribute('rel', 'stylesheet');
          prismDarkLink.setAttribute('data-prism-dark', '');
          prismDarkLink.setAttribute('type', 'text/css');
          prismDarkLink.setAttribute('href', 'css/prism/prism-dark.css');
        }

        prismLink.parentElement.insertBefore(prismDarkLink, prismLink.nextElementSibling);
      }
    }
    else {
      if (prismDarkLink) {
        prismDarkLink.parentElement.removeChild(prismDarkLink);
      }
    }

    this._theme = theme;
  },
  get: function() {
    return this._theme;
  }
});

Object.defineProperty(SpectrumSwitcher.prototype, 'scale', {
  set: function(scale) {
    SpectrumSwitcher.Scales.forEach(function(otherScale) {
      document.documentElement.classList.remove('spectrum--' + otherScale);
    });
    document.documentElement.classList.add('spectrum--' + scale);

    this._scale = scale;
  },
  get: function() {
    return this._scale;
  }
});

Object.defineProperty(SpectrumSwitcher.prototype, 'direction', {
  set: function(direction) {
    document.documentElement.setAttribute('dir', direction);

    this._direction = direction;
  },
  get: function() {
    return this._direction;
  }
});
