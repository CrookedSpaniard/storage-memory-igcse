FD.add({
  id: 'rom',
  title: 'ROM and RAM compared',
  tab: 'ROM',
  icon: 'rom',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['ROM', 'Read Only Memory: stores data permanently. It is non-volatile.'],
    ['Boot', 'Start up.'],
    ['Firmware', 'A type of software that controls a hardware device.'],
  ],
  mount(el) {
    // name, full name, how it is written, can erase with
    const CHIPS = [
      ['ROM', 'Mask Programmed Read Only Memory', 'Written when it is manufactured. It cannot be changed after manufacture.', null],
      ['PROM', 'Programmable Read Only Memory', 'Manufactured with the ability to be written to, but it can only be written to once.', null],
      ['EPROM', 'Erasable Programmable Read Only Memory', 'Can be erased by exposing it to strong ultraviolet (UV) light, then rewritten.', 'uv'],
      ['EEPROM', 'Electrically Erasable Programmable Read Only Memory', 'Erased by applying a voltage to one of the pins on the chip, so it does not have to be removed.', 'volt'],
    ];
    const SINGLE = [['🧮', 'Calculator'], ['⌚', 'Digital watch'], ['🫧', 'Washing machine']];
    const T31 = [['Stores data when power off?', 'No (volatile)', 'Yes (non-volatile)'], ['Can swap instructions in and out?', 'Yes', 'No'], ['Accessible in any order?', 'Yes', 'Yes'], ['Intended to store…', 'Temporary data', 'Permanent data'], ['Can be upgraded?', 'Yes', 'No']];
    el.innerHTML = `
      <div class="sim ro-s">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="boot">🔌 Uses of ROM</button><button data-p="chips">🧪 ROM, PROM, EPROM, EEPROM</button><button data-p="fw">⬆️ Updating firmware</button><button data-p="t31">⚖️ RAM vs ROM</button>
        </div>

        <div data-panel="boot" class="sim">
          <div class="two-col">
            <div class="sim-box"><h5 class="mw-h">Single purpose computers</h5><p class="note">They store only one program, in ROM.</p>
              <div class="ro-single">${SINGLE.map(([e, n]) => `<div class="mini"><h5>${e} ${n}</h5><p>Program in ROM</p></div>`).join('')}</div></div>
            <div class="sim-box"><h5 class="mw-h">General purpose computers (PCs, laptops)</h5>
              <div class="ro-boot" id="bootSteps">
                <span data-b="0">⏻ Power on</span><span data-b="1">🧩 ROM: boot instructions</span><span data-b="2">💾 Load the operating system from storage…</span><span data-b="3">🧠 …into RAM</span><span data-b="4">🖥️ Ready!</span>
              </div>
              <button class="btn primary" id="bBoot">⏻ Switch on</button></div>
          </div>
          <p class="verdict" id="bMsg"></p>
        </div>

        <div data-panel="chips" class="sim" hidden>
          <div class="ro-chips">${CHIPS.map(([n, f, how], i) => `
            <div class="sim-box ro-chip" data-i="${i}">
              <div class="ro-ic"><svg viewBox="0 0 80 50" aria-hidden="true"><rect class="ro-body" x="14" y="6" width="52" height="38" rx="4"/>${[0, 1, 2, 3].map((k) => `<path class="ro-pin" d="M${20 + k * 12} 6v-5M${20 + k * 12} 44v5"/>`).join('')}${i === 2 ? '<circle class="ro-win" cx="40" cy="25" r="9"/>' : ''}<text x="40" y="29" class="ro-n">${n}</text></svg></div>
              <b>${f}</b>
              <div class="ro-data"><span class="mono" data-d></span></div>
              <div class="ro-acts"><button class="btn" data-a="write">✏️ Write</button><button class="btn" data-a="uv">🟣 UV light</button><button class="btn" data-a="volt">⚡ Voltage</button></div>
              <p class="note" data-m>${how}</p>
            </div>`).join('')}</div>
        </div>

        <div data-panel="fw" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box ro-dev"><span class="ro-e">🎮</span><b>Games console</b><small>Firmware in EEPROM: <b id="fwV">version 1.0</b></small><div class="rm-meter"><i id="fwBar"></i></div><p class="note" id="fwStep">Up to date? A new version 2.0 is available.</p></div>
            <div class="sim-box"><button class="btn primary" id="bFw">⬆️ Update the firmware</button>
              <p class="note">The process of <b>erasing and rewriting</b> the contents of EPROM or EEPROM is used when updating the <b>firmware</b> for a device. EEPROM later developed into <b>flash memory</b>.</p></div>
          </div>
        </div>

        <div data-panel="t31" class="sim" hidden>
          <p class="note">Table 3.1. Click a row to reveal the answers.</p>
          <table class="tbl ro-t"><thead><tr><th></th><th>RAM</th><th>ROM (all types)</th></tr></thead>
            <tbody>${T31.map(([q, a, b], r) => `<tr data-r="${r}"><th><button class="link-btn">${q}</button></th><td><span>${a}</span></td><td><span>${b}</span></td></tr>`).join('')}</tbody></table>
          <div class="chk-btns"><button class="btn" id="bAll">Show all</button><button class="btn ghost" id="bHide">Hide all</button></div>
        </div>
      </div>`;
    const root = el.querySelector('.ro-s'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- boot ----
    async function boot() {
      const steps = [...root.querySelectorAll('#bootSteps span')];
      steps.forEach((s) => s.classList.remove('on'));
      $('#bBoot').disabled = true;
      $('#bMsg').className = 'verdict'; $('#bMsg').textContent = '';
      for (const s of steps) { s.classList.add('on'); await FD.wait(750); if (dead) return; }
      $('#bBoot').disabled = false;
      $('#bMsg').className = 'verdict good';
      $('#bMsg').innerHTML = 'ROM <b>booted</b> (started up) the system and loaded the operating system from secondary storage.';
    }
    $('#bBoot').addEventListener('click', boot);

    // ---- chips ----
    const st = CHIPS.map((c, i) => ({ data: i === 0 ? 'FACTORY PROGRAM' : '(blank)', writes: 0 }));
    function chipDraw(i, msg, cls = '') {
      const card = root.querySelector(`.ro-chip[data-i="${i}"]`);
      card.querySelector('[data-d]').textContent = st[i].data;
      if (msg) { const m = card.querySelector('[data-m]'); m.innerHTML = msg; m.className = 'note ' + cls; }
    }
    function act(i, a) {
      const s = st[i], [n, , , erase] = CHIPS[i];
      const card = root.querySelector(`.ro-chip[data-i="${i}"]`);
      if (a === 'write') {
        if (i === 0) { FD.shake(card); return chipDraw(i, '✗ ROM cannot be changed after manufacture.', 'bad-t'); }
        if (s.data !== '(blank)') { FD.shake(card); return chipDraw(i, i === 1 ? '✗ PROM can only be written to <b>once</b>.' : `✗ Erase the ${n} first, then rewrite it.`, 'bad-t'); }
        s.writes++; s.data = `PROGRAM v${s.writes}.0`;
        return chipDraw(i, `✓ Written: ${s.data}.`, 'good-t');
      }
      if (erase !== a) {
        FD.shake(card);
        if (!erase) return chipDraw(i, `✗ ${n} cannot be erased.`, 'bad-t');
        return chipDraw(i, erase === 'uv' ? '✗ EPROM is erased with strong <b>ultraviolet light</b>, not voltage.' : '✗ EEPROM is erased by applying a <b>voltage</b> to one of its pins.', 'bad-t');
      }
      card.classList.add(a === 'uv' ? 'uv' : 'volt');
      setTimeout(() => card.classList.remove('uv', 'volt'), FD.dur(900));
      s.data = '(blank)';
      return chipDraw(i, a === 'uv' ? '✓ Erased by the UV light. It can be rewritten.' : '✓ Erased electrically — without removing the chip. It can be rewritten.', 'good-t');
    }
    root.querySelectorAll('.ro-chip').forEach((c) => c.querySelector('.ro-acts').addEventListener('click', (e) => { const b = e.target.closest('button[data-a]'); if (b) act(+c.dataset.i, b.dataset.a); }));
    function resetChips() { st.forEach((s, i) => { s.data = i === 0 ? 'FACTORY PROGRAM' : '(blank)'; s.writes = 0; chipDraw(i, CHIPS[i][2]); }); }
    const focusChips = (list) => root.querySelectorAll('.ro-chip').forEach((c) => c.classList.toggle('dim', !list.includes(+c.dataset.i)));
    async function chipDemo(ctx, plan) { for (const [i, a] of plan) { if (!(await ctx.sleep(1100))) return; act(i, a); } }

    // ---- firmware ----
    let ver = 1;
    async function update() {
      $('#bFw').disabled = true;
      $('#fwStep').textContent = 'Erasing the old firmware (voltage on a pin)…';
      await FD.tween(1100, (k) => { $('#fwBar').style.width = 50 * k + '%'; });
      if (dead) return;
      $('#fwStep').textContent = 'Writing the new firmware…';
      await FD.tween(1100, (k) => { $('#fwBar').style.width = 50 + 50 * k + '%'; });
      ver++;
      $('#fwV').textContent = `version ${ver}.0`;
      $('#fwStep').innerHTML = `✓ Updated to version ${ver}.0. Firmware is the software that controls this hardware device.`;
      $('#bFw').disabled = false;
    }
    $('#bFw').addEventListener('click', update);

    // ---- Table 3.1 ----
    const trs = [...root.querySelectorAll('.ro-t tbody tr')];
    const reveal = (r, on = true) => trs[r].classList.toggle('show', on);
    trs.forEach((t) => t.addEventListener('click', () => reveal(+t.dataset.r, !t.classList.contains('show'))));
    $('#bAll').addEventListener('click', () => trs.forEach((t, r) => reveal(r)));
    $('#bHide').addEventListener('click', () => trs.forEach((t, r) => reveal(r, false)));

    resetChips();
    const showP = FD.panels(root);
    showP('boot');
    return {
      show: showP, boot, resetChips, focusChips, chipDemo, update,
      single(on) { root.querySelectorAll('.ro-single .mini').forEach((m) => m.classList.toggle('hot', on)); },
      async tableDemo(ctx) { trs.forEach((t, r) => reveal(r, false)); for (let r = 0; r < trs.length; r++) { if (!(await ctx.sleep(900))) return; reveal(r); } },
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Read Only Memory (ROM)',
      text: `<p><strong>ROM</strong> stores data <b>permanently</b>. Unlike RAM, ROM is <strong>non-volatile</strong>: data is not lost when the power is turned off.</p>
             <p>ROM is used in computer systems that store only one program (<strong>single purpose computers</strong>), such as calculators, digital watches and washing machines.</p>`,
      async on(a) { a.show('boot'); a.single(true); },
    },
    {
      title: 'Booting the system',
      text: `<p><strong>General purpose computers</strong>, such as home PCs and laptops, also use ROM to <strong>boot</strong> (start up) the system and load the operating system from secondary storage.</p>`,
      tip: 'Try it: switch the computer on.',
      async on(a) { a.show('boot'); a.single(false); await a.boot(); },
    },
    {
      title: 'ROM and PROM',
      text: `<p><strong>ROM</strong> generally means memory that <b>cannot be changed after manufacture</b>. Its full name is <b>Mask Programmed Read Only Memory</b>.</p>
             <p><strong>PROM</strong> stands for <b>Programmable</b> Read Only Memory. It is manufactured with the ability to be written to, but it can only be written to <b>once</b>.</p>`,
      tip: 'Try it: try to write to each chip twice.',
      async on(a, ctx) { a.show('chips'); a.resetChips(); a.focusChips([0, 1]); await a.chipDemo(ctx, [[0, 'write'], [1, 'write'], [1, 'write']]); },
    },
    {
      title: 'EPROM and EEPROM',
      text: `<p>The computer cannot swap instructions in and out of ROM, but some types of ROM can be <b>updated</b>:</p>
             <ul><li><strong>EPROM</strong> (<b>Erasable Programmable</b> ROM) is erased by exposing it to strong <b>ultraviolet (UV) light</b>.</li><li><strong>EEPROM</strong> (<b>Electrically Erasable Programmable</b> ROM) is erased by applying a <b>voltage</b> to one of the pins, so you do not have to remove the chip.</li></ul>`,
      tip: 'Try it: write, erase and rewrite each chip.',
      async on(a, ctx) { a.show('chips'); a.resetChips(); a.focusChips([2, 3]); await a.chipDemo(ctx, [[2, 'write'], [2, 'uv'], [3, 'write'], [3, 'volt'], [3, 'write']]); },
    },
    {
      title: 'Updating firmware',
      text: `<p>Erasing and rewriting the contents of EPROM or EEPROM is used when updating the <strong>firmware</strong> for a device: the software that controls a hardware device.</p>
             <p>EEPROM later developed into <strong>flash memory</strong>.</p>`,
      tip: 'Try it: update the console’s firmware.',
      async on(a) { a.show('fw'); await a.update(); },
    },
    {
      title: 'Differences between RAM and ROM',
      text: `<p>Table 3.1 compares the characteristics of RAM and ROM.</p>
             <p>RAM: volatile, swaps instructions in and out, stores <b>temporary</b> data, can be upgraded. ROM: non-volatile, cannot swap instructions, stores <b>permanent</b> data, cannot be upgraded. Both can be accessed in any order.</p>`,
      tip: 'Try it: cover the answers and test yourself row by row.',
      async on(a, ctx) { a.show('t31'); await a.tableDemo(ctx); },
    },
  ],
});

