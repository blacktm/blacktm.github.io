// alive — a living profile picture, ported from alive.rb (Ruby 2D).
//
// A sphere on a 64×64 cell grid, pure black and white, 8×8 Bayer
// ordered dithering. The surface is a turbulent fluid atmosphere (a
// two-level domain warp on one TEMPO clock); every so often a
// PCB-trace lightning bolt zaps across it, flashes, collapses into
// the impact point, and fires a web of response traces.
//
// Strikes are fixed in screen space — the atmosphere flows underneath.
// Click the canvas to trigger a strike.

(() => {
  'use strict';

  const canvas = document.getElementById('alive');
  if (!canvas) return;

  const N = 64;
  canvas.width = N;
  canvas.height = N;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(N, N);
  const data = img.data;

  const BAYER = [
     0, 32,  8, 40,  2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44,  4, 36, 14, 46,  6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
     3, 35, 11, 43,  1, 33,  9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47,  7, 39, 13, 45,  5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  ].map(v => (v + 0.5) / 64);

  // Precompute the sphere cells: position, depth, dither threshold
  const xs = [], ys = [], zs = [], thr = [], gis = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const px = (c + 0.5) / N * 2 - 1;
      const py = (r + 0.5) / N * 2 - 1;
      const d2 = px * px + py * py;
      if (d2 > 1) continue;

      const gi = r * N + c;
      data[gi * 4 + 3] = 255;  // cells outside the sphere stay transparent
      xs.push(px);
      ys.push(py);
      zs.push(Math.sqrt(1 - d2));
      thr.push(BAYER[(r % 8) * 8 + (c % 8)]);
      gis.push(gi);
    }
  }

  const COUNT = xs.length;

  const ROT   = 0.17;  // alive_r3's 0.24 spin, scaled back with the tempo
  const TEMPO = 0.72;  // atmosphere clock: 1.0 = alive_r3's pace

  // --- PCB strikes, in fixed screen space --------------------------------
  const DRAW_DUR  = 0.14;  // rim-to-rim zap
  const ERASE_DUR = 0.22;  // the channel un-draws itself into the impact point
  const GROW_DUR  = 0.35;  // response lines fire out
  const FADE_DUR  = 0.50;  // and dissolve back into the flow
  const FLASH_DUR = 0.18;  // impact flash: instant on, very fast fade

  const MID  = (N - 1) / 2;
  const DISC = N / 2 - 1.5;  // keep strike cells inside the sphere's rim

  const overlay = new Float64Array(N * N);
  const shadow  = new Float64Array(N * N);  // dark outline around lit cells
  let event = null;

  const key = (x, y) => x + ',' + y;
  const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const sample = arr => arr[Math.floor(Math.random() * arr.length)];

  const inside = (x, y) =>
    (x - MID) * (x - MID) + (y - MID) * (y - MID) <= DISC * DISC;

  // Real PCB traces keep clearance: a step is blocked if the target cell
  // or any neighbor is already occupied — except our own trailing cells.
  function blocked(occ, x, y, recent) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const k = key(x + dx, y + dy);
        if (occ.has(k) && !recent.has(k)) return true;
      }
    }
    return false;
  }

  function recentSet(cells) {
    const s = new Set();
    for (let i = Math.max(0, cells.length - 3); i < cells.length; i++) {
      s.add(key(cells[i][0], cells[i][1]));
    }
    return s;
  }

  // Mark the 8 neighbors of every lit overlay cell as shadow, so the
  // bolt keeps a dark edge even over bright clouds
  function buildShadow() {
    shadow.fill(0);
    for (let gi = 0; gi < N * N; gi++) {
      const v = overlay[gi];
      if (v <= 0) continue;
      const cy = Math.floor(gi / N);
      const cx = gi % N;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= N || ny < 0 || ny >= N) continue;
          const ni = ny * N + nx;
          if (overlay[ni] <= 0 && shadow[ni] < v) shadow[ni] = v;
        }
      }
    }
  }

  // A windy PCB route from a to b: many short straight legs with 90°
  // corners — mostly biased toward the goal, with regular detours so the
  // trace wanders across the face of the sphere.
  function pcbRoute(sx, sy, gx, gy) {
    const occ = new Set([key(sx, sy)]);
    const cells = [[sx, sy]];
    let tx = sx;
    let ty = sy;
    const free = (nx, ny) =>
      inside(nx, ny) && !blocked(occ, nx, ny, recentSet(cells));
    const mark = () => {
      cells.push([tx, ty]);
      occ.add(key(tx, ty));
    };

    for (let i = 0; i < 120; i++) {
      const dx = gx - tx;
      const dy = gy - ty;
      if (Math.abs(dx) + Math.abs(dy) <= 1) break;

      const detour = Math.random() < 0.55 && cells.length > 3;
      if (dy === 0 || (dx !== 0 && Math.random() * (Math.abs(dx) + Math.abs(dy)) < Math.abs(dx))) {
        // horizontal leg (or a vertical detour instead)
        if (detour) {
          const step = sample([-1, 1]);
          const run = randInt(5, 12);
          for (let j = 0; j < run; j++) {
            if (!free(tx, ty + step)) break;
            ty += step;
            mark();
          }
        } else {
          const step = dx > 0 ? 1 : -1;
          const run = Math.max(Math.round(Math.abs(dx) * (0.10 + Math.random() * 0.25)), 1);
          for (let j = 0; j < run; j++) {
            if (!free(tx + step, ty)) break;
            tx += step;
            mark();
          }
        }
      } else if (detour) {
        const step = sample([-1, 1]);
        const run = randInt(5, 12);
        for (let j = 0; j < run; j++) {
          if (!free(tx + step, ty)) break;
          tx += step;
          mark();
        }
      } else {
        const step = dy > 0 ? 1 : -1;
        const run = Math.max(Math.round(Math.abs(dy) * (0.10 + Math.random() * 0.25)), 1);
        for (let j = 0; j < run; j++) {
          if (!free(tx, ty + step)) break;
          ty += step;
          mark();
        }
      }
    }

    return cells;
  }

  // A PCB response line: straight legs with 90° corners, total length
  // capped by the caller. Hitting the rim or another line's clearance
  // ends the leg early and the next 90° turn carries on from there.
  // All response lines share one occupancy map so they route around
  // each other like real board traces. The first few cells skip the
  // clearance check — every line has to escape the shared origin.
  function sprout(sx, sy, dir, maxLen, occ) {
    const cells = [];
    let tx = sx;
    let ty = sy;
    for (let leg = 0; leg < 25; leg++) {
      if (cells.length >= maxLen) break;
      const run = randInt(10, 20);
      for (let j = 0; j < run; j++) {
        if (cells.length >= maxLen) break;
        const nx = tx + dir[0];
        const ny = ty + dir[1];
        if (!inside(nx, ny)) break;
        if (cells.length >= 4 && blocked(occ, nx, ny, recentSet(cells))) break;
        tx = nx;
        ty = ny;
        cells.push([tx, ty]);
        occ.add(key(tx, ty));
      }
      dir = sample([[dir[1], dir[0]], [-dir[1], -dir[0]]]);
    }
    return cells;
  }

  function spawnStrike() {
    // Start and end at opposite edges of the sphere, for maximum sweep
    const phi = Math.random() * 2 * Math.PI;
    const psi = phi + Math.PI + (Math.random() - 0.5) * 0.7;
    const r = DISC - 0.5;
    const sx = Math.round(MID + r * Math.cos(phi));
    const sy = Math.round(MID + r * Math.sin(phi));
    const gx = Math.round(MID + r * Math.cos(psi));
    const gy = Math.round(MID + r * Math.sin(psi));

    const path = pcbRoute(sx, sy, gx, gy);
    const goal = path[path.length - 1];

    // The response: several PCB lines firing out of the impact point,
    // long enough to reach across half the sphere or more
    const branchLen = Math.min(Math.max(Math.floor(path.length / 2), 60), 100);
    const occResp = new Set();  // shared by all response lines, so they don't cross
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 6; i++) dirs.push(sample(dirs.slice(0, 4)));
    const branches = dirs.slice(0, 8 + randInt(0, 2)).map(dir => ({
      cells: sprout(goal[0], goal[1], dir, branchLen, occResp),
      delay: Math.random() * 0.12
    }));

    // Shock wave reach: 50-75% of the sphere, varying strike to strike
    return { path, branches, waveMax: N * (0.5 + Math.random() * 0.25), t0: null };
  }

  // --- Main loop ---------------------------------------------------------

  // Unlike the Ruby original, drop into the flow at a random moment so
  // each visit opens on a different frame
  let t = Math.random() * 600;
  let nextAuto = t + 1.2;  // first automatic strike

  function fire() {
    event = spawnStrike();
    event.t0 = t;
  }

  // Strike on click, or on Enter / Space / `l` (the original's strike
  // key) when the canvas has keyboard focus
  function onActivate(fn) {
    canvas.addEventListener('click', fn);
    canvas.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'l') {
        e.preventDefault();
        fn();
      }
    });
  }

  function render() {
    if (t >= nextAuto) {
      if (event === null) fire();
      nextAuto = t + 7 + Math.random() * 4;
    }

    // Rebuild the strike overlay for this frame
    let active = false;
    let flash = null;
    if (event) {
      const tau = t - event.t0;
      overlay.fill(0);

      if (tau < DRAW_DUR + ERASE_DUR + GROW_DUR + FADE_DUR) {
        active = true;
        const path = event.path;

        if (tau < DRAW_DUR) {
          // the zap: draw from the start point outward
          const head = Math.floor(tau / DRAW_DUR * path.length);
          for (let k = 0; k < head; k++) {
            overlay[path[k][1] * N + path[k][0]] = 1;
          }
        } else if (tau < DRAW_DUR + ERASE_DUR) {
          // the signal passes through: the channel un-draws itself
          // from the start, collapsing into the impact point
          const tail = Math.floor((tau - DRAW_DUR) / ERASE_DUR * path.length);
          const crackle = Math.random() < 0.5 ? 1 : 0.6;
          for (let k = tail; k < path.length; k++) {
            overlay[path[k][1] * N + path[k][0]] = crackle;
          }
        } else {
          // the response: PCB lines fire out of the impact point
          const gtau = tau - DRAW_DUR - ERASE_DUR;
          const fade = gtau - GROW_DUR;
          const env = fade > 0 ? 1 - fade / FADE_DUR : 1;

          for (const br of event.branches) {
            const cells = br.cells;
            if (cells.length === 0) continue;
            const bhead = Math.min(Math.max(
              Math.floor((gtau - br.delay) / GROW_DUR * cells.length), 0), cells.length);
            for (let k = 0; k < bhead; k++) {
              const gi = cells[k][1] * N + cells[k][0];
              if (overlay[gi] < env) overlay[gi] = env;
            }
          }
        }

        buildShadow();

        // The flash: at the instant the bolt connects, a radial gradient
        // of light appears over the whole impact region and fades fast
        if (tau >= DRAW_DUR && tau < DRAW_DUR + FLASH_DUR) {
          const fenv = 1 - (tau - DRAW_DUR) / FLASH_DUR;
          const g = event.path[event.path.length - 1];
          flash = [g[0], g[1], event.waveMax, fenv * fenv];
        }
      } else {
        event = null;
      }
    }

    // Slow orbiting light
    const la = t * 0.1;
    let lx = Math.cos(la) * 0.55;
    let ly = -0.45;
    let lz = Math.sin(la) * 0.35 + 0.65;
    const ln = 1 / Math.sqrt(lx * lx + ly * ly + lz * lz);
    lx *= ln; ly *= ln; lz *= ln;

    const ca = Math.cos(t * ROT);
    const sa = Math.sin(t * ROT);

    const ft = t * TEMPO;  // the atmosphere's clock; strikes and light stay on t

    for (let i = 0; i < COUNT; i++) {
      const x = xs[i], y = ys[i], z = zs[i];

      const ux = x * ca + z * sa;
      const uz = z * ca - x * sa;

      // Two-level domain warp: bend the coordinates, then bend them again
      // through the first bend — turbulence riding on turbulence
      const q1 = Math.sin(0.9 * y + 1.1 * uz + ft * 0.31);
      const q2 = Math.sin(1.2 * ux - 0.8 * uz - ft * 0.37);
      const q3 = Math.sin(1.0 * (ux + y) + ft * 0.26);

      const r1 = Math.sin(1.3 * (y + q3) - 0.9 * (uz + q1) + ft * 0.42);
      const r2 = Math.sin(1.1 * (ux + q2) + 0.8 * (y + q1) - ft * 0.34);
      const r3 = Math.sin(0.9 * (ux + q1) + 1.2 * (uz + q2) + ft * 0.29);

      const wx = ux + 0.55 * q1 + 0.4 * r1;
      const wy = y  + 0.55 * q2 + 0.4 * r2;
      const wz = uz + 0.55 * q3 + 0.4 * r3;

      const f = Math.sin(1.9 * wx + ft * 0.50) +
                Math.sin(1.6 * wy - ft * 0.40) +
                Math.sin(1.8 * (wx + wy + wz) + ft * 0.45);
      let band = 0.5 + 0.5 * Math.sin(3.5 * f + ft * 0.30);
      band = band * band * (3 - 2 * band);  // commit tones to light or dark

      let ndl = x * lx + y * ly + z * lz;
      if (ndl < 0) ndl = 0;

      let b = (0.42 + 0.58 * ndl) * (0.12 + 0.88 * band);

      const gi = gis[i];
      if (active) {
        const sh = shadow[gi];
        if (sh > 0) b *= 1 - 0.75 * sh;
        const hit = overlay[gi];
        if (hit > b) b = hit;

        if (flash) {
          const ddx = (gi % N) - flash[0];
          const ddy = Math.floor(gi / N) - flash[1];
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < flash[2]) b += flash[3] * (1 - d / flash[2]);
        }
      }

      const v = b > thr[i] ? 255 : 0;
      const j = gi * 4;
      data[j] = v; data[j + 1] = v; data[j + 2] = v;
    }

    ctx.putImageData(img, 0, 0);
  }

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    // A single still frame; activating still fires one strike's worth
    // of motion since the user asked for it.
    render();
    canvas.classList.add('is-live');
    let animating = false;
    onActivate(() => {
      fire();
      if (animating) return;
      animating = true;
      const start = performance.now();
      const dur = DRAW_DUR + ERASE_DUR + GROW_DUR + FADE_DUR + 0.1;
      const step = now => {
        t += 1 / 60;
        render();
        if ((now - start) / 1000 < dur) {
          requestAnimationFrame(step);
        } else {
          animating = false;
        }
      };
      requestAnimationFrame(step);
    });
  } else {
    onActivate(fire);
    let last = null;
    const frame = now => {
      if (last !== null) {
        t += Math.min((now - last) / 1000, 0.05);
      }
      last = now;
      render();
      canvas.classList.add('is-live');
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
