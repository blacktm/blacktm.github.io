---
title: RubyConf 2017
layout: main
---

<a href="/" class="back">← home</a>

# RubyConf 2017

These are notes from [my RubyConf talk](http://rubyconf.org/program#session-189) (video should be posted soon). Enjoy!

Want to get right to making 2D apps in Ruby? Check out [Ruby 2D](http://www.ruby2d.com).

---

The original [Learn Ruby demo](https://www.youtube.com/watch?v=I9Aladc7H-c).

---

**Ruby graphics and game libraries** I learned from Some prior Ruby graphics efforts (the ones I new about when starting my research, oldest to newest): [Ruby/SDL](https://github.com/ohai/rubysdl), [rudl](https://github.com/matozoid/rudl), [RubyGame](https://github.com/rubygame/rubygame/), [ruby-opengl](https://github.com/drbrain/opengl), [Gosu](https://github.com/gosu/gosu), [Shoes](https://github.com/shoes/shoes4), [rbSFML](https://github.com/Groogy/rbSFML), [Ray](https://github.com/Mon-Ouie/ray), [Rubydraw](https://github.com/awostenberg/rubydraw), [spinel](https://github.com/cadwallion/spinel), [ruby-glfw3](https://github.com/nilium/ruby-glfw3), [dare](https://github.com/domgetter/dare), [RubyGL](https://github.com/GGist/RubyGL)

---

**Creating native windows** on macOS using [`NSWindow`](https://developer.apple.com/documentation/appkit/nswindow). Create a file named `window.m`:

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

Compile and run with:

```
cc window.m -framework Cocoa -o window
./window
```

---

**SDL**, or the Simple Direct-Media Layer, is a native libraries that helps us develop seamlessly across OSs and platforms with ease. Create a file named `hello_sdl.c`:

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

Compile and run with:

```
cc hello_sdl.c -lSDL2 -o hello_sdl
./hello_sdl
```

For more, watch [Ryan C. Gordon's](https://twitter.com/icculus) talk on [Game Development with SDL 2.0](https://www.youtube.com/watch?v=MeMPCSqQ-34&list=UUStZs-X5W6V3TFJLnwkzN5w)

---

**C is awesome!** Check out some of these resources: [The C Programming Language](https://en.wikipedia.org/wiki/The_C_Programming_Language), [21st Century C](http://shop.oreilly.com/product/0636920033677.do), [Learn to Code with C](https://www.raspberrypi.org/magpi/issues/essentials-c-v1/) (free book!)

---

**OpenGL and the rendering pipeline**. Read about [the pipeline](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview), and here's a good ["hello triangle" tutorial](https://developer.apple.com/documentation/metal/hello_triangle) by Apple on their similar graphics API called Metal. Pretty soon, you might feel [like this](https://twitter.com/floatvoid/status/863605150799118336). Also, we'll use an [orthographic projection](https://en.wikipedia.org/wiki/Orthographic_projection) here.

---

[**Simple 2D**](https://github.com/simple2d/simple2d), a little library to make native, cross-platform 2D graphics and media...simple!

---

**[MRuby](http://mruby.org), the small, lightweight implementation of Ruby.** We'll be using it to [compile Ruby](http://mruby.org/docs/articles/executing-ruby-code-with-mruby.html) into a C array containing the bytecode.

---

**Native extensions**. Here's the MRI (CRuby) and MRuby [native extension](https://github.com/ruby2d/ruby2d/blob/master/ext/ruby2d/ruby2d.c) we'll use to interact with Simple 2D.

---

[**Opal**](http://opalrb.com), Ruby in the browser, and the [web extension](https://github.com/ruby2d/ruby2d/blob/master/ext/ruby2d/ruby2d-opal.rb) we'll use to talk to [Simple2D.js](https://github.com/simple2d/simple2d.js) (the JavaScript port of the native Simple 2D).

[WebAssembly](http://webassembly.org) is also on the horizon. Maybe we can use it with MRuby...? 🤔

---

[**Ruby 2D**](http://www.ruby2d.com), a gem to make cross-platform 2D applications in Ruby.

Designing a new DSL for graphics and gaming is super fun. We can get inspiration from things like [HyperTalk](https://en.wikipedia.org/wiki/HyperTalk).

The Ruby 2D [test card app](https://github.com/ruby2d/ruby2d/blob/master/test/testcard.rb), and lots of [other tests](https://github.com/ruby2d/ruby2d/tree/master/test) (graphical, interactive and RSpec unit tests).

Ruby 2D will automatically find and connect to virtually any controller, and map them to a generic Xbox layout ([thanks to SDL!](https://wiki.libsdl.org/CategoryGameController)). ⚠️ Basic controller support is in Ruby 2D now, but other features (detection, mapping) hasn't been pushed to the gem yet, so beware!

**Building for iOS and tvOS** hasn't been merged yet ([in this PR](https://github.com/ruby2d/ruby2d/pull/74)), but should be in soon.

Check out the [MRuby iOS and tvOS](https://github.com/ruby2d/mruby-frameworks) frameworks and generation tools repo.

---

## Previous Ruby game dev talks

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

---

**More cool things...**

A great book about [Game Programming Patterns](http://gameprogrammingpatterns.com), a collection of patterns in games that make code cleaner, easier to understand, and faster.

Using [RubyMotion](http://www.rubymotion.com) and [SpriteKit](https://developer.apple.com/spritekit/) to [make iOS games](https://github.com/amirrajan/ios-ruby-game-dev).
