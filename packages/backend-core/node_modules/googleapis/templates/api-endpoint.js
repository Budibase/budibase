/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint maxlen: false */

'use strict';

var createAPIRequest = require('../../lib/apirequest');
var utils = require('../../lib/utils');

{% set Name = name|capitalize %}
{% set Version = version|replace('\.', '_')|capitalize %}
{% set Namespace = [Name, Version]|join('') %}

/**
 * {{ title }}
 *
 * {{ description }}
 *
 * @example
 * var google = require('googleapis');
 * var {{ name }} = google.{{ name }}('{{ version }}');
 *
 * @namespace {{ name }}
 * @type {Function}
 * @version {{ version }}
 * @variation {{ version }}
 * @param {object=} options Options for {{ Name }}
 */
function {{ Name }} (options) { // eslint-disable-line
  var self = this;
  self._options = options || {};

{% if methods %}
  {% set globalmethods = true %}
  {% for mname, m in methods %}
    {% include "./method-partial.js" with m %}
  {% endfor -%}
{%- endif -%}

{% if resources %}
{% set globalmethods = false %}
{% for rname, r in resources %}
{% set ResourceNamespace = [Name, rname]|join('.') %}
  self.{{ rname }} = {
    {% include "./resource-partial.js" with r %}
  };
{%- endfor -%}
{%- endif -%}
}

{% set lb = "{" %}
{% set rb = "}" %}

{% for schemaName, schema in schemas %}
/**
 * @typedef {{ schema.id }}
 * @memberOf! {{ name }}({{ version }})
 * @type {{ schema.type }}
{% if schema.properties -%}
{%- for pname, p in schema.properties -%}
{%- if p.$ref -%}
 * @property {{ lb }}{{ name }}({{ version }}).{{ p.$ref }}{{ rb }} {{ pname }} {{ p.description | cleanPaths }}
{%- elif p.items and p.items.type -%}
 * @property {{ lb }}{{ p.items.type }}[]{{ rb }} {{ pname }} {{ p.description | cleanPaths }}
{%- elif p.items and p.items.$ref -%}
 * @property {{ lb }}{{ name }}({{ version }}).{{ p.items.$ref }}[]{{ rb }} {{ pname }} {{ p.description | cleanPaths }}
{%- else -%}
 * @property {{ lb }}{{ p.type }}{{ rb }} {{ pname }} {{ p.description | cleanPaths }}
{%- endif -%}
{%- endfor -%}
{%- endif -%}
 */

{%- endfor -%}

module.exports = {{ Name }};
