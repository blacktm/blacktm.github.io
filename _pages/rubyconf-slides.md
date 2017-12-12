---
title: RubyConf 2017 Slides
style: slides
---

<link rel="stylesheet" href="/assets/css/progressive-image.min.css">
<script src="/assets/js/progressive-image.min.js"></script>

<a href="/" class="back">← home</a>

<section class="center">
  {% for slide in site.data.rubyconf_2017_slides %}
  <article class="cf pb4 bb bw2 b--black-10">
    <div class="fl w-50-ns w-100-m">
      <a href="/assets/rubyconf/{% increment slide_number %}.png" class="progressive replace">
        <img src="/assets/rubyconf/tiny.png" class="preview" alt="image" />
      </a>
    </div>
    <div class="fl w-50-ns w-100-m">
      <p class="ma0 pa3 f4">
        {{ slide.caption }}
      </p>
    </div>
  </article>
  {% endfor %}
</section>
