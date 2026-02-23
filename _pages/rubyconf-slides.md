---
title: RubyConf 2017 Slides
style: slides
---

<link rel="stylesheet" href="/assets/css/progressive-image.min.css">
<script src="/assets/js/progressive-image.min.js"></script>

<section class="mx-auto">
  {% for slide in site.data.rubyconf_2017_slides %}
  <article class="lg:flex pb-8 border-b-4 border-white/10">
    <div class="lg:w-1/2">
      <a href="/assets/rubyconf/{% increment slide_number %}.png" class="progressive replace">
        <img src="/assets/rubyconf/tiny.png" class="preview" alt="image" />
      </a>
    </div>
    <div class="lg:w-1/2">
      <p class="m-0 p-4 text-lg">
        {{ slide.caption }}
      </p>
    </div>
  </article>
  {% endfor %}
</section>
