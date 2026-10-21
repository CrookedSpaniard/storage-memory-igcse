FD.add({
  id: 'ram',
  title: 'Memory and RAM',
  tab: 'RAM',
  icon: 'ram',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['RAM', 'Random Access Memory: memory that holds the software instructions and data in use. It is volatile.'],
    ['Volatile', 'It cannot store data when it has no power.'],
    ['Virtual memory', 'Space on secondary storage used for instructions and programs when there is not enough space in RAM.'],
  ],
  mount(el) {
    const APPS = [['🌐', 'Browser', 2, '#1c7ed6'], ['📝', 'Word processor', 1, '#2f9e44'], ['🎮', 'Game', 4, '#d6336c'], ['🖼️', 'Photo editor', 3, '#7048e8'], ['📹', 'Video call', 1.5, '#e67700'], ['🎵', 'Music', 0.5, '#0b7f95']];
    const OS = 1.5, MAX = 16;
    el.innerHTML = `
      <div class="sim rm">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="fetch">⚙️ Storage → memory → processor</button><button data-p="vm">🧠 Size of RAM and virtual memory</button>
        </div>

        <div data-panel="fetch" class="sim">
          <div class="sim-box">
            <svg viewBox="0 0 560 170" class="rm-flow" role="img" aria-label="Figure 3.1: storage sends a software instruction to memory; memory sends binary instructions to the processor">
              <rect class="rm-node" id="nS" x="10" y="35" width="110" height="90" rx="10"/><text x="65" y="76" class="svg-lbl">Storage</text><text x="65" y="96" class="svg-sm">slower</text>
              <rect class="rm-node" id="nM" x="225" y="35" width="110" height="90" rx="10"/><text x="280" y="76" class="svg-lbl">Memory</text><text x="280" y="96" class="svg-sm">RAM · fast</text>
              <rect class="rm-node" id="nP" x="440" y="35" width="110" height="90" rx="10"/><text x="495" y="76" class="svg-lbl">Processor</text><text x="495" y="96" class="svg-sm" id="cyc">idle</text>
              <path class="rm-arrow" d="M122 80H220"/><path class="rm-arrow" d="M337 80H435"/>
              <text x="171" y="70" class="svg-sm">software</text><text x="386" y="70" class="svg-sm mono">00000001111111</text>
              <g id="prog" class="rm-prog" opacity="0"><rect x="-28" y="-13" width="56" height="26" rx="5"/><text y="4" class="svg-sm rm-w">📝 app</text></g>
              <circle id="ins" class="pkt" r="7" cx="337" cy="80" opacity="0"/>
              <g id="inRam" opacity="0"><rect class="rm-loaded" x="238" y="108" width="84" height="12" rx="3"/><text x="280" y="117.5" class="rm-ft">📝 app loaded</text></g>
            </svg>
            <div class="chk-btns"><button class="btn primary" id="bLoad">📂 Open the app</button><button class="btn" id="bRun" disabled>▶ Run it</button><button class="btn" id="bCut">⏻ Power cut</button></div>
            <p class="verdict" id="fMsg"></p>
          </div>
          <div class="cards3 rm-types"><div class="mini" data-t="0"><h5>RAM</h5><p>Random Access Memory</p></div><div class="mini" data-t="1"><h5>ROM</h5><p>Read Only Memory</p></div><div class="mini" data-t="2"><h5>Flash memory</h5><p>Used in SSDs, USB drives and SD cards</p></div></div>
        </div>

        <div data-panel="vm" class="sim" hidden>
          <div class="rm-apps" id="apps">${APPS.map(([e, n, g], i) => `<button class="rm-app" data-i="${i}" aria-pressed="false" style="--ac:${APPS[i][3]}">${e} ${n} <small>${g} GB</small></button>`).join('')}</div>
          <div class="sim-box rm-mem">
            <div class="rm-lab"><b>RAM</b> <span id="ramLab"></span></div>
            <div class="rm-bar" id="ramBar"></div>
            <div class="rm-swap" id="swap" aria-hidden="true">⇅ swapping</div>
            <div class="rm-lab"><b>Virtual memory</b> on the <span id="stLab"></span></div>
            <div class="rm-bar vm" id="vmBar"></div>
          </div>
          <div class="two-col">
            <div class="sim-box">
              <div class="seg" id="stSeg"><span class="seg-l">Secondary storage</span><button data-v="hdd">Hard disk drive</button><button data-v="ssd">Solid state drive</button></div>
              <div class="rm-slots" id="slots" title="RAM slots on the motherboard"></div>
              <div class="chk-btns"><button class="btn" id="bAdd">➕ Add 4 GB of RAM</button><button class="btn ghost" id="bRem">➖ Remove</button></div>
            </div>
            <div class="sim-box">
              <div class="readout"><div class="ro" id="roPerf"><small>Performance</small><b id="perf"></b></div><div class="ro"><small>Programs open</small><b id="nOpen"></b></div></div>
              <div class="rm-meter"><i id="perfBar"></i></div>
              <p class="note" id="vmMsg"></p>
            </div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.rm'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- storage → memory → processor ----
    let loaded = false, running = 0;
    const msgF = (cls, h) => { $('#fMsg').className = 'verdict ' + cls; $('#fMsg').innerHTML = h; };
    function resetF() { loaded = false; running++; $('#inRam').setAttribute('opacity', 0); $('#prog').setAttribute('opacity', 0); $('#ins').setAttribute('opacity', 0); $('#bRun').disabled = true; $('#bLoad').disabled = false; $('#cyc').textContent = 'idle'; msgF('', ''); ['#nS', '#nM', '#nP'].forEach((s) => $(s).classList.remove('on')); }
    async function load() {
      if (loaded) return;
      $('#bLoad').disabled = true;
      $('#nS').classList.add('on');
      msgF('', 'Loading the app from <b>storage</b> into <b>RAM</b>…');
      $('#prog').setAttribute('opacity', 1);
      await FD.tween(1800, (k) => $('#prog').setAttribute('transform', `translate(${65 + 215 * k} 80)`));
      if (dead) return;
      $('#prog').setAttribute('opacity', 0);
      $('#inRam').setAttribute('opacity', 1);
      $('#nS').classList.remove('on'); $('#nM').classList.add('on');
      loaded = true;
      $('#bRun').disabled = false;
      msgF('good', 'The software is now in RAM, ready for the processor.');
    }
    async function run(n = 6) {
      if (!loaded) return msgF('bad', 'Open the app first: it must be loaded into RAM.');
      const id = ++running;
      $('#bRun').disabled = true; $('#nP').classList.add('on');
      msgF('', 'The processor <b>fetches</b> each instruction from memory, then <b>decodes</b> and <b>executes</b> it.');
      for (let i = 0; i < n && id === running && !dead; i++) {
        $('#ins').setAttribute('opacity', 1);
        $('#cyc').textContent = 'fetch';
        await FD.tween(380, (k) => $('#ins').setAttribute('cx', 337 + 100 * k));
        $('#ins').setAttribute('opacity', 0);
        if (id !== running) return;
        $('#cyc').textContent = 'decode'; await FD.wait(200);
        $('#cyc').textContent = 'execute'; await FD.wait(200);
      }
      if (id !== running) return;
      $('#cyc').textContent = 'idle'; $('#nP').classList.remove('on'); $('#bRun').disabled = false;
      msgF('good', 'Fetching from memory is much faster than loading from storage.');
    }
    function cut() {
      resetF();
      FD.shake($('#nM'));
      msgF('bad', '⏻ Power cut! RAM is <b>volatile</b>: everything in it is lost. The app must be loaded from storage again.');
    }
    $('#bLoad').addEventListener('click', load);
    $('#bRun').addEventListener('click', () => run());
    $('#bCut').addEventListener('click', cut);
    const types = (on) => root.querySelectorAll('.rm-types .mini').forEach((m) => m.classList.toggle('hot', on));

    // ---- size of RAM and virtual memory ----
    let ram = 8, storage = 'hdd', open = [];
    function layout() {
      // the most recently used programs stay in RAM; older ones are swapped out to virtual memory
      let free = ram - OS;
      const inRam = [], inVm = [];
      [...open].reverse().forEach((i) => { if (APPS[i][2] <= free) { inRam.unshift(i); free -= APPS[i][2]; } else inVm.unshift(i); });
      return { inRam, inVm, free };
    }
    const seg = (i, total) => `<span class="rm-seg" style="width:${(100 * APPS[i][2]) / total}%;--ac:${APPS[i][3]}" title="${APPS[i][1]}">${APPS[i][0]}</span>`;
    function draw() {
      const { inRam, inVm, free } = layout();
      $('#ramBar').innerHTML = `<span class="rm-seg os" style="width:${(100 * OS) / ram}%">OS</span>` + inRam.map((i) => seg(i, ram)).join('');
      $('#vmBar').innerHTML = inVm.map((i) => seg(i, MAX)).join('') || '<span class="note">not used</span>';
      $('#ramLab').textContent = `${ram} GB · ${Math.max(0, free).toFixed(1).replace('.0', '')} GB free`;
      $('#stLab').textContent = storage === 'hdd' ? 'hard disk drive' : 'solid state drive';
      $('#swap').classList.toggle('on', inVm.length > 0);
      root.querySelectorAll('.rm-app').forEach((b) => { const on = open.includes(+b.dataset.i); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.classList.toggle('vm', inVm.includes(+b.dataset.i)); });
      $('#slots').innerHTML = [0, 1, 2, 3].map((k) => `<span class="rm-slot ${k < ram / 4 ? 'full' : ''}">${k < ram / 4 ? '4 GB' : 'empty'}</span>`).join('');
      $('#bAdd').disabled = ram >= MAX; $('#bRem').disabled = ram <= 4;
      FD.segSet($('#stSeg'), storage);
      const p = inVm.length ? (storage === 'hdd' ? 20 : 45) : 100;
      $('#perf').textContent = p === 100 ? 'Fast' : p > 30 ? 'Slower' : 'Very slow';
      $('#roPerf').className = 'ro ' + (p === 100 ? 'good' : 'bad');
      $('#perfBar').style.width = p + '%';
      $('#perfBar').className = p === 100 ? '' : 'bad';
      $('#nOpen').textContent = open.length;
      let m;
      if (!open.length) m = 'Click the programs to open them.';
      else if (!inVm.length) m = `All ${open.length} program${open.length > 1 ? 's' : ''} fit in RAM: everything runs quickly.`;
      else m = `RAM is full, so the operating system uses <b>virtual memory</b> on the ${storage === 'hdd' ? 'hard disk' : 'SSD'}. Secondary storage is much slower than RAM, so performance drops.` + (storage === 'ssd' ? ' The SSD is faster than a hard disk, but this <b>constant swapping</b> can greatly reduce the performance of the SSD.' : '');
      if (ram >= MAX) m += ' <b>This computer supports a maximum of 16 GB.</b>';
      $('#vmMsg').innerHTML = m;
    }
    function toggle(i) {
      const k = open.indexOf(i);
      if (k >= 0) open.splice(k, 1); else open.push(i);
      draw();
    }
    root.querySelectorAll('.rm-app').forEach((b) => b.addEventListener('click', () => toggle(+b.dataset.i)));
    $('#stSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { storage = b.dataset.v; draw(); } });
    $('#bAdd').addEventListener('click', () => { ram = Math.min(MAX, ram + 4); draw(); FD.pulse($('#slots')); });
    $('#bRem').addEventListener('click', () => { ram = Math.max(4, ram - 4); draw(); });
    function setVM(r, s, list) { ram = r; storage = s; open = [...list]; draw(); }
    async function openSeq(ctx, list) { for (const i of list) { if (!open.includes(i)) toggle(i); if (!(await ctx.sleep(800))) return; } }

    resetF(); draw();
    const showP = FD.panels(root);
    showP('fetch');
    return {
      show: showP, resetF, load, run, cut, types, setVM, openSeq,
      async closeSeq(ctx, list) { for (const i of list) { if (open.includes(i)) toggle(i); if (!(await ctx.sleep(900))) return; } },
      async addRam(ctx) { while (ram < MAX) { if (!(await ctx.sleep(900))) return; ram += 4; draw(); FD.pulse($('#slots')); } },
      destroy() { dead = true; running++; },
    };
  },
  steps: [
    {
      title: 'Memory',
      text: `<p><strong>Memory</strong> can be accessed <b>faster</b> than secondary storage. It stores instructions so that the processor can <b>fetch</b> them quickly in order to process them.</p>
             <p>There are three types of memory you need to know: <strong>RAM</strong> (Random Access Memory), <strong>ROM</strong> (Read Only Memory) and <strong>flash memory</strong>.</p>`,
      tip: 'Memory is often called main memory or primary storage. Storage is often called secondary storage.',
      async on(a) { a.show('fetch'); a.resetF(); a.types(true); },
    },
    {
      title: 'From storage to memory to processor',
      text: `<p>Software is <strong>loaded into RAM</strong> from a computer’s secondary storage.</p>
             <p>The processor then <strong>fetches</strong> software instructions from memory and <strong>executes</strong> them (it decodes each one first).</p>`,
      tip: 'Try it: open the app, then run it.',
      async on(a, ctx) { a.show('fetch'); a.types(false); a.resetF(); if (!(await ctx.sleep(500))) return; await a.load(); if (ctx.alive()) await a.run(4); },
    },
    {
      title: 'RAM is volatile',
      text: `<p>RAM is <strong>volatile</strong>: it <b>cannot store data when it has no power</b>.</p>
             <p>If you turn off your computer’s power, any data held in RAM will be <b>lost</b>.</p>`,
      tip: 'Try it: open the app, then cause a power cut.',
      async on(a, ctx) { a.show('fetch'); a.resetF(); await a.load(); if (await ctx.sleep(900)) a.cut(); },
    },
    {
      title: 'More RAM, more programs',
      text: `<p>RAM is used to store programs that are in use. The <strong>more RAM</strong> that is available, the <strong>more programs can run at the same time</strong>.</p>
             <p>This is important when you need to use many files or programs at the same time.</p>`,
      tip: 'Try it: click the programs to open and close them.',
      async on(a, ctx) { a.show('vm'); a.setVM(8, 'hdd', []); await a.openSeq(ctx, [0, 1, 5]); },
    },
    {
      title: 'Not enough RAM: virtual memory',
      text: `<p>When there is not enough space in RAM, the operating system creates <strong>virtual memory</strong> by using an area of <b>secondary storage</b>.</p>
             <p>Secondary storage is much slower than RAM, so the user notices a <strong>big decrease in performance</strong> when the processor has to access instructions from virtual memory.</p>`,
      async on(a, ctx) { a.show('vm'); a.setVM(8, 'hdd', [0, 1, 5]); await a.openSeq(ctx, [2, 3]); },
    },
    {
      title: 'Virtual memory on an SSD',
      text: `<p>When a <strong>solid state drive (SSD)</strong> is used as secondary storage, data is swapped to and from the SSD quickly and frequently.</p>
             <p>SSDs have faster access times than hard disk drives, but this <strong>constant swapping</strong> can greatly reduce the performance of the SSD.</p>`,
      async on(a) { a.show('vm'); a.setVM(8, 'ssd', [0, 1, 5, 2, 3]); },
    },
    {
      title: 'Closing programs',
      text: `<p>When programs or files are <b>closed</b>, they are <strong>removed from RAM</strong>.</p>
             <p>As space in RAM becomes available, active programs are <b>moved into RAM from virtual memory</b>, and this improves their performance.</p>`,
      tip: 'Try it: close some programs and watch the virtual memory empty.',
      async on(a, ctx) { a.show('vm'); a.setVM(8, 'hdd', [0, 1, 5, 2, 3]); if (await ctx.sleep(900)) await a.closeSeq(ctx, [3, 2]); },
    },
    {
      title: 'Adding more RAM',
      text: `<p>A user can <strong>add more RAM</strong> using the RAM slots on a motherboard, but only up to the <b>maximum supported</b> by the computer and operating system.</p>
             <p>More RAM improves performance when using multiple files or programs at the same time. It also helps when programs are <b>updated</b>, as updates often include more complex features that need more memory.</p>`,
      tip: 'Try it: open every program, then add RAM until nothing is in virtual memory.',
      async on(a, ctx) { a.show('vm'); a.setVM(4, 'hdd', [0, 1, 5, 2, 3, 4]); await a.addRam(ctx); },
    },
  ],
});

FD.activities({
  section: 'ram',
  items: [
    {
      id: 'ram-os',
      title: 'Using RAM · 1',
      task: '<p>Choose <b>two operating systems</b>. Research the <b>maximum amount of RAM</b> that can be installed for each one.</p>',
      fields: ['Operating system 1 and its maximum RAM', 'Operating system 2 and its maximum RAM'],
      lines: 2,
      hint: 'Why do you think they are different?',
    },
    {
      id: 'ram-cost',
      title: 'Using RAM · 2',
      task: '<p>Research the <b>cost of 4 GB of RAM</b> today. What would it have cost last year? Investigate the price over the <b>last five years</b> and look at the price trend.</p>',
      fields: ['Cost of 4 GB of RAM today', 'Cost last year', 'The price over the last five years'],
      lines: 2,
      hint: 'What do you notice about the price trend?',
    },
  ],
});

FD.check({
  section: 'ram',
  items: [
    { type: 'mcq', q: 'What does RAM stand for?', opts: ['Random Access Memory', 'Read And Memorise', 'Rapid Access Media', 'Read Access Memory'], why: 'ROM stands for Read Only Memory.' },
    { type: 'mcq', q: 'Where is software loaded into RAM from?', opts: ['Secondary storage', 'The processor', 'ROM', 'The monitor'], why: 'The processor then fetches the instructions from memory and executes them.' },
    { type: 'tf', q: 'RAM keeps its data when the computer’s power is turned off.', a: false, why: 'RAM is volatile: data held in RAM is lost when the power is turned off.' },
    { type: 'mcq', q: 'What is virtual memory?', opts: ['An area of secondary storage used when there is not enough space in RAM', 'Extra RAM chips added to the motherboard', 'Memory inside the processor', 'A type of ROM'], why: 'It is much slower than RAM, so performance decreases.' },
    { type: 'multi', q: 'Which <b>two</b> are benefits of adding more RAM?', need: 2, opts: [['More programs can run at the same time', true], ['Less need for slow virtual memory', true], ['The computer keeps RAM data when the power is off', false], ['Files are stored permanently', false]], why: 'More RAM improves performance with multiple files or programs.' },
    { type: 'tf', q: 'A user can add as much RAM as they like to any computer.', a: false, why: 'Only up to the maximum supported by the computer and the operating system.' },
  ],
});