FD.activities({
  section: 'rom',
  items: [
    {
      id: 'rom-prom',
      title: 'Using different types of ROM · 1',
      task: '<p>List <b>five</b> digital devices that use <b>PROM</b> that do not need to be edited.</p>',
      fields: ['Device 1', 'Device 2', 'Device 3', 'Device 4', 'Device 5'],
      lines: 1,
    },
    {
      id: 'rom-eeprom',
      title: 'Using different types of ROM · 2',
      task: '<p>List <b>five</b> digital devices that use <b>EPROM or EEPROM</b> that can be edited.</p>',
      fields: ['Device 1', 'Device 2', 'Device 3', 'Device 4', 'Device 5'],
      lines: 1,
      hint: 'What is edited in these devices, and why?',
    },
  ],
});

FD.check({
  section: 'rom',
  items: [
    { type: 'mcq', q: 'What does ROM stand for?', opts: ['Read Only Memory', 'Random Only Memory', 'Run On Memory', 'Read Open Media'], why: 'ROM stores data permanently.' },
    { type: 'mcq', q: 'What do general purpose computers use ROM for?', opts: ['To boot the system and load the operating system from storage', 'To store the user’s documents', 'As virtual memory', 'To run several programs at once'], why: 'Boot means start up.' },
    { type: 'sort', q: 'Which type of ROM is each one?', bins: ['ROM', 'PROM', 'EPROM', 'EEPROM'], rows: [['Cannot be changed after manufacture', 0], ['Can be written to only once', 1], ['Erased with strong ultraviolet light', 2], ['Erased by applying a voltage to a pin', 3]], why: 'EEPROM later developed into flash memory.' },
    { type: 'mcq', q: 'What is firmware?', opts: ['A type of software that controls a hardware device', 'A hard, physical part of a computer', 'A type of RAM', 'A storage media'], why: 'Firmware is updated by erasing and rewriting EPROM or EEPROM.' },
    { type: 'sort', q: 'RAM or ROM? (Table 3.1)', bins: ['RAM', 'ROM'], rows: [['Volatile', 0], ['Intended to store permanent data', 1], ['Can swap instructions in and out', 0], ['Cannot be upgraded', 1]], why: 'Both RAM and ROM can be accessed in any order.' },
  ],
});
