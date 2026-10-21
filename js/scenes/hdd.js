FD.add({
  id: 'hdd',
  title: 'Hard disks',
  tab: 'Hard disks',
  icon: 'hdd',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['Concentric', 'Of circles or circular objects: sharing the same central point.'],
    ['Spindle', 'A rod around which something spins.'],
    ['Platters', 'Circular plates.'],
    ['Read/write head', 'The part of a disk drive that passes across (or floats) the platters on a very thin layer of gas above the platters.'],
    ['Seek time', 'The time it takes for a read/write head to locate the area on the disk where the data to be read is stored.'],
  ],
  mount(el) {
    const SLOW = 100;                       // the simulation runs 100 times slower than a real disk
    const C = [160, 155], P = [365, 285], L = 225;
    const TR = [44, 58, 72, 86, 100, 114, 128];
    el.innerHTML = `
      <div class="sim hd">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="top">💽 Read and write data</button><button data-p="side">🔬 Inside: platters and heads</button>
        </div>

        <div data-panel="top" class="sim">
          <div class="two-col hd-cols">
            <div class="sim-box hd-top">
              <svg viewBox="0 0 400 310" role="img" aria-label="Top view of a hard disk: a spinning platter with tracks and a read/write head on an arm">
                <rect class="hd-case" x="8" y="8" width="384" height="294" rx="16"/>
                <g id="plat">
                  <circle class="hd-platter" cx="${C[0]}" cy="${C[1]}" r="138"/>
                  ${TR.map((r) => `<circle class="hd-track" cx="${C[0]}" cy="${C[1]}" r="${r}"/>`).join('')}
                  ${TR.map((r, i) => [0, 1, 2, 3, 4, 5].map((k) => { const a = (k * 60 + i * 23) * Math.PI / 180; return `<rect class="hd-bitmk" x="${C[0] + r * Math.cos(a) - 2}" y="${C[1] + r * Math.sin(a) - 2}" width="4" height="4"/>`; }).join('')).join('')}
                  <path class="hd-sector" id="sector" d=""/>
                  <path class="hd-mark" d="M${C[0] + 24} ${C[1]}h10"/>
                </g>
                <circle class="hd-spindle" cx="${C[0]}" cy="${C[1]}" r="20"/><circle class="hd-spin-c" cx="${C[0]}" cy="${C[1]}" r="6"/>
                <text x="${C[0]}" y="${C[1] + 36}" class="svg-sm hd-w">spindle</text>
                <line class="hd-arm" id="arm"/>
                <rect class="hd-head" id="head" width="14" height="10" rx="2"/>
                <circle class="hd-pivot" cx="${P[0]}" cy="${P[1]}" r="11"/>
                <text x="381" y="258" class="svg-sm">arm</text>
              </svg>
              <p class="note hd-slow">Slowed down 100 times so that you can see it.</p>
            </div>
            <div class="sim-box hd-ctl">
              <div class="seg" id="rpmSeg"><span class="seg-l">Spin speed</span><button data-v="5400">5400 rpm</button><button data-v="7200">7200 rpm</button></div>
              <div class="chk-btns"><button class="btn primary" id="bRead">📖 Read a file</button><button class="btn" id="bWrite">✏️ Write a file</button></div>
              <div class="readout">
                <div class="ro"><small>1 · Seek time</small><b id="roSeek">–</b></div>
                <div class="ro"><small>2 · Wait for spin</small><b id="roSpin">–</b></div>
                <div class="ro"><small>Total</small><b id="roTot">–</b></div>
              </div>
              <div class="hd-sig" id="sig"><span class="hd-sig-l" id="sigL">Magnetic field ⇄ electrical current</span><span class="hd-bits" id="bits"></span></div>
              <p class="note" id="hdMsg">Press <b>Read a file</b>.</p>
            </div>
          </div>
        </div>

        <div data-panel="side" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box">
              <svg viewBox="0 0 320 230" role="img" aria-label="Side view: three platters on a spindle make a cylinder, with a read/write head on an arm for each surface">
                <rect class="hd-spindle" x="148" y="30" width="24" height="180" rx="4"/>
                ${[60, 110, 160].map((y) => `<ellipse class="hd-platter" cx="160" cy="${y}" rx="120" ry="20"/><ellipse class="hd-track" cx="160" cy="${y}" rx="80" ry="13"/>`).join('')}
                ${[48, 72, 98, 122, 148, 172].map((y) => `<path class="hd-arm2" d="M300 ${y}H228"/><rect class="hd-head" x="214" y="${y - 3}" width="14" height="6" rx="1"/>`).join('')}
                <text x="160" y="22" class="svg-lbl">spindle</text>
                <text x="140" y="224" class="svg-sm">the platters spin together like a cylinder</text>
                <text x="290" y="200" class="svg-sm">arms</text>
              </svg>
            </div>
            <div class="sim-box">
              <svg viewBox="0 0 300 200" class="hd-zoom" role="img" aria-label="Close-up: the head floats a few nanometres above the platter">
                <rect class="hd-gas" x="10" y="98" width="280" height="22"/>
                <rect class="hd-platter-x" id="surf" x="10" y="120" width="280" height="40"/>
                <rect class="hd-arm-x" x="140" y="40" width="150" height="20" rx="3"/>
                <rect class="hd-head" id="zHead" x="140" y="60" width="44" height="38" rx="4"/>
                <path class="hd-scratch" id="scratch" d="M60 124l30 8 25-6 30 9 25-7 30 8"/>
                <circle class="hd-dust" id="dust" cx="-20" cy="108" r="8" opacity="0"/>
                <rect class="hd-filter" id="filter" x="22" y="70" width="10" height="90" rx="2"/>
                <text x="70" y="92" class="svg-sm">a few nanometres of gas</text>
                <text x="80" y="180" class="svg-sm">spinning platter</text>
              </svg>
              <div class="chk-btns"><button class="btn" id="bDust">💨 Let a dust particle in</button><button class="btn" id="bSeal" aria-pressed="false">🛡️ Filter / sealed unit: off</button></div>
            </div>
          </div>
          <p class="verdict" id="crMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.hd'), $ = (s) => root.querySelector(s);
    let dead = false, rpm = 7200, ang = 0, acc = 0;
    let headR = TR[3], curTrack = 3, target = null; // target = { t, th }

    // ---- geometry ----
    function headAt(r) {
      const dx = P[0] - C[0], dy = P[1] - C[1], d = Math.hypot(dx, dy);
      const a = (r * r - L * L + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r * r - a * a));
      const mx = C[0] + (a * dx) / d, my = C[1] + (a * dy) / d;
      const p1 = [mx - (h * dy) / d, my + (h * dx) / d], p2 = [mx + (h * dy) / d, my - (h * dx) / d];
      return p1[1] < p2[1] ? p1 : p2;
    }
    const headAngle = () => { const H = headAt(headR); return (Math.atan2(H[1] - C[1], H[0] - C[0]) * 180) / Math.PI; };
    function drawArm() {
      const H = headAt(headR);
      $('#arm').setAttribute('x1', P[0]); $('#arm').setAttribute('y1', P[1]);
      $('#arm').setAttribute('x2', H[0]); $('#arm').setAttribute('y2', H[1]);
      $('#head').setAttribute('x', H[0] - 7); $('#head').setAttribute('y', H[1] - 5);
    }
    function drawSector() {
      const s = $('#sector');
      if (!target) { s.setAttribute('d', ''); return; }
      const r = TR[target.t], a0 = ((target.th - 10) * Math.PI) / 180, a1 = ((target.th + 10) * Math.PI) / 180;
      s.setAttribute('d', `M${C[0] + r * Math.cos(a0)} ${C[1] + r * Math.sin(a0)}A${r} ${r} 0 0 1 ${C[0] + r * Math.cos(a1)} ${C[1] + r * Math.sin(a1)}`);
    }

    // ---- spinning ----
    const revMs = () => 60000 / rpm;
    let last = performance.now();
    function spin(now) {
      if (dead) return;
      const dt = now - last; last = now;
      ang = (ang + (360 * dt * FD.speed) / (revMs() * SLOW)) % 360;
      $('#plat').setAttribute('transform', `rotate(${ang} ${C[0]} ${C[1]})`);
      requestAnimationFrame(spin);
    }
    requestAnimationFrame(spin);

    function setRpm(v) { rpm = v; FD.segSet($('#rpmSeg'), v); }
    $('#rpmSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) setRpm(+b.dataset.v); });

    const ms = (v) => v.toFixed(1).replace(/\.0$/, '') + ' ms';
    // Read or write one block at a random place. Returns the real times in ms.
    async function access(write, alive0 = () => true) {
      const id = ++acc, alive = () => id === acc && alive0() && !dead;
      root.querySelectorAll('#bRead, #bWrite').forEach((b) => { b.disabled = true; });
      ['#roSeek', '#roSpin', '#roTot'].forEach((s) => { $(s).textContent = '–'; });
      $('#bits').textContent = '';
      $('#sig').classList.remove('on', 'w');
      let t; do { t = Math.floor(Math.random() * TR.length); } while (t === curTrack && Math.random() < 0.8);
      target = { t, th: Math.floor(Math.random() * 360) };
      drawSector();
      // 1 · seek: move the head across the tracks
      const seek = 4 + (11 * Math.abs(t - curTrack)) / (TR.length - 1);
      $('#hdMsg').innerHTML = `<b>1 · Seek.</b> The arm moves the read/write head across the tracks to track ${t + 1}.`;
      const r0 = headR, r1 = TR[t];
      await FD.tween(seek * SLOW, (k) => { if (!alive()) return; headR = r0 + (r1 - r0) * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2); drawArm(); });
      curTrack = t;
      $('#roSeek').textContent = ms(seek);
      if (!alive()) return null;
      // 2 · wait until the data spins round under the head
      $('#hdMsg').innerHTML = `<b>2 · Wait.</b> The platter spins until the data arrives under the head (${FD.fmt(rpm)} rpm).`;
      const gap = (((headAngle() - target.th - ang) % 360) + 720) % 360;
      const wait = (gap / 360) * revMs();
      await FD.wait(wait * SLOW);
      $('#roSpin').textContent = ms(wait);
      $('#roTot').textContent = ms(seek + wait);
      if (!alive()) return null;
      // 3 · read or write
      $('#sig').classList.add('on');
      $('#sig').classList.toggle('w', write);
      $('#sigL').innerHTML = write ? '⚡ electrical current → 🧲 magnetic field' : '🧲 magnetic field → ⚡ electrical current';
      $('#head').classList.add('on');
      $('#sector').classList.toggle('w', write);
      const bits = Array.from({ length: 8 }, () => (Math.random() < 0.5 ? 0 : 1));
      for (const b of bits) { if (!alive()) return null; $('#bits').textContent += b; await FD.wait(110); }
      $('#head').classList.remove('on');
      $('#hdMsg').innerHTML = write
        ? `<b>3 · Write.</b> The head turned electrical current into a <b>magnetic field</b> and stored the data. Found in <b>${ms(seek + wait)}</b>.`
        : `<b>3 · Read.</b> The head turned the <b>magnetic field</b> into electrical current. Found in <b>${ms(seek + wait)}</b>.`;
      root.querySelectorAll('#bRead, #bWrite').forEach((b) => { b.disabled = false; });
      return { seek, wait };
    }
    $('#bRead').addEventListener('click', () => access(false));
    $('#bWrite').addEventListener('click', () => access(true));

    async function sweep(ctx) {
      for (const t of [6, 0, 3]) {
        const r0 = headR;
        const id = ++acc;
        await FD.tween(900, (k) => { if (ctx.alive() && id === acc) { headR = r0 + (TR[t] - r0) * k; drawArm(); } });
        curTrack = t;
        if (!ctx.alive()) return;
      }
    }
    async function compare(ctx) {
      const out = [];
      for (const v of [5400, 7200]) {
        setRpm(v);
        let w = 0; for (let i = 0; i < 2; i++) { const r = await access(false, ctx.alive); if (!r) return; w += r.wait; if (!(await ctx.sleep(300))) return; }
        out.push(w / 2);
      }
      $('#hdMsg').innerHTML = `Average wait for the spin: <b>5400 rpm ≈ ${ms(out[0])}</b>, <b>7200 rpm ≈ ${ms(out[1])}</b>. A faster spin means a shorter wait.`;
    }

    // ---- inside: dust and head crash ----
    let sealed = false;
    function seal(on) {
      sealed = on;
      $('#bSeal').textContent = `🛡️ Filter / sealed unit: ${on ? 'on' : 'off'}`;
      $('#bSeal').setAttribute('aria-pressed', on);
      $('#bSeal').classList.toggle('on', on);
      $('#filter').classList.toggle('on', on);
    }
    function resetCrash() {
      $('#dust').setAttribute('cx', -20);
      $('#dust').setAttribute('opacity', 0);
      $('#zHead').setAttribute('y', 60);
      $('#scratch').classList.remove('on');
      $('#surf').classList.remove('bad');
      $('#crMsg').className = 'verdict';
      $('#crMsg').textContent = '';
    }
    async function dust() {
      resetCrash();
      $('#bDust').disabled = true;
      $('#dust').setAttribute('opacity', 1);
      const stop = sealed ? 27 : 150;
      await FD.tween(sealed ? 600 : 1300, (k) => $('#dust').setAttribute('cx', -20 + (stop + 20) * k));
      if (sealed) {
        $('#crMsg').className = 'verdict good';
        $('#crMsg').innerHTML = '✓ The <b>filter</b> stopped the dust. Hard drives use filters in their ventilation systems or are built as <b>sealed units</b>.';
      } else {
        await FD.tween(250, (k) => $('#zHead').setAttribute('y', 60 + 22 * k));
        FD.shake($('.hd-zoom'));
        $('#scratch').classList.add('on');
        $('#surf').classList.add('bad');
        $('#crMsg').className = 'verdict bad';
        $('#crMsg').innerHTML = '✗ <b>Head crash!</b> The dust hit the head and it crashed into the platter. This can damage the data <b>and</b> the platter. It would not happen with a solid state drive.';
      }
      $('#bDust').disabled = false;
    }
    $('#bDust').addEventListener('click', dust);
    $('#bSeal').addEventListener('click', () => { seal(!sealed); resetCrash(); });

    setRpm(7200); drawArm(); seal(false);
    const showP = FD.panels(root);
    showP('top');
    return {
      show: showP, sweep, access, compare, setRpm, dust, seal, resetCrash,
      clear() { acc++; target = null; drawSector(); $('#head').classList.remove('on'); root.querySelectorAll('#bRead, #bWrite').forEach((b) => { b.disabled = false; }); },
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Platters on a spindle',
      text: `<p>Hard disks are made up of many <strong>concentric platters</strong>.</p>
             <p>These platters make up a <b>cylinder</b> that spins on a central <strong>spindle</strong>.</p>`,
      async on(a) { a.show('side'); a.resetCrash(); a.seal(false); },
    },
    {
      title: 'The read/write head',
      text: `<p>A <strong>read/write head</strong> moves on an <b>arm</b> across <b>tracks</b> on the platter.</p>
             <p>The head floats on a very thin layer of gas just above the platter: it never touches it.</p>`,
      async on(a, ctx) { a.show('top'); a.clear(); await a.sweep(ctx); },
    },
    {
      title: 'How long does it take to find the data?',
      text: `<p>The time it takes the head to access data on the tracks depends on:</p>
             <ul><li>how fast the <b>cylinder of platters spins</b></li><li>how fast the <b>read/write head moves</b> across the tracks.</li></ul>`,
      tip: 'Try it: press Read a file and watch the two stages.',
      async on(a, ctx) { a.show('top'); a.setRpm(7200); await a.access(false, ctx.alive); },
    },
    {
      title: 'Spin speed: 5400 or 7200 rpm',
      text: `<p>Typical spin speeds are <strong>5400</strong> or <strong>7200 revolutions per minute (rpm)</strong>.</p>
             <p>The faster the platters spin, the sooner the data arrives under the head.</p>`,
      tip: 'Try it: change the spin speed and read some files.',
      async on(a, ctx) { a.show('top'); await a.compare(ctx); },
    },
    {
      title: 'Seek time',
      text: `<p>The <strong>seek time</strong> is the time it takes for the read/write head to locate the area of the disk where the data is stored.</p>
             <p>The average seek time is <strong>4–15 milliseconds (ms)</strong>. A head that moves further takes longer.</p>`,
      tip: '1 millisecond = one thousandth of a second.',
      async on(a, ctx) { a.show('top'); await a.access(false, ctx.alive); },
    },
    {
      title: 'Reading and writing',
      text: `<p>When <b>reading</b>, a read/write head changes the <strong>magnetic field</strong> into <strong>electrical current</strong>.</p>
             <p>When <b>writing</b>, it transforms electrical current into a magnetic field.</p>`,
      tip: 'Try it: write a file, then read one.',
      async on(a, ctx) { a.show('top'); const r = await a.access(true, ctx.alive); if (r && await ctx.sleep(900)) await a.access(false, ctx.alive); },
    },
    {
      title: 'Head crash',
      text: `<p>The gap between the platter and the read/write head is only a <b>few nanometres</b> wide. A dust or smoke particle could cause a <strong>collision</strong>.</p>
             <p>A head crash can damage the data and the platter. To prevent this, hard drives use <b>filters</b> or are built as <b>sealed units</b>. This would not happen with a solid state drive.</p>`,
      tip: 'Try it: let dust in with the filter off, then with it on.',
      async on(a, ctx) { a.show('side'); a.seal(false); if (await ctx.sleep(600)) await a.dust(); },
    },
  ],
});

FD.check({
  section: 'hdd',
  items: [
    { type: 'mcq', q: 'What do the platters of a hard disk spin on?', opts: ['A central spindle', 'A read/write head', 'A laser', 'A ribbon'], why: 'The concentric platters make up a cylinder that spins on a central spindle.' },
    { type: 'mcq', q: 'What is the <b>seek time</b>?', opts: ['The time for the read/write head to locate the area of the disk where the data is stored', 'The time for the platter to spin once', 'The time to switch the computer on', 'The time to copy a file to a USB drive'], why: 'The average seek time is 4–15 ms.' },
    { type: 'multi', q: 'Which <b>two</b> things decide how long the head takes to access data on the tracks?', need: 2, opts: [['How fast the cylinder of platters spins', true], ['How fast the read/write head moves across the tracks', true], ['The colour of the laser', false], ['The size of the monitor', false]], why: 'Spin speed and head movement.' },
    { type: 'mcq', q: 'Which is a typical hard disk spin speed?', opts: ['7200 rpm', '7200 ms', '7.2 GHz', '72 lumens'], why: 'Typical spin speeds are 5400 rpm or 7200 rpm.' },
    { type: 'tf', q: 'When reading, the read/write head changes the magnetic field into electrical current.', a: true, why: 'When writing, it does the opposite: electrical current into a magnetic field.' },
    { type: 'mcq', q: 'Why are hard drives built as sealed units or with filters?', opts: ['A dust particle could make the head crash into the platter', 'To make the platters spin faster', 'To let the laser through', 'To keep the data when the power is off'], why: 'The gap is only a few nanometres wide.' },
  ],
});
