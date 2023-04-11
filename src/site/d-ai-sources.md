---
title: D AI Sources
permalink: /d-ai-sources
---
sources= [
    {%- for post in collections.hash-post -%}get_dai_data("https://dai-global-developments.com/post-api/{{ post.data.title | slugify }}.json"){%- unless forloop.last -%},{%- endunless -%}
    {% endfor %}
]