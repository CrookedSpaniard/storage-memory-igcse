FD.add({
  id: 'compare',
  title: 'Comparing media and capacity',
  tab: 'Compare',
  icon: 'compare',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['Data access speed', 'How quickly data can be read from or written to media.'],
    ['Capacity', 'The amount of data that can be stored on media.'],
    ['Bit', 'Binary digit: a single unit of information with a value of either 0 or 1.'],
    ['Byte', 'Eight bits.'],
  ],
  mount(el) {
    const COLS = ['Hard disk', 'Flash media', 'Optical media', 'Magnetic tape'];
    // row: [name, cells, rank (4 = best) or null]
    const ROWS = [
      ['Data access speed', ['Fast', 'Fastest', 'Slow', 'Slowest'], [3, 4, 2, 1]],
      ['Maximum capacity', ['Varies, many TB*', 'Varies, up to many TB', 'CD 700 MB · DVD 18 GB · Blu-ray 50 GB', 'Varies, up to 185 TB'], null],
      ['Cost per GB', ['High', 'Very high', 'Medium', 'Low'], [2, 1, 3, 4]],
      ['Use', ['Servers, personal computers, backups', 'Laptops, mobile devices', 'Multimedia (music, games and films), file backups', 'Whole system backups and archives'], null],
      ['Portability', ['Not suitable', 'Yes', 'Not suitable', 'Not suitable'], [1, 4, 1, 1]],
    ];
    const JOBS = [
      ['A bank backs up all of its servers every night and keeps the copies for years.', 3, 'Magnetic tape: lowest cost per GB and huge capacity, for whole system backups and archives. Slow access does not matter.'],
      ['A games company sells a new console game in shops.', 2, 'Optical media (Blu-ray): used for multimedia such as music, games and films, with up to 50 GB.'],
      ['A smartphone needs storage that uses little battery and survives being dropped.', 1, 'Flash media: fastest, no moving parts, energy-efficient and portable.'],
      ['A school needs lots of storage in its file server at a sensible price.', 0, 'Hard disk: fast, large capacity, used in servers and personal computers.'],
      ['A student carries homework between home and school in a pocket.', 1, 'Flash media (a USB flash drive): portable.'],
    ];
    const UNITS = [['Kilobyte', 'KB', 'Kibibyte', 'KiB'], ['Megabyte', 'MB', 'Mebibyte', 'MiB'], ['Gigabyte', 'GB', 'Gibibyte', 'GiB'], ['Terabyte', 'TB', 'Tebibyte', 'TiB']];
    const BIG = [['Petabyte', 'PB'], ['Exabyte', 'EB'], ['Zettabyte', 'ZB'], ['Yottabyte', 'YB']];
    const ITEMS = [['📷', 'photo', 3e6], ['🎵', 'song', 4e6], ['🎬', 'film', 4e9], ['🎮', 'game', 50e9]];
    const STORES = [['CD', 700e6], ['DVD', 4.7e9], ['Blu-ray', 25e9], ['64 GB phone', 64e9], ['1 TB hard disk', 1e12]];
    el.innerHTML = `
      <div class="sim cp">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="tbl">📊 Table 1.4</button><button data-p="job">🎯 Choose the media</button><button data-p="units">🔢 Units of capacity</button><button data-p="ibm">🕰️ Then and now</button>
        </div>

        <div data-panel="tbl" class="sim">
          <p class="note">Click a row to compare. The bars show which media is best for that row.</p>
          <div class="tbl-wrap"><table class="tbl cp-t"><thead><tr><th></th>${COLS.map((c) => `<th>${c}</th>`).join('')}</tr></thead>
            <tbody>${ROWS.map(([n, cells, rank], r) => `<tr data-r="${r}"><th><button class="link-btn">${n}</button></th>${cells.map((c, k) => `<td>${c}${rank ? `<i class="cp-bar"><b style="width:${rank * 25}%"></b></i>` : ''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
          <p class="small muted">* The book’s table gives “up to 128 GB” for hard disks; hard disks today hold many terabytes.</p>
        </div>

        <div data-panel="job" class="sim" hidden>
          <div class="cp-jobs">${JOBS.map(([t], i) => `<div class="sim-box cp-job" data-i="${i}"><p>${t}</p><div class="seg">${COLS.map((c, k) => `<button data-v="${k}">${c}</button>`).join('')}</div><p class="note cp-why"></p></div>`).join('')}</div>
          <p class="verdict" id="jMsg"></p>
        </div>

        <div data-panel="units" class="sim" hidden>
          <div class="seg" id="uSeg"><span class="seg-l">Count in</span><button data-v="1000">1000s (book: KB, MB…)</button><button data-v="1024">1024s (specification: KiB, MiB…)</button></div>
          <div class="two-col">
            <div class="sim-box"><table class="tbl cp-u"><thead><tr><th>Number of bytes</th><th>Symbol</th><th>Name</th></tr></thead><tbody id="uBody"></tbody></table>
              <p class="note" id="uNote"></p></div>
            <div class="sim-box">
              <div class="seg" id="iSeg"><span class="seg-l">How many…</span>${ITEMS.map(([e, n], i) => `<button data-v="${i}">${e} ${n}s</button>`).join('')}</div>
              <div class="seg" id="sSeg" style="margin-top:.5rem"><span class="seg-l">…fit on a</span>${STORES.map(([n], i) => `<button data-v="${i}">${n}</button>`).join('')}</div>
              <p class="cp-fit" id="fit"></p><div class="cp-icons" id="icons"></div>
            </div>
          </div>
        </div>

        <div data-panel="ibm" class="sim" hidden>
          <div class="two-col">
            <div class="sim-box cp-then"><h5>1956 · IBM 350, the first disk drive</h5>
              <svg viewBox="0 0 220 180" aria-hidden="true"><rect class="dv-body" x="70" y="10" width="140" height="160" rx="6"/><rect class="dv-screen" x="88" y="40" width="70" height="80" rx="3"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path class="cp-pl" d="M95 ${50 + i * 8}h56"/>`).join('')}<circle class="cp-man" cx="35" cy="40" r="11"/><path class="cp-man" d="M35 52v62M35 70l-16 22M35 70l16 22M35 114l-12 56M35 114l12 56"/></svg>
              <ul class="small"><li>172 cm high, 152 cm long, 74 cm wide</li><li>Stored <b>3.75 MB</b></li><li>Hired for <b>US$38,400 per year</b></li></ul></div>
            <div class="sim-box cp-now"><h5>2016 · 256 GB microSD card</h5>
              <svg viewBox="0 0 220 180" aria-hidden="true"><path class="cp-fing" d="M70 175c0-60 10-120 40-120s40 60 40 120"/><path class="sto-chip" d="M96 52h22l8 8v30H96z"/></svg>
              <ul class="small"><li>The size of a fingertip</li><li>Stores <b>256 GB</b></li><li>Priced at <b>US$175</b></li></ul></div>
          </div>
          <p class="verdict good" id="ibmMsg"></p>
        </div>
      </div>`;
    const root = el.querySelector('.cp'), $ = (s) => root.querySelector(s);

    // ---- table ----
    const rows = [...root.querySelectorAll('.cp-t tbody tr')];
    function row(r) { rows.forEach((x) => x.classList.toggle('on', +x.dataset.r === r)); root.querySelector('.cp-t').classList.toggle('picking', r >= 0); }
    rows.forEach((x) => x.addEventListener('click', () => row(+x.dataset.r)));
    async function rowTour(ctx, list) { for (const r of list) { row(r); if (!(await ctx.sleep(1700))) return; } }

    // ---- choose the media ----
    const jobs = [...root.querySelectorAll('.cp-job')];
    let right = 0;
    function answer(job, k) {
      const i = +job.dataset.i, ok = k === JOBS[i][1];
      FD.segSet(job, k);
      if (ok && !job.classList.contains('ok')) right++;
      job.classList.toggle('ok', ok); job.classList.toggle('no', !ok);
      job.querySelector('.cp-why').innerHTML = ok ? `✓ ${JOBS[i][2]}` : '✗ Not the best choice. Look at Table 1.4 again: speed, capacity, cost, use and portability.';
      $('#jMsg').className = 'verdict' + (right === JOBS.length ? ' good' : '');
      $('#jMsg').textContent = right === JOBS.length ? 'All correct! You chose the best media for every job.' : `${right} of ${JOBS.length} correct.`;
    }
    jobs.forEach((j) => j.querySelector('.seg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) answer(j, +b.dataset.v); }));
    async function jobDemo(ctx) { if (!(await ctx.sleep(900))) return; if (!jobs[0].classList.contains('ok')) answer(jobs[0], JOBS[0][1]); }

    // ---- units ----
    let base = 1000, item = 1, store = 2;
    const big = (n) => n.toLocaleString('en-GB');
    function units(b) {
      base = b;
      FD.segSet($('#uSeg'), b);
      const spec = b === 1024;
      $('#uBody').innerHTML = `<tr><td>1 bit</td><td>–</td><td>a single 0 or 1</td></tr><tr><td>8 bits</td><td>1 B</td><td>Byte</td></tr>` +
        UNITS.map(([n, s, n2, s2], i) => `<tr class="hot-${i}"><td>${big(Math.pow(b, i + 1))}</td><td>1 ${spec ? s2 : s}</td><td>${spec ? n2 : n}</td></tr>`).join('') +
        BIG.map(([n, s], i) => `<tr class="dim"><td>${big(Math.pow(b, i + 5)).length > 22 ? `${b}<sup>${i + 5}</sup>` : big(Math.pow(b, i + 5))}</td><td>1 ${spec ? s.replace('B', 'iB') : s}</td><td>${n}</td></tr>`).join('');
      $('#uNote').innerHTML = spec
        ? 'The specification counts in <b>1024s</b>: 1 KiB = 1024 bytes, 1 MiB = 1024 KiB… because computers work in binary (1024 = 2<sup>10</sup>).'
        : 'The book’s Table 1.5 counts in <b>1000s</b>: 1 KB = 1000 bytes, 1 MB = 1000 KB… Grey rows: you do not need them for the International GCSE.';
      fit();
    }
    function fit() {
      FD.segSet($('#iSeg'), item); FD.segSet($('#sSeg'), store);
      const [e, n, size] = ITEMS[item], [sn, cap] = STORES[store];
      const k = Math.floor(cap / size);
      $('#fit').innerHTML = k ? `About <b>${big(k)}</b> ${n}${k === 1 ? '' : 's'} fit on a ${sn}.` : `A ${n} does <b>not</b> fit on a ${sn}!`;
      $('#icons').innerHTML = k ? e.repeat(Math.min(k, 60)) + (k > 60 ? ` <small>+ ${big(k - 60)} more</small>` : '') : '❌';
    }
    $('#uSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) units(+b.dataset.v); });
    $('#iSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { item = +b.dataset.v; fit(); } });
    $('#sSeg').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { store = +b.dataset.v; fit(); } });
    async function unitsDemo(ctx, b) {
      units(b);
      for (const [i, s] of [[1, 0], [2, 1], [2, 2], [3, 4]]) { item = i; store = s; fit(); if (!(await ctx.sleep(1300))) return; }
    }

    // ---- then and now ----
    async function ibm() {
      $('#ibmMsg').textContent = '';
      await FD.tween(1600, (k) => { $('#ibmMsg').innerHTML = `The microSD card stores as much as <b>${FD.fmt(68266 * k)}</b> IBM 350 disks!`; });
    }

    row(-1); units(1000);
    const showP = FD.panels(root);
    showP('tbl');
    return { show: showP, row, rowTour, jobDemo, units, unitsDemo, ibm };
  },
  steps: [
    {
      title: 'Comparing types of media',
      text: `<p>Table 1.4 compares hard disk, flash, optical and magnetic tape media.</p>
             <p><strong>Data access speed</strong> is how quickly data can be read from or written to media: flash is the <b>fastest</b>, tape the <b>slowest</b>.</p>
             <p><strong>Capacity</strong> is the amount of data that can be stored.</p>`,
      tip: 'Try it: click each row of the table.',
      async on(a, ctx) { a.show('tbl'); await a.rowTour(ctx, [0, 1]); },
    },
    {
      title: 'Cost per GB',
      text: `<p>The <strong>cost per GB</strong> is how much it costs to store each gigabyte.</p>
             <p>Magnetic tape has the <b>lowest</b> cost per GB; flash media the <b>highest</b>.</p>`,
      async on(a, ctx) { a.show('tbl'); await a.rowTour(ctx, [2]); },
    },
    {
      title: 'Use and portability',
      text: `<p>Each media suits a different <strong>use</strong>: hard disks in servers and personal computers, flash in laptops and mobile devices, optical for music, games and films, tape for whole system backups and archives.</p>
             <p>Only flash media are suitable for <strong>portable</strong> use.</p>`,
      async on(a, ctx) { a.show('tbl'); await a.rowTour(ctx, [3, 4]); },
    },
    {
      title: 'Choose the right media',
      text: `<p>In the exam you may need to <b>choose</b> a storage media for a job and <b>explain</b> why.</p>
             <p>Think about speed, capacity, cost per GB, use and portability.</p>`,
      tip: 'Try it: choose the best media for each job.',
      async on(a, ctx) { a.show('job'); await a.jobDemo(ctx); },
    },
    {
      title: 'Bits, bytes and units',
      text: `<p>A <strong>bit</strong> is 0 or 1. <strong>Eight bits</strong> make one <strong>byte</strong>.</p>
             <p>Bigger amounts use units: <b>kilobyte</b>, <b>megabyte</b>, <b>gigabyte</b>, <b>terabyte</b>. Each one is about a thousand times bigger than the one before.</p>`,
      tip: 'Try it: how many songs fit on a DVD?',
      async on(a, ctx) { a.show('units'); await a.unitsDemo(ctx, 1000); },
    },
    {
      title: '1000 or 1024?',
      text: `<p>The book counts in <b>1000s</b>: 1 KB = 1000 bytes.</p>
             <p>The Pearson Edexcel specification uses units that count in <b>1024s</b>, because computers work in binary: <strong>1 KiB (kibibyte) = 1024 bytes</strong>, 1 MiB = 1024 KiB, 1 GiB = 1024 MiB, 1 TiB = 1024 GiB.</p>`,
      tip: 'Learn both: KB, MB, GB, TB (1000s) and KiB, MiB, GiB, TiB (1024s).',
      async on(a) { a.show('units'); a.units(1024); },
    },
    {
      title: 'Then and now',
      text: `<p>The <b>IBM 350</b> was the first disk drive: 172 cm high, it stored <b>3.75 MB</b> and could be hired for US$38,400 per year.</p>
             <p>In 2016 a <b>256 GB microSD card</b>, the size of a fingertip, cost US$175.</p>`,
      tip: 'Did you know? In 2017 it would have taken about 9457 trillion years to download one yottabyte with a good internet connection.',
      async on(a) { a.show('ibm'); await a.ibm(); },
    },
  ],
});

FD.check({
  section: 'compare',
  items: [
    { type: 'mcq', q: 'Which media has the <b>fastest</b> data access speed?', opts: ['Flash media', 'Hard disk', 'Optical media', 'Magnetic tape'], why: 'Flash fastest, hard disk fast, optical slow, tape slowest.' },
    { type: 'mcq', q: 'Which media has the <b>lowest</b> cost per GB?', opts: ['Magnetic tape', 'Flash media', 'Hard disk', 'Optical media'], why: 'That is why tape is used for whole system backups and archives.' },
    { type: 'sort', q: 'Which media is best for each use?', bins: ['Hard disk', 'Flash', 'Optical', 'Tape'], rows: [['A server in an office', 0], ['A mobile phone', 1], ['Selling a film', 2], ['Archiving a whole system', 3]], why: 'See the “Use” row in Table 1.4.' },
    { type: 'mcq', q: 'How many bits are there in one byte?', opts: ['8', '2', '10', '1024'], why: 'A bit holds 0 or 1; eight bits equal one byte.' },
    { type: 'mcq', q: 'Using the specification’s units, 1 KiB is…', opts: ['1024 bytes', '1000 bytes', '8 bits', '1024 bits'], why: 'KiB, MiB, GiB and TiB count in 1024s. The book’s KB counts in 1000s.' },
    { type: 'mcq', q: 'Put these in order from smallest to largest.', opts: ['byte, kilobyte, megabyte, gigabyte, terabyte', 'byte, megabyte, kilobyte, terabyte, gigabyte', 'kilobyte, byte, gigabyte, megabyte, terabyte', 'terabyte, gigabyte, megabyte, kilobyte, byte'], why: 'Each unit is about a thousand (or 1024) times bigger than the one before.' },
  ],
});
