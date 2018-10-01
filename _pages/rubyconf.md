---
title: RubyConf 2017
style: slides
---

# RubyConf 2017

Welcome! Below is my talk from RubyConf 2017, ["Reimagining 2D graphics and game development with Ruby"](http://rubyconf.org/program#session-189), presented on November 15th, 2017. It's hard to hear due to audio issues, but you can jump to the slides and notes just below the video. Want to get right to making 2D apps? Check out [Ruby 2D](http://www.ruby2d.com)! If you're interested in contributing, we'd love to have you [get involved](https://github.com/ruby2d/ruby2d#contribute) with the project.

<div class="tc pt3 pb4 bb bw2 b--black-10">
  <iframe class="w-100" style="max-width:640px; height:360px" src="https://www.youtube.com/embed/-PPVypAS_Pc" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
</div>

## Slides, notes, and links

<link rel="stylesheet" href="/assets/css/progressive-image.min.css">
<script src="/assets/js/progressive-image.min.js"></script>

<section class="center">
  {% for slide in site.data.rubyconf_2017_slides %}
  <article id="slide-{% increment slide_num %}" class="cf pb4 bb bw2 b--black-10">
    <div class="fl-ns w-50-ns w-100-m">
      <a href="/assets/rubyconf/{{ slide_num | minus: 1 }}.png" class="progressive replace">
        <img src="/assets/rubyconf/tiny.png" class="preview">
      </a>
    </div>
    <div class="fl w-50-ns w-100-m">
      <p class="ma0 pa3 pt1-l f4" markdown="1">
        {{ slide.caption }}
      </p>
    </div>
  </article>
  {% endfor %}
</section>

## Code samples

### macOS `NSWindow`

To create a native window on macOS using [`NSWindow`](https://developer.apple.com/documentation/appkit/nswindow), first make a file named `window.m` with the following:

```objc
#import <Cocoa/Cocoa.h>

int main() {

  NSUInteger windowStyle = NSWindowStyleMaskTitled | NSWindowStyleMaskClosable |
                           NSWindowStyleMaskMiniaturizable | NSWindowStyleMaskResizable;

  NSWindow *window = [[NSWindow alloc] initWithContentRect:NSMakeRect(500, 400, 200, 150)
                                       styleMask:windowStyle
                                       backing:NSBackingStoreBuffered
                                       defer:NO];

  [window setBackgroundColor: NSColor.blackColor];

  [window orderFrontRegardless];
  [NSApp run];

  return 0;
}
```

Then, compile and run it in the terminal using:

```
cc window.m -framework Cocoa -o window
./window
```

☝️ [Back to slide](#slide-19)

### Create a window with SDL

To create a window with SDL, first make a file named `hello_sdl.c`:

```c
#include <SDL2/SDL.h>

int main() {

  SDL_Init(SDL_INIT_VIDEO);

  SDL_Window *window = SDL_CreateWindow(
    "Hello SDL!",
    SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
    250, 200,
    SDL_WINDOW_OPENGL
  );

  SDL_Event event;
  int quit = 0;

  while (!quit) {
    while (SDL_PollEvent(&event)) {
      if (event.type == SDL_QUIT) {
        quit = 1;
      }
    }
    SDL_Delay(10);
  }

  SDL_DestroyWindow(window);
  SDL_Quit();
  return 0;
}
```

Then, compile and run it in the terminal using:

```
cc hello_sdl.c -lSDL2 -o hello_sdl
./hello_sdl
```

☝️ [Back to slide](#slide-28)

### Native extension for MRI and mruby

Here, we define some common functions and data types that will work across MRI _and_ mruby, which begin with an `R_` or `r_` prefix. Notice when the gem is initialized, a module is defined using `r_define_module`, then a class within it using `r_define_class`, and finally a defined for the class using `r_define_method`.

```c
#if MRUBY
  #define R_CLASS  struct RClass *
  #define r_define_module(name)  mrb_module_get(mrb, name)
  #define r_define_class(module, name)  mrb_class_get_under(mrb, module, name)
  #define r_define_method(class, name, function, args)  mrb_define_method(mrb, class, name, function, args)
  #define r_args_none  (MRB_ARGS_NONE())
#else
  #define R_CLASS  R_VAL
  #define r_define_module(name)  rb_define_module(name)
  #define r_define_class(module, name)  rb_define_class_under(module, name, rb_cObject)
  #define r_define_method(class, name, function, args)  rb_define_method(class, name, function, args)
  #define r_args_none  0
#endif


#if MRUBY
// MRuby entry point
int main() {
  mrb = mrb_open();
#else
// Ruby C extension init
void Init_gem() {
#endif

  // Graphics
  R_CLASS module = r_define_module("Graphics");

  // Graphics::Quad
  R_CLASS quad_class = r_define_class(module, "Quad");

  // Graphics::Quad#render
  r_define_method(quad_class, "render", quad_render, r_args_none);

#if MRUBY
  mrb_close(mrb);
  return 0;
#endif
}
```

The method we defined is named `render`, which when called will execute the C function `quad_render`, defined below (notice it calls the Simple 2D function `S2D_DrawQuad`).

```c
#if MRUBY
  #define R_VAL  mrb_value
  #define R_NIL  (mrb_nil_value())
  #define r_iv_get(self, var)  mrb_iv_get(mrb, self, mrb_intern_lit(mrb, var))
#else
  #define R_VAL  VALUE
  #define R_NIL  Qnil
  #define r_iv_get(self, var)  rb_iv_get(self, var)
#endif


#if MRUBY
static R_VAL quad_render(mrb_state* mrb, R_VAL self) {
#else
static R_VAL quad_render(R_VAL self) {
#endif
  R_VAL c1 = r_iv_get(self, "@c1");
  R_VAL c2 = r_iv_get(self, "@c2");
  R_VAL c3 = r_iv_get(self, "@c3");
  R_VAL c4 = r_iv_get(self, "@c4");

  S2D_DrawQuad(
    NUM2DBL(r_iv_get(self, "@x1")),
    NUM2DBL(r_iv_get(self, "@y1")),
    NUM2DBL(r_iv_get(c1, "@r")),
    NUM2DBL(r_iv_get(c1, "@g")),
    NUM2DBL(r_iv_get(c1, "@b")),
    NUM2DBL(r_iv_get(c1, "@a")),
    // and so on...
  );

  return R_NIL;
```

☝️ [Back to slide](#slide-60)

### Web extension for Opal

This is what get's generated by Opal.

```js
/* Generated by Opal 0.10.5 */
(function(Opal) {
  var $a, $b, self = Opal.top, $scope = Opal, nil = Opal.nil, $breaker = Opal.breaker, $slice = Opal.slice, s = nil;
  Opal.add_stubs(['$new', '$x=', '$y=', '$color=']);
  s = $scope.get('Square').$new();
  $a = [50, 50], s['$x=']($a[0]), s['$y=']($a[1]), $a;
  return (($a = ["red"]), $b = s, $b['$color='].apply($b, $a), $a[$a.length-1]);
})(Opal);
```

Similar to the native extension, we'll define a module, class, and method. Our method will execute a JavaScript snippet, which we can put right inline with the Ruby code and wrap with backticks. Normally backticks, the <code>`</code> character, are reserved in Ruby to run a system command in the shell. Since the browser doesn't have a system shell (sort of), instead backticks are used to call JavaScript directly. This is really convenient — it's like a [foreign function interface](https://en.wikipedia.org/wiki/Foreign_function_interface) built right in!

Notice we're calling `S2D.DrawQuad`, which is provided by Simple2D.js, our port of the native Simple 2D.

```ruby
module Graphics
  class Quad
    def render
      `S2D.DrawQuad(
        #{self}.x1, #{self}.y1, #{self}.c1.r, #{self}.c1.g, #{self}.c1.b, #{self}.c1.a,
        #{self}.x2, #{self}.y2, #{self}.c2.r, #{self}.c2.g, #{self}.c2.b, #{self}.c2.a,
        #{self}.x3, #{self}.y3, #{self}.c3.r, #{self}.c3.g, #{self}.c3.b, #{self}.c3.a,
        #{self}.x4, #{self}.y4, #{self}.c4.r, #{self}.c4.g, #{self}.c4.b, #{self}.c4.a
      );`
    end
  end
end
```

☝️ [Back to slide](#slide-69)

## Prior Ruby game development talks

- [Building Games with Ruby](https://www.youtube.com/watch?v=_KCnl5EhcdA) — RubyConf 2007 (and [Ruby Hoedown 2007](https://www.youtube.com/watch?v=1IZMRrEhf_c)), Andrea O. K. Wright
- [Writing 2D Games for the OSX Platform in Ruby](https://www.youtube.com/watch?v=UESfvIoXo0M) — RubyConf 2009, Matt Aimonetti
- [Ruby Game Development with Jemini](https://www.youtube.com/watch?v=FCxBRf3lPe0) — RubyConf 2009, Logan Barnett and Jay McGavren
- [Game Development and Ruby](https://www.youtube.com/watch?v=H5_Kid3hpRs) — RubyConf 2012, Andrew Nordman
- [iOS Games with RubyMotion](https://www.youtube.com/watch?v=h6PfXWpANeI) — Baruco 2013, Brian Sam-Bodden
- [Rapid Game Prototyping with Ruby](https://www.youtube.com/watch?v=irMfy8I2OVQ) — RubyConf 2013 (and [Madison Ruby 2013](https://www.youtube.com/watch?v=Vo5OVEmSDtY)), Michael Fairley
- [Build your own Ruby-powered Arcade Machine!](https://www.youtube.com/watch?v=Cru9bq_xPQo) — RubyConf 2013, Andrew Havens
- [Writing Games with Ruby](https://www.youtube.com/watch?v=VawT9BQr3Wk) — Ruby on Ales 2014 (also [LA RubyConf 2014](https://www.youtube.com/watch?v=jJhbpY70miE) and [RubyConf 2010](https://www.youtube.com/watch?v=htyG_XdAglI)), Mike Moore
- [SkFun: SpriteKit And RubyMotion](https://www.youtube.com/watch?v=bj1hJS1lGdU) — RubyMotion #inspect 2014, Will Raxworthy
- [RubyMotion: Cross-Platform Mobile Development the Right Way](https://www.youtube.com/watch?v=ZV5zCXHIqNY) — RedDotRuby 2015, Laurent Sansonetti
- [Game Development The Ruby](https://www.youtube.com/watch?v=BqXU2JwMGBE) — ArrrrCamp 2015, Jain Rishi
- [Ruby for one day game programming camp for beginners](https://www.youtube.com/watch?v=bvXYCpcOQ3E) - RubyKaigi 2015, Ippei Obayashi
- [Game Development + Ruby = Happiness](https://www.youtube.com/watch?v=jfTM_0ezZuI) — RubyKaigi 2016, Amir Rajan
- [Attention Rubyists: you can write video games](https://www.youtube.com/watch?v=bK9RX_CzCeI) — RubyConf 2016, Cory Chamblin

☝️ [Back to slide](#slide-97)

## More cool things...

A great book about [Game Programming Patterns](http://gameprogrammingpatterns.com), a collection of patterns in games that make code cleaner, easier to understand, and faster.

Did you know, you can use [RubyMotion](http://www.rubymotion.com) and [SpriteKit](https://developer.apple.com/spritekit/) to [make iOS games](https://github.com/amirrajan/ios-ruby-game-dev)?!
