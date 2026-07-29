---
title: RubyConf 2017 Slides
style: slides
---

<section class="mx-auto">
  {% for slide in site.data.rubyconf_2017_slides %}
  <article class="lg:flex pb-8 border-b border-white/20">
    <div class="lg:w-1/2">
      <a href="/assets/rubyconf/{{ forloop.index0 }}.png">
        <img src="/assets/rubyconf/{{ forloop.index0 }}.png" class="w-full h-auto"
             width="1600" height="900" decoding="async" alt=""
             {% if forloop.first %}fetchpriority="high"{% else %}loading="lazy"{% endif %}>
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
