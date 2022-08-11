{% if r.methods %}
{% for mname, m in methods -%}
  {% include "./method-partial.js" with m %}
{%- endfor -%}
{%- endif -%}{%- if r.methods && r.resources -%},{%- endif -%}

{% if r.resources %}
{%- for rname, r in resources %}

  {{ rname }}: {
    {%- include "./resource-partial.js" with r -%}
  }{%- if not loop.last -%},{%- endif -%}
{%- endfor -%}
{%- endif -%}
