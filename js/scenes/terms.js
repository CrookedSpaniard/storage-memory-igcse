FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['storage', 'Secondary storage', 'Often called ‘storage’. Non-volatile storage for documents, applications and virtual memory, e.g. hard disks and SSDs.'],
      ['storage', 'Non-volatile', 'Does not lose data when the power is turned off.'],
      ['storage', 'Volatile', 'Likely to change quickly; volatile memory (RAM) loses its data when the power is off.'],
      ['storage', 'Motherboard', 'The circuit in a computer with connectors to which other components connect.'],
      ['storage', 'Internal / external device', 'Internal drives connect directly to the motherboard; external devices connect through ports and adapters on the outside.'],
      ['storage', 'Storage device / storage media', 'The media stores the data; the device contains the media and accesses the data on it (e.g. DVD drive and DVD disk).'],
      ['storage', 'Backwards compatibility', 'The ability to be used with older technology without having to be specially adapted.'],
      ['hdd', 'Platters', 'Circular plates. Hard disks have many concentric platters.'],
      ['hdd', 'Concentric', 'Sharing the same central point.'],
      ['hdd', 'Spindle', 'A rod around which something spins.'],
      ['hdd', 'Read/write head', 'The part of a disk drive that passes across (floats) the platters on a very thin layer of gas.'],
      ['hdd', 'Seek time', 'The time it takes for a read/write head to locate the data on the disk: 4–15 ms on average.'],
      ['hdd', 'rpm', 'Revolutions per minute: hard disks typically spin at 5400 or 7200 rpm.'],
      ['media', 'Optical media', 'CDs (700 MB), DVDs (4.7 GB, up to 18 GB) and Blu-ray disks (25 GB, 50 GB double-sided), written and read with a laser.'],
      ['media', 'R / RW / RE', 'Recordable (CD-R, DVD-R, BD-R); rewritable (CD-RW, DVD-RW); BD-RE can be erased and rewritten.'],
      ['media', 'Flash media', 'Media with no moving parts: energy-efficient and less likely to fail when moved, so used in portable devices.'],
      ['media', 'Magnetic tape', 'Originally designed to record sound; now mainly used for backing up data in large organisations.'],
      ['media', 'Bit', 'Binary digit: a single unit of information with a value of either 0 or 1.'],
      ['compare', 'Byte', 'Eight bits.'],
      ['compare', 'Data access speed', 'How quickly data can be read from or written to media.'],
      ['compare', 'Capacity', 'The amount of data that can be stored on media.'],
      ['compare', 'KB, MB, GB, TB', 'Kilobyte, megabyte, gigabyte, terabyte: each 1000 times bigger than the one before (book, Table 1.5).'],
      ['compare', 'KiB, MiB, GiB, TiB', 'Kibibyte, mebibyte, gibibyte, tebibyte: each 1024 times bigger than the one before (1 KiB = 1024 bytes).'],
      ['ram', 'Memory', 'Main memory (primary storage): faster than secondary storage. RAM, ROM and flash memory.'],
      ['ram', 'RAM', 'Random Access Memory: volatile memory that holds the programs and data in use.'],
      ['ram', 'Virtual memory', 'Space on secondary storage used for instructions and programs when there is not enough space in RAM.'],
      ['rom', 'ROM', 'Read Only Memory: non-volatile memory that stores data permanently (Mask Programmed ROM cannot be changed after manufacture).'],
      ['rom', 'Boot', 'Start up. General purpose computers use ROM to boot and load the operating system.'],
      ['rom', 'PROM', 'Programmable Read Only Memory: can be written to only once.'],
      ['rom', 'EPROM', 'Erasable Programmable Read Only Memory: erased with strong ultraviolet (UV) light, then rewritten.'],
      ['rom', 'EEPROM', 'Electrically Erasable Programmable Read Only Memory: erased by applying a voltage to one of the chip’s pins.'],
      ['rom', 'Firmware', 'A type of software that controls a hardware device.'],
      ['flash', 'Flash memory', 'A type of EEPROM: non-volatile, no moving parts, fast access time, low power. Used in SSDs, USB drives and SD cards.'],
      ['cpu', 'CPU / core', 'Central Processing Unit: carries out software instructions. In a multi-core processor each CPU is a core.'],
      ['cpu', 'Processor cycle', 'Fetching an instruction from memory, decoding the actions required and executing them.'],
      ['cpu', 'Clock cycles per second', 'The measure of processor speed, in Hz, kHz (1000), MHz (1,000,000) and GHz (1,000,000,000).'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
