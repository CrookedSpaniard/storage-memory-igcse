FD.add({
  id: 'flash',
  title: 'Flash memory',
  tab: 'Flash',
  icon: 'flash',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['Flash memory', 'A type of EEPROM. It is non-volatile, has no moving parts, a fast access time and low power consumption.'],
    ['SSD', 'Solid state drive: secondary storage that uses flash memory.'],
  ],
  mount(el) {
    const CH = [
      ['🧩', 'A type of EEPROM', 'It can be erased electrically and rewritten.'],
      ['🔒', 'Non-volatile', 'Like other types of ROM, it keeps data when the power is off.'],
      ['🚫⚙️', 'No moving parts', 'Nothing spins and no head moves…'],
      ['⚡', 'Fast access time', '…so data is found almost at once…'],
      ['🔋', 'Low power consumption', '…and it uses very little energy.'],
    ];
    const DEV = [
      ['💻', 'Laptop SSD', 'Laptops often rely on internal batteries for their power, so low power consumption matters.', [4, 3]],
      ['🔌', 'USB drive', 'Removable storage you carry around: no moving parts, non-volatile.', [1, 2]],
      ['📷', 'SD card', 'Removable storage in cameras and phones: small, non-volatile, low power.', [1, 4]],
      ['📱', 'Smartphone', 'Runs on a battery and gets dropped: low power, fast, no moving parts.', [2, 3, 4]],
    ];
    el.innerHTML = `
      <div class="sim fl">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="ch">⚡ Characteristics</button><button data-p="race">🏁 Fast access</button><button data-p="use">📱 Where is it used?</button>
        </div>
        <div data-panel="ch" class="sim">
          <div class="fl-chain">${CH.map(([e, n, d], i) => `<div class="mini fl-c" data-i="${i}"><h5>${e} ${n}</h5><p>${d}</p></div>`).join('<span class="fl-arr" aria-hidden="true">→</span>')}</div>
        </div>
        <div data-panel="race" class="sim" hidden>
          <div class="sim-box fl-race">
            <div class="fl-lane"><b>🗄️ Hard disk</b><i><span id="lH"></span></i><small id="tH">–</small></div>
            <div class="fl-lane"><b>⚡ Flash (SSD)</b><i><span id="lF"></span></i><small id="tF">–</small></div>
            <button class="btn primary" id="bRace">🏁 Open a file</button>
            <p class="note">Slowed down 100 times. The hard disk must move its head and wait for the platter to spin; flash memory has no moving parts.</p>
          </div>
        </div>
        <div data-panel="use" class="sim" hidden>
          <div class="fl-devs">${DEV.map(([e, n], i) => `<button class="sim-box fl-dev" data-i="${i}" aria-pressed="false"><span>${e}</span><b>${n}</b></button>`).join('')}</div>
          <p class="verdict" id="uMsg"></p>
          <div class="fl-tags" id="tags">${CH.map(([e, n], i) => `<span class="pill" data-i="${i}">${e} ${n}</span>`).join('')}</div>
        </div>
      </div>`;
    const root = el.querySelector('.fl'), $ = (s) => root.querySelector(s);
    let dead = false;
    const cards = [...root.querySelectorAll('.fl-c')];
    const hot = (list) => cards.forEach((c) => { c.classList.toggle('hot', list.includes(+c.dataset.i)); c.classList.toggle('off', list.length > 0 && !list.includes(+c.dataset.i)); });
    cards.forEach((c) => c.addEventListener('click', () => hot([+c.dataset.i])));
    async function chain(ctx) { for (let i = 0; i < CH.length; i++) { hot([i]); if (!(await ctx.sleep(1100))) return; } hot([]); }

    async function race() {
      $('#bRace').disabled = true;
      $('#lH').style.width = 0; $('#lF').style.width = 0; $('#tH').textContent = '…'; $('#tF').textContent = '…';
      const hd = 8 + Math.random() * 8, fl = 0.1;
      const t0 = performance.now();
      await FD.tween(hd * 100, (k) => {
        $('#lH').style.width = k * 100 + '%';
        const f = Math.min(1, ((performance.now() - t0) * FD.speed) / (fl * 100 + 120));
        $('#lF').style.width = f * 100 + '%';
        if (f >= 1) $('#tF').textContent = '≈ 0.1 ms';
      });
      if (dead) return;
      $('#tH').textContent = `≈ ${hd.toFixed(0)} ms`;
      $('#bRace').disabled = false;
    }
    $('#bRace').addEventListener('click', race);

    function dev(i) {
      root.querySelectorAll('.fl-dev').forEach((b) => { const on = +b.dataset.i === i; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      $('#uMsg').className = 'verdict good';
      $('#uMsg').innerHTML = `<b>${DEV[i][1]}:</b> ${DEV[i][2]}`;
      root.querySelectorAll('#tags .pill').forEach((p) => p.classList.toggle('g', DEV[i][3].includes(+p.dataset.i)));
    }
    root.querySelectorAll('.fl-dev').forEach((b) => b.addEventListener('click', () => dev(+b.dataset.i)));
    async function devTour(ctx, list) { for (const i of list) { dev(i); if (!(await ctx.sleep(1600))) return; } }

    const showP = FD.panels(root);
    showP('ch');
    return { show: showP, hot, chain, race, dev, devTour, destroy() { dead = true; } };
  },
  steps: [
    {
      title: 'Flash memory is a type of EEPROM',
      text: `<p><strong>Flash memory</strong> is a type of <b>EEPROM</b>.</p>
             <p>Like other types of ROM, it is <strong>non-volatile</strong>: it keeps its data when the power is turned off.</p>`,
      async on(a) { a.show('ch'); a.hot([0, 1]); },
    },
    {
      title: 'No moving parts',
      text: `<p>Flash memory does <strong>not have any moving parts</strong>.</p>
             <p>So it has a <strong>fast access time</strong> and <strong>low power consumption</strong>.</p>`,
      tip: 'Try it: race a hard disk against flash memory.',
      async on(a) { a.show('race'); await a.race(); },
    },
    {
      title: 'SSDs in portable devices',
      text: `<p>Because of its <b>low power consumption</b>, flash memory is used in the <strong>SSDs</strong> of portable devices such as <b>laptop computers</b>.</p>
             <p>These devices often rely on <b>internal batteries</b> for their power.</p>`,
      async on(a, ctx) { a.show('use'); await a.devTour(ctx, [0, 3]); },
    },
    {
      title: 'Removable storage',
      text: `<p>Flash memory is often used as <strong>removable storage</strong> in <b>USB drives</b> and <b>SD cards</b>.</p>`,
      tip: 'Try it: click each device to see which characteristics matter.',
      async on(a, ctx) { a.show('use'); await a.devTour(ctx, [1, 2]); },
    },
    {
      title: 'Putting it together',
      text: `<p>In the exam, link each <b>characteristic</b> to a <b>reason</b>:</p>
             <ul><li>no moving parts → fast access time / not damaged when dropped</li><li>low power consumption → longer battery life</li><li>non-volatile → keeps apps and photos when switched off.</li></ul>`,
      async on(a, ctx) { a.show('ch'); await a.chain(ctx); },
    },
  ],
});

FD.check({
  section: 'flash',
  items: [
    { type: 'mcq', q: 'Flash memory is a type of…', opts: ['EEPROM', 'RAM', 'magnetic tape', 'optical media'], why: 'Like other types of ROM, it is non-volatile.' },
    { type: 'multi', q: 'Which <b>three</b> are characteristics of flash memory?', need: 3, opts: [['No moving parts', true], ['Fast access time', true], ['Low power consumption', true], ['Volatile', false], ['Uses a laser', false]], why: 'No moving parts gives a fast access time and low power consumption.' },
    { type: 'mcq', q: 'Why is flash memory used in the SSDs of laptop computers?', opts: ['Its low power consumption suits devices that rely on batteries', 'It has the lowest cost per GB', 'It is volatile', 'It spins at 7200 rpm'], why: 'Portable devices often rely on internal batteries for their power.' },
    { type: 'multi', q: 'Where is flash memory often used as removable storage? Choose <b>two</b>.', need: 2, opts: [['USB drives', true], ['SD cards', true], ['Blu-ray disks', false], ['Magnetic tape', false]], why: 'USB drives and SD cards.' },
  ],
});
