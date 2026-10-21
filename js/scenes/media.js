FD.add({
  id: 'media',
  title: 'Optical, flash and tape',
  tab: 'Other media',
  icon: 'media',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['Bit', 'Binary digit: a single unit of information with a value of either 0 or 1. Eight bits equal one byte.'],
    ['CD-R, DVD-R, BD-R', 'Recordable optical media: data can be written to them.'],
    ['CD-RW, DVD-RW, BD-RE', 'Rewritable media: they can be written, erased and written again.'],
  ],
  mount(el) {
    // name, laser colour, laser words, spot size µm, capacity text, capacity MB, extra
    const OPT = [
      ['CD', '#e8590c', 'laser', 2.11, '700 MB', 700, 'The data is written using a laser, onto a plastic layer beneath layers of aluminium and acrylic.'],
      ['DVD', '#e03131', 'red laser, shorter wavelength', 1.32, '4.7 GB', 4700, 'Single-sided, single-layer: 4.7 GB. Double-sided, dual-layer disks: as much as 18 GB.'],
      ['Blu-ray', '#7048e8', 'violet laser', 0.58, '25 GB', 25000, 'Single-sided: 25 GB. Double-sided: 50 GB. A scratch-protection coating. Named after the colour of the laser!'],
    ];
    const RW = [['CD-R', 0, 'R'], ['DVD-R', 1, 'R'], ['BD-R', 2, 'R'], ['CD-RW', 0, 'RW'], ['DVD-RW', 1, 'RW'], ['BD-RE', 2, 'RE']];
    const TAPE = 10;
    el.innerHTML = `
      <div class="sim md">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="opt">💿 Optical media</button><button data-p="rw">🔥 R, RW and RE</button><button data-p="flash">⚡ Flash media</button><button data-p="tape">📼 Magnetic tape</button><button data-p="bits">0️⃣1️⃣ Storing 0s and 1s</button>
        </div>

        <div data-panel="opt" class="sim">
          <div class="seg" id="oSeg"><span class="seg-l">Disk</span>${OPT.map((o, i) => `<button data-v="${i}">${o[0]}</button>`).join('')}</div>
          <div class="two-col">
            <div class="sim-box md-opt">
              <svg viewBox="0 0 320 170" role="img" aria-label="Close-up of the track on the disk and the laser spot">
                <rect class="md-surf" x="10" y="10" width="300" height="120" rx="10"/>
                <g id="pits"></g>
                <circle id="spot" cx="160" cy="70" r="20"/>
                <text x="160" y="152" class="svg-sm" id="spotT"></text>
              </svg>
            </div>
            <div class="sim-box">
              <div class="readout"><div class="ro"><small>Laser</small><b id="oLas"></b></div><div class="ro"><small>Spot size</small><b id="oSpot"></b></div><div class="ro"><small>Capacity</small><b id="oCap"></b></div></div>
              <div class="md-cap" id="capBars">${OPT.map((o, i) => `<div class="md-bar" data-i="${i}"><span>${o[0]}</span><i><b style="width:${Math.max(2, (100 * o[5]) / 25000)}%"></b></i><small>${o[4]}</small></div>`).join('')}</div>
              <p class="note" id="oTxt"></p>
            </div>
          </div>
        </div>

        <div data-panel="rw" class="sim" hidden>
          <div class="seg" id="rwSeg"><span class="seg-l">Disk</span>${RW.map((r, i) => `<button data-v="${i}">${r[0]}</button>`).join('')}</div>
          <div class="two-col">
            <div class="sim-box md-disc-box"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="md-disc" id="disc" cx="100" cy="100" r="90"/><circle class="md-burn" id="burn" cx="100" cy="100" r="0"/><g id="age"></g><circle class="md-hole" cx="100" cy="100" r="16"/><text x="100" y="196" class="svg-sm" id="discT"></text></svg></div>
            <div class="sim-box">
              <div class="chk-btns"><button class="btn primary" id="bBurn">🔥 Write files</button><button class="btn" id="bErase">🧽 Erase</button><button class="btn" id="bAge">⏳ Store badly for years</button></div>
              <p class="verdict" id="rwMsg"></p>
              <p class="note">All optical media is <b>recordable</b> (CD-R, DVD-R, BD-R). Some CDs and DVDs can be <b>rewritten</b> (CD-RW, DVD-RW), and some Blu-ray media can be written, then <b>erased and rewritten</b> (BD-RE).</p>
            </div>
          </div>
        </div>

        <div data-panel="flash" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box md-dev" id="devH"><h5>🗄️ Hard disk: moving parts</h5><svg viewBox="0 0 160 90" aria-hidden="true"><circle class="hd-platter md-spin" cx="60" cy="45" r="38"/><circle class="hd-spindle" cx="60" cy="45" r="8"/><path class="hd-arm" d="M150 80L82 40"/></svg><div class="md-batt"><i id="bH"></i></div><p class="note" id="mH">Battery</p></div>
            <div class="sim-box md-dev" id="devF"><h5>⚡ Flash media: no moving parts</h5><svg viewBox="0 0 160 90" aria-hidden="true"><rect class="sto-chip" x="30" y="20" width="100" height="50" rx="6"/>${[0, 1, 2, 3, 4].map((i) => `<rect class="md-cell" x="${40 + i * 17}" y="32" width="12" height="26" rx="2"/>`).join('')}</svg><div class="md-batt"><i id="bF"></i></div><p class="note" id="mF">Battery</p></div>
          </div>
          <div class="chk-btns"><button class="btn primary" id="bUse">🔋 Use for 3 hours</button><button class="btn" id="bShake">📳 Drop it while it is working</button></div>
          <p class="verdict" id="flMsg"></p>
        </div>

        <div data-panel="tape" class="sim" hidden>
          <div class="sim-box md-tape">
            <svg viewBox="0 0 460 150" role="img" aria-label="Magnetic tape wound between two reels, with files one after another">
              <g id="reelL"><circle class="md-reel" cx="80" cy="70" r="55"/><path class="md-spoke" d="M80 20V120M30 70H130"/></g>
              <g id="reelR"><circle class="md-reel" cx="380" cy="70" r="55"/><path class="md-spoke" d="M380 20V120M330 70H430"/></g>
              <rect class="md-head" x="222" y="112" width="16" height="22" rx="3"/><text x="230" y="146" class="svg-sm">head</text>
              <clipPath id="tclip"><rect x="80" y="104" width="300" height="12"/></clipPath>
              <g clip-path="url(#tclip)"><g id="strip">${Array.from({ length: TAPE }, (_, i) => `<rect class="md-file" x="${202 + i * 60}" y="104" width="56" height="12"/><text x="${230 + i * 60}" y="113.5" class="md-ft">file ${i + 1}</text>`).join('')}</g></g>
            </svg>
          </div>
          <div class="chk-btns"><button class="btn primary" id="bFind">🔎 Find file 9</button><button class="btn" id="bRew">⏪ Rewind</button></div>
          <p class="verdict" id="tpMsg"></p>
        </div>

        <div data-panel="bits" class="sim" hidden>
          <div class="ctrls"><label class="rng"><span>Type one letter <output id="bCode"></output></span><input id="bIn" maxlength="1" value="A" aria-label="One letter" class="md-in"></label></div>
          <p class="note">Each <b>bit</b> holds 0 or 1. These <b>8 bits = 1 byte</b>. Click a bit to change it.</p>
          <div class="md-rows" id="bRows"></div>
        </div>
      </div>`;
    const root = el.querySelector('.md'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- optical ----
    let oi = 0;
    function opt(i) {
      oi = i;
      const [n, col, las, spot, cap, , txt] = OPT[i];
      FD.segSet($('#oSeg'), i);
      const s = spot * 15;                  // drawing scale: 1 µm = 15 px
      let pits = '';
      for (let y = 10 + s * 0.9; y < 130 - s * 0.4; y += s * 1.5) {
        for (let x = 12 + ((y * 7) % (s * 2)); x < 306; x += s * 2.4) pits += `<rect class="md-pit" x="${x}" y="${y - s * 0.22}" width="${s * (1 + ((x + y) % 3) * 0.5)}" height="${s * 0.44}" rx="${s * 0.2}"/>`;
      }
      $('#pits').innerHTML = pits;
      $('#spot').setAttribute('r', s / 2 + 3);
      $('#spot').style.fill = col;
      $('#spotT').textContent = `laser spot ${spot} µm · tracks closer together = more data`;
      $('#oLas').textContent = las.split(',')[0];
      $('#oSpot').textContent = spot + ' µm';
      $('#oCap').textContent = cap;
      $('#oTxt').innerHTML = `<b>${n}:</b> ${txt}`;
      root.querySelectorAll('.md-bar').forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    }
    $('#oSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) opt(+b.dataset.v); });
    async function optTour(ctx) { for (let i = 0; i < 3; i++) { opt(i); if (!(await ctx.sleep(1600))) return; } }

    // ---- R / RW / RE ----
    let ri = 0, written = false, aged = false;
    function rw(i) {
      ri = i; written = false; aged = false;
      FD.segSet($('#rwSeg'), i);
      $('#disc').setAttribute('class', 'md-disc d' + RW[i][1]);
      $('#burn').setAttribute('r', 0);
      $('#age').innerHTML = '';
      $('#discT').textContent = RW[i][0] + ' · blank';
      $('#rwMsg').className = 'verdict';
      $('#rwMsg').textContent = RW[i][2] === 'R' ? 'Recordable: you can write to it once.' : RW[i][2] === 'RW' ? 'Rewritable: you can write, erase and write again.' : 'BD-RE: written, then erased and rewritten.';
    }
    const msg = (cls, html) => { $('#rwMsg').className = 'verdict ' + cls; $('#rwMsg').innerHTML = html; };
    async function burn() {
      if (written && RW[ri][2] === 'R') return msg('bad', `✗ This ${RW[ri][0]} has already been written. A recordable disk cannot be changed.`);
      if (written) return msg('bad', '✗ The disk is full. Erase it first, then write again.');
      $('#bBurn').disabled = true;
      await FD.tween(1200, (k) => $('#burn').setAttribute('r', 20 + 68 * k));
      written = true;
      $('#discT').textContent = RW[ri][0] + ' · written';
      $('#bBurn').disabled = false;
      msg('good', '✓ The laser wrote the files to the disk.');
    }
    async function erase() {
      if (RW[ri][2] === 'R') return msg('bad', `✗ A ${RW[ri][0]} cannot be erased: only rewritable media (CD-RW, DVD-RW, BD-RE) can.`);
      if (!written) return msg('', 'The disk is already blank.');
      await FD.tween(800, (k) => $('#burn').setAttribute('r', 88 * (1 - k)));
      written = false;
      $('#discT').textContent = RW[ri][0] + ' · erased';
      msg('good', '✓ Erased. It can be written again.');
    }
    function age() {
      aged = true;
      $('#age').innerHTML = Array.from({ length: 14 }, () => { const a = Math.random() * 6.3, r = 25 + Math.random() * 60; return `<circle class="md-rot" cx="${100 + r * Math.cos(a)}" cy="${100 + r * Math.sin(a)}" r="${3 + Math.random() * 7}"/>`; }).join('');
      msg('bad', '⚠ Optical media layers <b>deteriorate</b> (get worse) over time, so disks have to be <b>stored carefully</b> to prevent data loss.');
    }
    $('#rwSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) rw(+b.dataset.v); });
    $('#bBurn').addEventListener('click', burn);
    $('#bErase').addEventListener('click', erase);
    $('#bAge').addEventListener('click', age);
    async function rwDemo(ctx) {
      rw(1); if (!(await ctx.sleep(600))) return; await burn(); if (!(await ctx.sleep(1000))) return; await burn(); if (!(await ctx.sleep(1500))) return;
      rw(4); if (!(await ctx.sleep(600))) return; await burn(); if (!(await ctx.sleep(900))) return; await erase();
    }

    // ---- flash media ----
    async function use() {
      $('#bUse').disabled = true;
      await FD.tween(1800, (k) => { $('#bH').style.width = (100 - 70 * k) + '%'; $('#bF').style.width = (100 - 35 * k) + '%'; });
      $('#mH').textContent = 'Battery: 30% left'; $('#mF').textContent = 'Battery: 65% left';
      $('#flMsg').className = 'verdict good';
      $('#flMsg').innerHTML = 'Flash media are more <b>energy-efficient</b> than hard disks because they do not have moving parts.';
      $('#bUse').disabled = false;
    }
    function shake() {
      FD.shake($('#devH')); FD.shake($('#devF'));
      $('#devH').classList.add('bad'); $('#devF').classList.add('good');
      $('#flMsg').className = 'verdict good';
      $('#flMsg').innerHTML = 'The hard disk’s moving parts can fail when it is moved around; flash media are <b>less likely to fail</b>. So flash suits <b>portable devices</b>.';
    }
    function resetFlash() { $('#bH').style.width = '100%'; $('#bF').style.width = '100%'; $('#mH').textContent = 'Battery'; $('#mF').textContent = 'Battery'; $('#devH').classList.remove('bad'); $('#devF').classList.remove('good'); $('#flMsg').textContent = ''; $('#flMsg').className = 'verdict'; }
    $('#bUse').addEventListener('click', use);
    $('#bShake').addEventListener('click', shake);

    // ---- tape ----
    let pos = 0;
    const strip = () => $('#strip').setAttribute('transform', `translate(${-pos * 60} 0)`);
    async function wind(to) {
      const from = pos;
      $('#bFind').disabled = true;
      await FD.tween(Math.abs(to - from) * 450 + 200, (k) => {
        pos = from + (to - from) * k; strip();
        $('#reelL').setAttribute('transform', `rotate(${pos * 140} 80 70)`); $('#reelR').setAttribute('transform', `rotate(${pos * 140} 380 70)`);
      });
      $('#bFind').disabled = false;
    }
    async function find() {
      $('#tpMsg').className = 'verdict'; $('#tpMsg').textContent = 'Winding past files 1, 2, 3 … to reach file 9.';
      await wind(8);
      if (dead) return;
      $('#tpMsg').className = 'verdict good';
      $('#tpMsg').innerHTML = 'Found file 9 — but the tape had to wind past every file before it. That is why tape has the <b>slowest</b> data access speed. It is cheap and holds a lot, so it is used for <b>whole system backups</b> and <b>archives</b>.';
    }
    $('#bFind').addEventListener('click', find);
    $('#bRew').addEventListener('click', async () => { await wind(0); $('#tpMsg').textContent = ''; });

    // ---- bits ----
    let bits = [];
    const ROWS = [
      ['🗄️ Hard disk', 'magnetic charge on the platter: + or −', (b) => `<span class="mb hdm b${b}">${b ? '+' : '−'}</span>`],
      ['💿 Optical media', 'tiny bumps on the disk’s surface', (b) => `<span class="mb opt b${b}"><i></i></span>`],
      ['⚡ Flash media', 'levels of electrical charge in tiny cells', (b) => `<span class="mb fl b${b}"><i></i></span>`],
      ['📼 Magnetic tape', 'magnetic charge on the tape: + or −', (b) => `<span class="mb tpm b${b}">${b ? '+' : '−'}</span>`],
    ];
    function setChar(ch) {
      const c = (ch || 'A').charCodeAt(0) & 255;
      bits = c.toString(2).padStart(8, '0').split('').map(Number);
      drawBits();
    }
    function drawBits() {
      $('#bCode').textContent = bits.join('');
      $('#bRows').innerHTML = `<div class="md-row md-bitrow"><b>Bits</b>${bits.map((b, i) => `<button class="mb bit" data-i="${i}">${b}</button>`).join('')}<small></small></div>` +
        ROWS.map(([n, d, f]) => `<div class="md-row"><b>${n}</b>${bits.map(f).join('')}<small>${d}</small></div>`).join('');
      root.querySelectorAll('.bit').forEach((b) => b.addEventListener('click', () => { bits[+b.dataset.i] ^= 1; drawBits(); }));
    }
    $('#bIn').addEventListener('input', (e) => setChar(e.target.value));
    async function bitsDemo(ctx) {
      for (const ch of ['A', 'B', 'C']) { $('#bIn').value = ch; setChar(ch); if (!(await ctx.sleep(1300))) return; }
    }

    opt(0); rw(0); setChar('A'); strip();
    const showP = FD.panels(root);
    showP('opt');
    return {
      show: showP, opt, optTour, rw, rwDemo, use, shake, resetFlash, find, bitsDemo,
      async flashDemo(ctx) { resetFlash(); if (!(await ctx.sleep(500))) return; await use(); if (!(await ctx.sleep(1500))) return; shake(); },
      async tapeDemo(ctx) { pos = 0; strip(); if (!(await ctx.sleep(500))) return; await find(); },
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Optical media',
      text: `<p>Types of <strong>optical media</strong> include <b>CDs</b>, <b>DVDs</b> and <b>Blu-ray</b> disks.</p>
             <ul><li><b>CDs</b> store up to <strong>700 MB</strong>.</li><li><b>DVDs</b> store <strong>4.7 GB</strong> (single-sided, single-layer), up to <b>18 GB</b> (double-sided, dual-layer).</li><li><b>Blu-ray</b> stores <strong>25 GB</strong> (single-sided), <b>50 GB</b> (double-sided).</li></ul>`,
      async on(a, ctx) { a.show('opt'); await a.optTour(ctx); },
    },
    {
      title: 'A shorter wavelength stores more',
      text: `<p>The data is written to the disk using a <strong>laser</strong>.</p>
             <p>DVDs use a <b>red laser</b> with a <b>shorter wavelength</b> than CDs, which allows them to store more data. Blu-ray uses a <b>violet laser</b>, so it can store data at an even <b>greater density</b>.</p>`,
      tip: 'Try it: compare the laser spots. Smaller spot → smaller bumps → more data on the same disk.',
      async on(a, ctx) { a.show('opt'); await a.optTour(ctx); },
    },
    {
      title: 'Blu-ray',
      text: `<p>Blu-ray disks are similar to CDs and DVDs, but use a <strong>scratch-protection coating</strong>.</p>
             <p>Blu-ray disks get their name from the <b>colour of the laser</b> (it is actually violet, but perhaps ‘violet-ray’ was not considered a good enough name!).</p>`,
      async on(a) { a.show('opt'); a.opt(2); },
    },
    {
      title: 'Recordable and rewritable',
      text: `<p>All optical media is <strong>recordable</strong>: CD-R, DVD-R or BD-R.</p>
             <p>Some CDs and DVDs can be <strong>rewritten</strong> (CD-RW, DVD-RW), and some Blu-ray media can be written, then <strong>erased and rewritten</strong> (BD-RE).</p>`,
      tip: 'Optical media layers deteriorate (get worse) over time, so they have to be stored carefully. Try “Store badly for years”.',
      async on(a, ctx) { a.show('rw'); await a.rwDemo(ctx); },
    },
    {
      title: 'Flash media',
      text: `<p><strong>Flash media</strong> are more <b>energy-efficient</b> than hard disks because they do not have moving parts.</p>
             <p>For the same reason, they are also <b>less likely to fail</b> when they are moved around. This makes them suitable for <strong>portable devices</strong>.</p>`,
      tip: 'Did you know? One explanation of the name is that each cell is “flashed” (flooded) with electrons. Another is that data is written very quickly — “in a flash”.',
      async on(a, ctx) { a.show('flash'); await a.flashDemo(ctx); },
    },
    {
      title: 'Magnetic tape',
      text: `<p><strong>Magnetic tape</strong> was originally designed to <b>record sound</b>, but it is now also used to <b>store data</b>.</p>
             <p>It is mainly used for <b>backing up data</b> in large organisations.</p>`,
      tip: 'Try it: find file 9 on the tape.',
      async on(a, ctx) { a.show('tape'); await a.tapeDemo(ctx); },
    },
    {
      title: 'Storing 0s and 1s',
      text: `<p>Storage media store data in <strong>binary</strong> form: each <strong>bit</strong> holds one of two values, <b>0 or 1</b>. Different media store them differently:</p>
             <ul><li><b>Hard disks</b> and <b>magnetic tape</b>: the magnetic charge is negative or positive.</li><li><b>Optical media</b>: tiny bumps on the disk’s surface.</li><li><b>Flash media</b>: different levels of electrical charge in tiny cells.</li></ul>`,
      tip: 'The “bi” in “binary” comes from the Latin for “two”. Try it: type a letter or click the bits.',
      async on(a, ctx) { a.show('bits'); await a.bitsDemo(ctx); },
    },
  ],
});

FD.check({
  section: 'media',
  items: [
    { type: 'sort', q: 'Match each disk to how much it can store (single-sided, single-layer).', bins: ['700 MB', '4.7 GB', '25 GB'], rows: [['CD', 0], ['DVD', 1], ['Blu-ray', 2]], why: 'Double-sided: DVD up to 18 GB, Blu-ray 50 GB.' },
    { type: 'mcq', q: 'Why can a DVD store more data than a CD?', opts: ['It uses a laser with a shorter wavelength', 'It spins on a spindle', 'It uses magnetic charge', 'It has no moving parts'], why: 'A shorter wavelength allows data to be stored at a greater density. Blu-ray uses a violet laser for even more.' },
    { type: 'mcq', q: 'Which optical media can be written, erased and rewritten?', opts: ['BD-RE', 'BD-R', 'DVD-R', 'CD-R'], why: 'R = recordable. RW and RE can be rewritten.' },
    { type: 'multi', q: 'Why are flash media suitable for portable devices? Choose <b>two</b>.', need: 2, opts: [['They are energy-efficient: no moving parts', true], ['They are less likely to fail when moved around', true], ['They use a violet laser', false], ['They are the cheapest per GB', false]], why: 'Both reasons come from having no moving parts.' },
    { type: 'mcq', q: 'What is magnetic tape mainly used for today?', opts: ['Backing up data in large organisations', 'Running apps on a smartphone', 'Selling films', 'Storing the boot instructions'], why: 'It was originally designed to record sound.' },
    { type: 'sort', q: 'How does each media store a 0 or a 1?', bins: ['Magnetic charge', 'Tiny bumps', 'Electrical charge in cells'], rows: [['Hard disk', 0], ['Optical disk', 1], ['Flash media', 2], ['Magnetic tape', 0]], why: 'Each bit holds one of two values: 0 or 1.' },
  ],
});
