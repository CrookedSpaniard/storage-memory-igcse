FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${FD.state.checks['check-' + s.id] ? '<span class="st-done" title="Check done">✓</span>' : ''}</button></li>`).join('')}
          <li><button data-go="test${p}" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Test Part ${p}</b><small>Multiple choice + exam-style questions</small></span>${S.tests['test' + p] && S.tests['test' + p].done ? '<span class="st-done">✓</span>' : ''}</button></li>
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Unit 1 · Digital devices · Pearson Edexcel International GCSE ICT</p>
          <h2>Storage, memory and processors</h2>
          <p><b>Storage</b> keeps your files and software when the power is off. <b>Memory</b> holds the instructions that are in use, and the <b>processor</b> carries them out. In this lesson you will look inside hard disks, CDs, DVDs, Blu-ray, flash and tape, compare them, and then see how <b>RAM</b>, <b>ROM</b>, <b>flash memory</b> and the <b>CPU</b> work together — and why they make a computer fast or slow.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 10B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start Part A'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net st-flow" viewBox="0 0 420 230" role="img" aria-label="Storage sends software to memory, and memory sends instructions to the processor">
          <line x1="80" y1="115" x2="210" y2="115"/><line x1="210" y1="115" x2="340" y2="115"/>
          <rect class="nd" x="30" y="70" width="100" height="90" rx="12"/><text x="80" y="112" style="font-size:30px">💾</text><text x="80" y="145">Storage</text>
          <rect class="nd" x="160" y="70" width="100" height="90" rx="12"/><text x="210" y="112" style="font-size:30px">🧠</text><text x="210" y="145">Memory</text>
          <rect class="nd" x="290" y="70" width="100" height="90" rx="12"/><text x="340" y="112" style="font-size:30px">⚙️</text><text x="340" y="145">Processor</text>
          <circle class="st-bit" r="7"><animateMotion dur="2.4s" repeatCount="indefinite" path="M80 115H340"/></circle>
          <text x="80" y="195" class="st-s">keeps data</text><text x="210" y="195" class="st-s">fast, in use</text><text x="340" y="195" class="st-s">fetch · decode · execute</text>
        </svg>
      </section>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>
      <p class="small muted">Want to repeat the unit from zero? <button class="link-btn danger" id="sReset">↺ Reset my progress</button></p>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. The simulations are simplified drawings of how each part works, and many are slowed down so you can see them.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('storage');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    $('#sReset').addEventListener('click', () => FD.openProgress('reset'));
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
