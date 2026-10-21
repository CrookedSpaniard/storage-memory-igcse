FD.add({
  id: 'cpu',
  title: 'Processors',
  tab: 'Processors',
  icon: 'cpu',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['CPU', 'Central Processing Unit: carries out software instructions. In a processor with more than one CPU, each CPU is called a core.'],
    ['Processor cycle', 'The process of fetching a program instruction from memory, decoding the actions required by the instruction and then executing those actions.'],
    ['Clock cycles per second', 'Used to measure processor speed: the number of times per second the processor can carry out one or more instructions.'],
  ],
  mount(el) {
    const PROG = [['LOAD 5', 'Put the number 5 in the CPU', (v) => 5], ['ADD 3', 'Add 3 to it', (v) => v + 3], ['MULTIPLY 2', 'Multiply it by 2', (v) => v * 2], ['OUTPUT', 'Show the answer on the screen', (v) => v]];
    const HZ = [['Hertz', 'Hz', 1], ['Kilohertz', 'kHz', 1e3], ['Megahertz', 'MHz', 1e6], ['Gigahertz', 'GHz', 1e9]];
    const JOBS = 24;
    el.innerHTML = `
      <div class="sim cu">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="cyc">🔁 Processor cycle</button><button data-p="cores">🧩 Cores</button><button data-p="hz">⏱️ Clock speed</button><button data-p="ipc">⚖️ Work per cycle</button><button data-p="sand">🏗️ Working at different speeds</button>
        </div>

        <div data-panel="cyc" class="sim">
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Memory (RAM)</h5><ol class="cu-mem" id="mem">${PROG.map(([i]) => `<li class="mono">${i}</li>`).join('')}</ol></div>
            <div class="sim-box cu-chip"><h5 class="mw-h">CPU</h5>
              <div class="cu-stages"><span data-s="0">1 · Fetch</span><span data-s="1">2 · Decode</span><span data-s="2">3 · Execute</span></div>
              <p class="cu-cur mono" id="cur">–</p><p class="note" id="dec"></p>
              <div class="readout"><div class="ro"><small>Value in the CPU</small><b id="val">–</b></div><div class="ro"><small>Screen</small><b id="scr">–</b></div></div>
            </div>
          </div>
          <div class="chk-btns"><button class="btn primary" id="bCyc">▶ One processor cycle</button><button class="btn" id="bAll">⏩ Run the program</button><button class="btn ghost" id="bRst">↺ Reset</button></div>
        </div>

        <div data-panel="cores" class="sim" hidden>
          <div class="ctrls">
            <div class="seg" id="cSeg"><span class="seg-l">Cores</span><button data-v="1">Single-core</button><button data-v="2">Dual-core</button><button data-v="4">Quad-core</button></div>
            <div class="seg" id="gSeg"><span class="seg-l">Speed of each core</span><button data-v="2">2 GHz</button><button data-v="3">3 GHz</button><button data-v="4">4 GHz</button></div>
          </div>
          <div class="two-col">
            <div class="sim-box"><div class="cu-cores" id="coreBox"></div><div class="cu-jobs" id="jobs">${Array.from({ length: JOBS }, (_, i) => `<span class="cu-job" data-j="${i}"></span>`).join('')}</div></div>
            <div class="sim-box">
              <div class="readout"><div class="ro"><small>Processor cycles</small><b id="nCyc">0</b></div><div class="ro"><small>Time</small><b id="tCyc">–</b></div><div class="ro" id="roHeat"><small>Heat</small><b id="heat">–</b></div></div>
              <div class="cu-fan"><span id="fan">🌀</span><small id="fanT"></small></div>
              <button class="btn primary" id="bGo">▶ Do ${JOBS} jobs</button>
              <p class="note" id="cMsg"></p>
            </div>
          </div>
        </div>

        <div data-panel="hz" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box">
              <label class="rng"><span>Clock speed <output id="ghzO"></output></span><input type="range" id="ghz" min="0.5" max="5" step="0.1" value="3.2"></label>
              <p class="cu-big" id="cps"></p>
              <div class="cu-tick"><span id="tick"></span><small>one tick = one clock cycle (shown very slowly)</small></div>
            </div>
            <div class="sim-box"><table class="tbl cu-hz"><thead><tr><th>Name</th><th>Abbreviation</th><th>Clock cycles per second</th></tr></thead>
              <tbody>${HZ.map(([n, a, v], i) => `<tr data-i="${i}"><td>${n}</td><td>${a}</td><td>${v.toLocaleString('en-GB')}</td></tr>`).join('')}</tbody></table>
              <p class="note" id="hzMsg"></p></div>
          </div>
        </div>

        <div data-panel="ipc" class="sim" hidden>
          <div class="cu-ipc">${['A', 'B'].map((n) => `
            <div class="sim-box" data-cpu="${n}"><h5 class="mw-h">Processor ${n}</h5>
              <div class="seg" data-k="ghz"><span class="seg-l">Clock speed</span><button data-v="3">3 GHz</button><button data-v="4">4 GHz</button></div>
              <div class="seg" data-k="ipc"><span class="seg-l">Instructions per core in each cycle</span><button data-v="1">1</button><button data-v="2">2</button></div>
              <div class="fl-lane"><b>Progress</b><i><span data-bar></span></i><small data-t>–</small></div></div>`).join('')}</div>
          <button class="btn primary" id="bIpc">🏁 Run 12 billion instructions</button>
          <p class="verdict" id="ipcMsg"></p>
        </div>

        <div data-panel="sand" class="sim" hidden>
          <div class="seg" id="qSeg"><span class="seg-l">Question</span><button data-v="1">1 · By hand</button><button data-v="2">2 · Spoon or digger</button><button data-v="3">3 · Quad-core digger</button></div>
          <div class="sim-box cu-sand" id="sand"></div>
          <button class="btn primary" id="bSand">🏁 Start</button>
          <p class="verdict" id="sMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.cu'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;

    // ---- processor cycle ----
    let pc = 0, v = null;
    const stage = (s) => root.querySelectorAll('.cu-stages span').forEach((x) => x.classList.toggle('on', +x.dataset.s === s));
    function rst() { run++; pc = 0; v = null; stage(-1); $('#cur').textContent = '–'; $('#dec').textContent = ''; $('#val').textContent = '–'; $('#scr').textContent = '–'; root.querySelectorAll('#mem li').forEach((l) => l.classList.remove('on', 'done')); $('#bCyc').disabled = false; }
    async function cycle(id = run) {
      if (pc >= PROG.length) return false;
      const li = root.querySelectorAll('#mem li')[pc];
      $('#bCyc').disabled = true;
      stage(0); li.classList.add('on'); $('#cur').textContent = PROG[pc][0]; $('#dec').textContent = 'Fetching the instruction from memory…';
      await FD.wait(700); if (id !== run || dead) return false;
      stage(1); $('#dec').textContent = `Decoding: “${PROG[pc][1]}”.`;
      await FD.wait(800); if (id !== run || dead) return false;
      stage(2); v = PROG[pc][2](v); $('#val').textContent = v; if (PROG[pc][0] === 'OUTPUT') $('#scr').textContent = v;
      $('#dec').textContent = 'Executing the action.';
      FD.pulse($('#val'));
      await FD.wait(700); if (id !== run || dead) return false;
      li.classList.remove('on'); li.classList.add('done'); pc++;
      $('#bCyc').disabled = pc >= PROG.length;
      if (pc >= PROG.length) { stage(-1); $('#dec').textContent = 'Program finished: 4 instructions, 4 processor cycles.'; }
      return true;
    }
    $('#bCyc').addEventListener('click', () => cycle());
    async function runAll() { const id = run; while (pc < PROG.length && id === run && !dead) if (!(await cycle(id))) return; }
    $('#bAll').addEventListener('click', () => { if (pc >= PROG.length) rst(); runAll(); });
    $('#bRst').addEventListener('click', rst);

    // ---- cores ----
    let cores = 1, ghz = 4;
    function coresDraw() {
      FD.segSet($('#cSeg'), cores); FD.segSet($('#gSeg'), ghz);
      $('#coreBox').innerHTML = Array.from({ length: cores }, (_, i) => `<span class="cu-core">Core ${i + 1}<small>${ghz} GHz</small></span>`).join('');
      root.querySelectorAll('.cu-job').forEach((j) => j.classList.remove('done', 'c0', 'c1', 'c2', 'c3'));
      $('#nCyc').textContent = 0; $('#tCyc').textContent = '–';
      const heat = ghz * ghz * cores;           // a rough model: faster cores get much hotter
      const hot = ghz === 4 ? 'High' : ghz === 3 ? 'Medium' : 'Low';
      $('#heat').textContent = hot;
      $('#roHeat').className = 'ro ' + (hot === 'Low' ? 'good' : hot === 'High' ? 'bad' : '');
      $('#fan').style.animationDuration = (hot === 'High' ? 0.4 : hot === 'Medium' ? 0.9 : 2.2) + 's';
      $('#fanT').textContent = hot === 'High' ? 'Fan: loud' : hot === 'Medium' ? 'Fan: on' : 'Fan: quiet';
      $('#cMsg').textContent = '';
      return heat;
    }
    async function goCores() {
      const id = ++run;
      coresDraw();
      $('#bGo').disabled = true;
      const jobs = [...root.querySelectorAll('.cu-job')];
      let done = 0, n = 0;
      const tick = 800 / ghz;                    // slowed down: one cycle at 1 GHz = 0.8 s
      while (done < JOBS) {
        await FD.wait(tick);
        if (id !== run || dead) return;
        for (let c = 0; c < cores && done < JOBS; c++) { jobs[done].classList.add('done', 'c' + c); done++; }
        n++;
        $('#nCyc').textContent = n;
        $('#tCyc').textContent = `${(n / ghz).toFixed(1).replace('.0', '')} ns`;
      }
      $('#bGo').disabled = false;
      $('#cMsg').innerHTML = `${cores === 1 ? 'One core' : `${cores} cores`} at ${ghz} GHz finished in <b>${n} cycles</b> (${(n / ghz).toFixed(1).replace('.0', '')} nanoseconds).`;
    }
    $('#cSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { run++; cores = +b.dataset.v; coresDraw(); $('#bGo').disabled = false; } });
    $('#gSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { run++; ghz = +b.dataset.v; coresDraw(); $('#bGo').disabled = false; } });
    $('#bGo').addEventListener('click', goCores);
    function setCores(c, g) { run++; cores = c; ghz = g; coresDraw(); $('#bGo').disabled = false; }

    // ---- clock speed ----
    let tickT = null;
    function hz(g) {
      $('#ghz').value = g;
      $('#ghzO').textContent = `${g} GHz`;
      $('#cps').innerHTML = `${g} GHz = <b>${Math.round(g * 1e9).toLocaleString('en-GB')}</b> clock cycles per second<br><small>= ${(g * 1000).toLocaleString('en-GB')} MHz = ${(g * 1e6).toLocaleString('en-GB')} kHz</small>`;
      root.querySelectorAll('.cu-hz tr[data-i]').forEach((r) => r.classList.toggle('on', +r.dataset.i === 3));
      $('#hzMsg').innerHTML = 'Each unit is <b>1000 times</b> bigger than the one before. 1 GHz = 1000 MHz = 1,000,000,000 Hz.';
      $('#tick').style.animationDuration = (2.4 / g) + 's';
    }
    $('#ghz').addEventListener('input', (e) => hz(+e.target.value));
    async function hzDemo(ctx) { for (const g of [1, 2, 3.2]) { hz(g); if (!(await ctx.sleep(1200))) return; } }

    // ---- work per cycle ----
    const cfg = { A: { ghz: 4, ipc: 1 }, B: { ghz: 3, ipc: 2 } };
    function ipcDraw() {
      ['A', 'B'].forEach((n) => { const box = root.querySelector(`[data-cpu="${n}"]`); box.querySelectorAll('.seg').forEach((s) => FD.segSet(s, cfg[n][s.dataset.k])); box.querySelector('[data-bar]').style.width = 0; box.querySelector('[data-t]').textContent = '–'; });
      $('#ipcMsg').className = 'verdict'; $('#ipcMsg').textContent = '';
    }
    root.querySelectorAll('[data-cpu]').forEach((box) => box.addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; run++; cfg[box.dataset.cpu][b.closest('.seg').dataset.k] = +b.dataset.v; ipcDraw(); $('#bIpc').disabled = false; }));
    async function ipcRace() {
      const id = ++run;
      ipcDraw();
      $('#bIpc').disabled = true;
      const t = (n) => 12 / (cfg[n].ghz * cfg[n].ipc);        // seconds for 12 billion instructions
      const tA = t('A'), tB = t('B'), tMax = Math.max(tA, tB);
      await FD.tween(2600, (k) => {
        if (id !== run) return;
        ['A', 'B'].forEach((n) => { const f = Math.min(1, (k * tMax) / t(n)); const box = root.querySelector(`[data-cpu="${n}"]`); box.querySelector('[data-bar]').style.width = f * 100 + '%'; if (f >= 1) box.querySelector('[data-t]').textContent = `${t(n).toFixed(1).replace('.0', '')} s`; });
      });
      if (id !== run || dead) return;
      $('#bIpc').disabled = false;
      const win = tA === tB ? null : tA < tB ? 'A' : 'B';
      $('#ipcMsg').className = 'verdict good';
      $('#ipcMsg').innerHTML = win ? `Processor <b>${win}</b> wins${cfg[win].ghz < cfg[win === 'A' ? 'B' : 'A'].ghz ? ' — even with the <b>slower clock speed</b>, because it does more work in each cycle' : ''}.` : 'A draw: they do the same amount of work per second.';
    }
    $('#bIpc').addEventListener('click', ipcRace);

    // ---- sand: working at different speeds ----
    const PILE = 1000;
    const SAND = {
      1: [['🧍 Person A', 100, 1, 'by hand'], ['🧍 Person B', 10, 1, 'by hand']],
      2: [['🥄 Person A', 100, 1, 'spoon'], ['🚜 Person B', 10, 50, 'digger']],
      3: [['🥄 Person A', 100, 1, 'spoon'], ['🚜 Person B', 10, 50, 'digger'], ['🚜×4 Person C', 10, 200, 'quad-core digger: 4 buckets']],
    };
    let q = 1;
    function sandDraw() {
      FD.segSet($('#qSeg'), q);
      $('#sand').innerHTML = SAND[q].map(([n, per, amt, how], i) => `<div class="cu-lane" data-i="${i}"><b>${n}</b><small>${per} moves per hour · ${how}</small><i class="cu-pile"><span></span></i><small data-t>–</small></div>`).join('');
      $('#sMsg').className = 'verdict'; $('#sMsg').textContent = '';
    }
    async function sand() {
      const id = ++run;
      sandDraw();
      $('#bSand').disabled = true;
      const L = SAND[q], hrs = L.map(([, per, amt]) => PILE / (per * amt)), hMax = Math.max(...hrs);
      const lanes = [...root.querySelectorAll('.cu-lane')];
      await FD.tween(3000, (k) => {
        if (id !== run) return;
        lanes.forEach((ln, i) => { const f = Math.min(1, (k * hMax) / hrs[i]); ln.querySelector('.cu-pile span').style.width = (1 - f) * 100 + '%'; if (f >= 1) ln.querySelector('[data-t]').textContent = `${hrs[i] < 1 ? hrs[i] * 60 + ' min' : hrs[i] + ' h'}`; });
      });
      if (id !== run || dead) return;
      $('#bSand').disabled = false;
      $('#sMsg').className = 'verdict good';
      $('#sMsg').innerHTML = q === 1 ? '<b>Person A</b> finishes first: more moves per hour = a <b>faster clock speed</b>.'
        : q === 2 ? '<b>Person B</b> finishes first: fewer moves per hour, but much <b>more sand each time</b> = more work in each clock cycle.'
          : '<b>Person C</b> finishes first: the same rate as B, but <b>four buckets</b> work at once, like a <b>quad-core</b> processor.';
    }
    $('#qSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { run++; q = +b.dataset.v; sandDraw(); $('#bSand').disabled = false; } });
    $('#bSand').addEventListener('click', sand);

    rst(); coresDraw(); hz(3.2); ipcDraw(); sandDraw();
    const showP = FD.panels(root, () => { run++; root.querySelectorAll('#bGo, #bIpc, #bSand, #bCyc').forEach((b) => { b.disabled = false; }); });
    showP('cyc');
    return {
      show: showP, rst, runAll, setCores, goCores, hz, hzDemo, ipcRace,
      setIpc(a, b) { Object.assign(cfg.A, a); Object.assign(cfg.B, b); ipcDraw(); },
      setQ(n) { q = n; sandDraw(); }, sand,
      destroy() { dead = true; run++; clearTimeout(tickT); },
    };
  },
  steps: [
    {
      title: 'Processors and cores',
      text: `<p>A processor is made up of one or more <strong>Central Processing Units (CPUs)</strong>. These carry out software instructions.</p>
             <p>In processors that are made up of more than one CPU, each CPU is called a <strong>core</strong>.</p>`,
      async on(a) { a.show('cores'); a.setCores(4, 3); },
    },
    {
      title: 'The processor cycle',
      text: `<p>In each <strong>processor cycle</strong> the CPU:</p>
             <ol><li><b>fetches</b> a program instruction from memory</li><li><b>decodes</b> the actions required by the instruction</li><li><b>executes</b> those actions.</li></ol>`,
      tip: 'Try it: run the program one cycle at a time.',
      async on(a, ctx) { a.show('cyc'); a.rst(); if (await ctx.sleep(500)) await a.runAll(); },
    },
    {
      title: 'Quad-core processors',
      text: `<p>In a <strong>quad-core</strong> processor, <b>four cores</b> are working during each processor cycle.</p>
             <p>This means it can do <b>up to four times as much work</b> as a single-core processor.</p>`,
      tip: 'Try it: compare single-core and quad-core at the same speed.',
      async on(a, ctx) { a.show('cores'); a.setCores(1, 4); await a.goCores(); if (await ctx.sleep(800)) { a.setCores(4, 4); await a.goCores(); } },
    },
    {
      title: 'Slower cores, less heat',
      text: `<p>In multi-core processors, <b>each core can run more slowly</b> than in a single-core processor.</p>
             <p>This <b>saves energy</b> and produces <b>less heat</b>, so the processor needs less cooling: the computer is <b>quieter</b>, more <b>environmentally friendly</b>, and mobile devices get a longer <b>battery life</b>.</p>`,
      tip: 'Try it: a quad-core at 2 GHz against a single-core at 4 GHz. Look at the heat and the fan.',
      async on(a, ctx) { a.show('cores'); a.setCores(1, 4); await a.goCores(); if (await ctx.sleep(800)) { a.setCores(4, 2); await a.goCores(); } },
    },
    {
      title: 'Clock speed',
      text: `<p>Processor speed is measured in <strong>clock cycles per second</strong>: the number of times per second the processor can carry out one or more instructions.</p>
             <p>Clock cycles are measured in <strong>hertz (Hz)</strong>, <strong>kilohertz (kHz)</strong>, <strong>megahertz (MHz)</strong> and <strong>gigahertz (GHz)</strong>.</p>`,
      tip: 'Try it: move the slider. 1 GHz = 1,000,000,000 clock cycles per second.',
      async on(a, ctx) { a.show('hz'); await a.hzDemo(ctx); },
    },
    {
      title: 'Not just clock speed',
      text: `<p>Clock cycles measure processing speed, but other factors affect how much work a processor can do in a given time.</p>
             <p>A user should also consider the <strong>amount of work a CPU can do in each clock cycle</strong>: different processors carry out more instructions per core in each cycle.</p>`,
      tip: 'Try it: can a 3 GHz processor beat a 4 GHz one?',
      async on(a) { a.show('ipc'); a.setIpc({ ghz: 4, ipc: 1 }, { ghz: 3, ipc: 2 }); await a.ipcRace(); },
    },
    {
      title: 'Working at different speeds',
      text: `<p>Think of processing speeds as people moving a pile of sand.</p>
             <p>Moving <b>more times per hour</b> is like a faster <b>clock speed</b>. Moving <b>more sand each time</b> is like doing <b>more work per cycle</b>. Using <b>four buckets at once</b> is like a <b>quad-core</b> processor.</p>`,
      tip: 'The fastest does not always finish first. Try the three questions, then answer them in the Activities.',
      async on(a) { a.show('sand'); a.setQ(2); await a.sand(); },
    },
  ],
});

FD.activities({
  section: 'cpu',
  items: [
    {
      id: 'cpu-sand',
      title: 'Working at different speeds',
      task: `<p>Two people are each moving a large pile of sand by hand. <b>Person A</b> can move 100 portions every hour. <b>Person B</b> can move 10 portions every hour.</p>
             <p>Then Person A uses a <b>spoon</b> and Person B a <b>digger</b>. Then Person C uses a digger at the same rate as Person B, but with <b>four buckets</b> (a ‘quad-core digger’).</p>`,
      fields: ['1 · Who will finish first: Person A or Person B? Why?', '2 · With a spoon and a digger, who will finish first now? Why?', '3 · Who will finish first with the quad-core digger? Why?', 'What does each part of the story stand for in a processor?'],
      lines: 2,
      sim: ['cpu', 'Try the sand race again'],
    },
  ],
});

FD.check({
  section: 'cpu',
  items: [
    { type: 'mcq', q: 'In a processor with more than one CPU, what is each CPU called?', opts: ['A core', 'A cycle', 'A platter', 'A bit'], why: 'For example, a quad-core processor has four cores.' },
    { type: 'sort', q: 'Put the processor cycle in order.', bins: ['1st', '2nd', '3rd'], rows: [['Fetch the instruction from memory', 0], ['Decode the actions required', 1], ['Execute those actions', 2]], why: 'Fetch → decode → execute.' },
    { type: 'mcq', q: 'A quad-core processor can do up to…', opts: ['four times as much work as a single-core processor', 'four times less work than a single-core processor', 'the same work as a single-core processor', 'forty times as much work'], why: 'Four cores work during each processor cycle.' },
    { type: 'mcq', q: 'Processor speed is measured in…', opts: ['clock cycles per second', 'revolutions per minute', 'lumens', 'bytes'], why: 'In Hz, kHz, MHz and GHz.' },
    { type: 'mcq', q: 'How many clock cycles per second is 1 GHz?', opts: ['1,000,000,000', '1,000,000', '1000', '1024'], why: 'Table 3.2: kHz = 1000, MHz = 1,000,000, GHz = 1,000,000,000.' },
    { type: 'tf', q: 'The processor with the higher clock speed always does the most work.', a: false, why: 'You should also consider the amount of work a CPU can do in each clock cycle.' },
  ],
});
