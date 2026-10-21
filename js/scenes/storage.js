FD.add({
  id: 'storage',
  title: 'Secondary storage',
  tab: 'Storage',
  icon: 'storage',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['Volatile', 'Likely to change, especially quickly or unpredictably. Volatile memory loses its data when the power is off.'],
    ['Virtual memory', 'Space on a computer for storing instructions and programs until they are needed or being used.'],
    ['Motherboard', 'The circuit in a computer with connectors to which other components connect.'],
    ['Backwards compatibility', 'The ability to be used with older technology without having to be specially adapted.'],
  ],
  mount(el) {
    const DM = [
      ['🔌', 'USB flash drive', '⚡', 'Flash memory', 'The USB drive contains the flash media so that it can be read by the computer after it is plugged into a USB port.'],
      ['🗄️', 'Hard disk drive (HDD)', '💿', 'Hard disk media (platters)', 'The drive connects the disk to the motherboard, directly or using Wi-Fi or a port like USB.'],
      ['🧩', 'Solid state drive (SSD)', '⚡', 'Flash memory media', 'Otherwise identical to a hard disk drive, but with no moving parts.'],
      ['📀', 'DVD drive', '📀', 'DVD disk (optical media)', 'The DVD disk stores the data; the DVD drive reads the data on the disk.'],
      ['🔵', 'Blu-ray drive', '🔵', 'Blu-ray disk (optical media)', 'Optical disk drives contain optical disk media.'],
    ];
    const DRIVES = ['CD drive', 'DVD drive', 'Blu-ray drive'];
    const DISCS = ['CD', 'DVD', 'Blu-ray'];
    el.innerHTML = `
      <div class="sim sto">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="sm">💾 Storage or memory?</button><button data-p="dev">💻 Internal or external</button><button data-p="dm">🔍 Devices and media</button><button data-p="bc">📀 Backwards compatibility</button>
        </div>

        <div data-panel="sm" class="sim">
          <div class="sto-boxes">
            <div class="sim-box sto-box" id="ramBox"><h5>Memory (RAM) <span class="pill r">volatile</span></h5><div class="sto-items" id="ramItems"></div><p class="note">Main memory: fast, holds what is in use now.</p></div>
            <div class="sto-mid"><button class="btn" id="bOpen">▶ Open an app</button><button class="btn" id="bSave">💾 Save essay</button><button class="btn sto-pw" id="bPow">⏻ Turn power off</button></div>
            <div class="sim-box sto-box" id="ssdBox"><h5>Secondary storage <span class="pill g">non-volatile</span></h5><div class="sto-items" id="ssdItems"></div><p class="note">Storage: keeps data when the power is off.</p></div>
          </div>
          <div class="cards3 sto-uses">
            <div class="mini" data-u="0"><h5>📄 Documents</h5><p>Storing a document for future use.</p></div>
            <div class="mini" data-u="1"><h5>📦 Applications</h5><p>Storing an application, ready to be loaded into RAM when the user opens it.</p></div>
            <div class="mini" data-u="2"><h5>🧠 Virtual memory</h5><p>Space used when RAM is full (you will see it in Part B).</p></div>
          </div>
        </div>

        <div data-panel="dev" class="sim" hidden>
          <div class="seg" id="kSeg"><span class="seg-l">Show</span><button data-v="all">All</button><button data-v="int">Internal</button><button data-v="ext">External</button></div>
          <div class="sim-box">
            <svg viewBox="0 0 560 270" class="sto-map" role="img" aria-label="A laptop with an internal SSD, and external storage devices around it">
              <g class="sk" data-k="int" data-n="0">
                <rect class="dv-body" x="200" y="20" width="170" height="110" rx="8"/><rect class="dv-screen" x="210" y="30" width="150" height="90" rx="3"/>
                <path class="dv-body" d="M180 132h210l-18 46H198z"/>
                <rect class="sto-mb" x="220" y="140" width="130" height="30" rx="3"/>
                <rect class="sto-chip" x="290" y="146" width="48" height="18" rx="2"/><text x="314" y="159" class="svg-sm sto-w">SSD</text>
                <text x="254" y="159" class="svg-sm sto-w" style="font-size: 9px">motherboard</text>
              </g>
              <g class="sk" data-k="ext" data-n="1"><path class="wire" d="M180 150H130"/><rect class="sto-usb" x="92" y="140" width="40" height="20" rx="3"/><rect class="dv-detail" x="130" y="145" width="12" height="10"/><text x="100" y="128" class="svg-lbl">USB flash drive</text></g>
              <g class="sk" data-k="ext" data-n="2"><path class="wire" d="M200 175C150 205 120 210 95 220"/><rect class="dv-body" x="20" y="205" width="90" height="50" rx="8"/><circle class="dv-detail" cx="96" cy="245" r="3"/><text x="65" y="198" class="svg-lbl">Hard disk drive (USB)</text></g>
              <g class="sk" data-k="ext" data-n="3"><path class="wire" d="M285 178V205"/><rect class="dv-body" x="215" y="205" width="140" height="22" rx="5"/><ellipse class="sto-disc" cx="285" cy="240" rx="40" ry="12"/><text x="285" y="268" class="svg-lbl">Blu-ray drive</text></g>
              <g class="sk" data-k="ext" data-n="4"><rect class="dv-body" x="455" y="20" width="80" height="100" rx="6"/><path class="dv-detail" d="M466 40h58v6h-58zM466 54h58v6h-58zM466 68h58v6h-58zM466 82h58v6h-58z"/><text x="495" y="138" class="svg-lbl">NAS</text><text x="495" y="152" class="svg-sm">network-attached storage</text></g>
              <g class="sk" data-k="ext" data-n="4"><path class="wire" d="M495 158V190"/><rect class="dv-body" x="455" y="190" width="80" height="26" rx="8"/><circle class="dv-led" cx="470" cy="203" r="2.5"/><text x="495" y="234" class="svg-sm">router</text><path class="wave" d="M445 200C425 190 410 175 395 150"/><text x="410" y="208" class="svg-sm">Wi-Fi</text><text x="501" y="178" class="svg-sm" style="text-anchor:start">Ethernet</text></g>
            </svg>
          </div>
          <p class="verdict" id="kMsg"></p>
        </div>

        <div data-panel="dm" class="sim" hidden>
          <p class="note">A storage <b>device</b> <i>contains</i> the storage <b>media</b> and <i>accesses</i> the data stored on it. Click a device to look inside.</p>
          <div class="sto-dm">${DM.map(([e, d, me, m, w], i) => `
            <button class="sto-card" data-i="${i}" aria-pressed="false">
              <span class="sto-f"><span class="sto-e">${e}</span><b>${d}</b><small>Device · look inside ▸</small></span>
              <span class="sto-b"><small>Inside the ${d}:</small><span class="sto-e">${me}</span><b>${m}</b><small>${w}</small></span>
            </button>`).join('')}</div>
        </div>

        <div data-panel="bc" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box">
              <div class="seg" id="drSeg"><span class="seg-l">1 · Choose a drive</span>${DRIVES.map((d, i) => `<button data-v="${i}">${d}</button>`).join('')}</div>
              <div class="seg" id="dsSeg" style="margin-top:.6rem"><span class="seg-l">2 · Put in a disk</span>${DISCS.map((d, i) => `<button data-v="${i}">${d}</button>`).join('')}</div>
              <div class="sto-tray" id="tray"><svg viewBox="0 0 220 80" aria-hidden="true"><rect class="dv-body" x="10" y="10" width="200" height="30" rx="6"/><circle class="dv-led" id="bcLed" cx="190" cy="25" r="3"/><g id="bcDisc"><ellipse class="sto-disc" cx="110" cy="55" rx="46" ry="14"/><text x="110" y="59" class="svg-sm sto-w" id="bcLab"></text></g></svg></div>
            </div>
            <div class="sim-box">
              <table class="tbl sto-bct"><thead><tr><th>Drive</th>${DISCS.map((d) => `<th>${d}</th>`).join('')}</tr></thead>
                <tbody>${DRIVES.map((d, r) => `<tr><th>${d}</th>${DISCS.map((x, c) => `<td data-rc="${r}${c}">${c <= r ? '✓' : '✗'}</td>`).join('')}</tr>`).join('')}</tbody></table>
              <p class="note">Newer drives are often compatible with older media: a Blu-ray drive can also read DVDs and CDs. This is <b>backwards compatibility</b>.</p>
            </div>
          </div>
          <p class="verdict" id="bcMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.sto'), $ = (s) => root.querySelector(s);

    // ---- storage or memory ----
    let power = true, saved = false;
    const chip = (t, cls = '') => `<span class="sto-it ${cls}">${t}</span>`;
    function drawSM() {
      $('#ssdItems').innerHTML = chip('📷 Photos') + chip('📦 Apps') + chip('🎵 Music') + (saved ? chip('📄 essay.docx', 'new') : '');
      $('#ramItems').innerHTML = power ? chip('🌐 Browser') + chip('📄 essay.docx <small>(unsaved)</small>') : '<span class="note">(empty)</span>';
      $('#bPow').textContent = power ? '⏻ Turn power off' : '⏻ Turn power on';
      $('#bPow').classList.toggle('on', !power);
      $('#ramBox').classList.toggle('off', !power);
      $('#bOpen').disabled = !power;
      $('#bSave').disabled = !power || saved;
    }
    function setPower(on) {
      if (!on) {
        root.querySelectorAll('#ramItems .sto-it').forEach((x) => x.classList.add('gone'));
        setTimeout(() => { power = false; drawSM(); FD.toast($('#ramBox'), 'Power off: everything in RAM is lost!'); }, FD.dur(500));
      } else { power = true; drawSM(); $('#ramItems').innerHTML = '<span class="note">(empty: open apps again)</span>'; FD.toast($('#ssdBox'), 'Power on: storage still has every file.'); }
    }
    function openApp() {
      if (!power) return;
      const app = FD.h(chip('🎵 Music', 'fly'));
      $('#ramItems').appendChild(app);
      FD.toast($('#ramBox'), 'The app is copied from storage into RAM.');
    }
    function save() { saved = true; drawSM(); FD.pulse($('#ssdBox')); }
    $('#bPow').addEventListener('click', () => setPower(!power));
    $('#bOpen').addEventListener('click', openApp);
    $('#bSave').addEventListener('click', save);
    const use = (i) => root.querySelectorAll('.sto-uses .mini').forEach((m) => m.classList.toggle('hot', +m.dataset.u === i));
    function resetSM() { power = true; saved = false; drawSM(); use(-1); }

    // ---- internal / external ----
    const INFO = ['', 'USB flash drive: plugged into a USB port on the outside.', 'External hard disk drive: connected with a USB cable.', 'Blu-ray drive: connected through a port on the outside.', 'Network-attached storage (NAS): connected by Wi-Fi and Ethernet.'];
    function kind(k) {
      FD.segSet($('#kSeg'), k);
      root.querySelectorAll('.sk').forEach((g) => g.classList.toggle('dim', k !== 'all' && g.dataset.k !== k));
      $('#kMsg').className = 'verdict';
      $('#kMsg').innerHTML = k === 'int' ? '<b>Internal</b> drives connect directly to the computer’s <b>motherboard</b>.' : k === 'ext' ? '<b>External</b> devices connect to the motherboard through the different <b>ports and adapters</b> on the computer’s exterior.' : '';
    }
    $('#kSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) kind(b.dataset.v); });
    root.querySelectorAll('.sk').forEach((g) => g.addEventListener('click', () => {
      const n = +g.dataset.n;
      kind(g.dataset.k);
      $('#kMsg').innerHTML = n ? `<b>External.</b> ${INFO[n]}` : '<b>Internal.</b> The SSD inside the laptop connects directly to the motherboard.';
    }));

    // ---- devices and media ----
    const cards = [...root.querySelectorAll('.sto-card')];
    const flip = (c, on) => { c.classList.toggle('open', on); c.setAttribute('aria-pressed', on); };
    cards.forEach((c) => c.addEventListener('click', () => flip(c, !c.classList.contains('open'))));
    async function flipAll(ctx) {
      cards.forEach((c) => flip(c, false));
      for (const c of cards) { if (!(await ctx.sleep(700))) return; flip(c, true); }
    }

    // ---- backwards compatibility ----
    let drive = 2, disc = 0;
    function bc() {
      FD.segSet($('#drSeg'), drive);
      FD.segSet($('#dsSeg'), disc);
      const ok = disc <= drive;
      $('#bcLab').textContent = DISCS[disc];
      $('#bcDisc').setAttribute('class', 'bc-d' + disc);
      root.querySelectorAll('[data-rc]').forEach((td) => td.classList.toggle('hot', td.dataset.rc === `${drive}${disc}`));
      $('#bcLed').classList.toggle('ok', ok);
      $('#bcLed').classList.toggle('no', !ok);
      $('#bcMsg').className = 'verdict ' + (ok ? 'good' : 'bad');
      $('#bcMsg').innerHTML = ok ? `✓ The ${DRIVES[drive]} reads the ${DISCS[disc]}${disc < drive ? ' — older media, thanks to <b>backwards compatibility</b>' : ''}.` : `✗ A ${DRIVES[drive]} cannot read a ${DISCS[disc]}: it is newer media than the drive.`;
    }
    $('#drSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { drive = +b.dataset.v; bc(); } });
    $('#dsSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { disc = +b.dataset.v; bc(); } });
    async function bcTour(ctx) {
      for (const [d, x] of [[2, 2], [2, 1], [2, 0], [1, 2]]) { drive = d; disc = x; bc(); if (!(await ctx.sleep(1300))) return; }
    }

    drawSM(); kind('all'); bc();
    const showP = FD.panels(root);
    showP('sm');
    return {
      show: showP, resetSM, setPower, openApp, save, use, kind, flipAll, bcTour,
      async powerDemo(ctx) { resetSM(); if (!(await ctx.sleep(900))) return; setPower(false); if (!(await ctx.sleep(1800))) return; setPower(true); },
      async usesDemo(ctx) {
        resetSM();
        use(0); if (!(await ctx.sleep(400))) return; save(); if (!(await ctx.sleep(1500))) return;
        use(1); openApp(); if (!(await ctx.sleep(1700))) return;
        use(2);
      },
      async kindDemo(ctx) { kind('all'); if (!(await ctx.sleep(900))) return; kind('int'); if (!(await ctx.sleep(1800))) return; kind('ext'); },
    };
  },
  steps: [
    {
      title: 'Storage is not memory',
      text: `<p><strong>Secondary storage</strong> is often just called <strong>‘storage’</strong>.</p>
             <p>It is often confused with <strong>primary storage</strong> or <strong>main memory</strong> — names for <b>RAM</b> (Random Access Memory) and <b>ROM</b> (Read Only Memory). You will learn about those in Part B.</p>`,
      tip: 'People often confuse storage and memory. You must know the difference, what they do and how they are used.',
      async on(a) { a.show('sm'); a.resetSM(); },
    },
    {
      title: 'Storage is non-volatile',
      text: `<p>Secondary storage is <strong>non-volatile</strong>: it does <strong>not lose data</strong> when the system’s power is turned off.</p>
             <p>RAM is <b>volatile</b>: when the power goes, everything in it is lost.</p>`,
      tip: 'Try it: turn the power off and on again. What survives?',
      async on(a, ctx) { a.show('sm'); await a.powerDemo(ctx); },
    },
    {
      title: 'What is storage used for?',
      text: `<p>Secondary storage is used for:</p>
             <ul><li>storing a <b>document</b> for future use</li><li>storing an <b>application</b>, ready to be loaded into RAM when the user opens it</li><li><b>virtual memory</b> (see Part B).</li></ul>`,
      tip: 'Try it: save the essay, then open an app.',
      async on(a, ctx) { a.show('sm'); await a.usesDemo(ctx); },
    },
    {
      title: 'Internal and external devices',
      text: `<p><strong>Storage devices</strong> store data or software used in a computer system. They can be <b>internal</b> or <b>external</b>.</p>
             <p><b>Internal</b> drives connect <b>directly</b> to the computer’s <strong>motherboard</strong>. <b>External</b> devices connect to the motherboard through the <b>ports and adapters</b> on the outside.</p>`,
      tip: 'Try it: click each device in the drawing.',
      async on(a, ctx) { a.show('dev'); await a.kindDemo(ctx); },
    },
    {
      title: 'Devices and media',
      text: `<p>A storage <strong>device</strong> <em>contains</em> the storage <strong>media</strong> and <em>accesses</em> the data stored on it.</p>
             <ul><li><b>Hard disk drives (HDD)</b> contain hard disk media.</li><li><b>Solid state drives (SSD)</b> contain flash memory media; otherwise they are identical to hard disk drives.</li><li><b>Optical disk drives</b> contain optical disk media.</li></ul>`,
      tip: 'Flash memory is the media; a USB drive is the device that contains it. A DVD disk is the media; a DVD drive reads it.',
      async on(a, ctx) { a.show('dm'); await a.flipAll(ctx); },
    },
    {
      title: 'Backwards compatibility',
      text: `<p>Newer optical drives are often compatible with <b>older media</b>. A drive that can read Blu-ray media can also read DVD and CD media.</p>
             <p>This is known as <strong>backwards compatibility</strong>.</p>`,
      tip: 'Try it: choose a drive, then put in a disk.',
      async on(a, ctx) { a.show('bc'); await a.bcTour(ctx); },
    },
  ],
});

FD.check({
  section: 'storage',
  items: [
    { type: 'mcq', q: 'What does <b>non-volatile</b> mean?', opts: ['It does not lose data when the power is turned off', 'It loses data when the power is turned off', 'It can only be written once', 'It has no moving parts'], why: 'Secondary storage is non-volatile; RAM is volatile.' },
    { type: 'tf', q: '‘Main memory’ and ‘secondary storage’ mean the same thing.', a: false, why: 'Main memory (primary storage) is RAM and ROM. Secondary storage is often just called ‘storage’.' },
    { type: 'multi', q: 'Which <b>three</b> are uses of secondary storage?', need: 3, opts: [['Storing a document for future use', true], ['Storing an application, ready to be loaded into RAM', true], ['Virtual memory', true], ['Carrying out software instructions', false], ['Booting the computer from ROM', false]], why: 'The processor carries out instructions; storage keeps documents, applications and virtual memory.' },
    { type: 'sort', q: 'Is each one a storage <b>device</b> or storage <b>media</b>?', bins: ['Device', 'Media'], rows: [['USB drive', 0], ['Flash memory', 1], ['DVD drive', 0], ['DVD disk', 1], ['Hard disk drive', 0]], why: 'The device contains the media and accesses the data stored on it.' },
    { type: 'mcq', q: 'A Blu-ray drive can also read DVDs and CDs. This is called…', opts: ['backwards compatibility', 'virtual memory', 'volatility', 'portability'], why: 'Newer drives are often compatible with older media.' },
    { type: 'sort', q: 'Internal or external?', bins: ['Internal', 'External'], rows: [['An SSD connected directly to the motherboard', 0], ['A NAS connected by Wi-Fi and Ethernet', 1], ['A hard disk drive plugged into a USB port', 1]], why: 'Internal drives connect directly to the motherboard; external ones use ports and adapters.' },
  ],
});
