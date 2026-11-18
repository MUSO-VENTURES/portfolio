// Shane Musseau portfolio: vanilla JS, no build step.
(function () {
  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  // Scroll reveal + one-time triggers (skill bars, counters)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      el.querySelectorAll('.bar i[data-w]').forEach((b) => (b.style.width = b.dataset.w + '%'));
      el.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  function countUp(el) {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    const dur = 1600, t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // YouTube modal
  const modal = document.querySelector('.modal');
  if (modal) {
    const frame = modal.querySelector('iframe');
    const open = (id) => {
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      modal.classList.remove('open');
      frame.src = '';
      document.body.style.overflow = '';
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-yt]');
      if (t && !t.closest('.recent')) { e.preventDefault(); open(t.dataset.yt); }
    });
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.close')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  // Work carousel
  const track = document.querySelector('.track');
  if (track) {
    const slides = [...track.children];
    const dots = document.querySelector('.dots');
    const recent = [...document.querySelectorAll('.recent .tile')];
    let idx = 0;
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.setAttribute('aria-label', 'Go to project ' + (i + 1));
      d.addEventListener('click', () => go(i));
      dots.appendChild(d);
    });
    function paint(i) {
      idx = i;
      slides.forEach((s, j) => s.classList.toggle('is-active', j === i));
      [...dots.children].forEach((d, j) => d.classList.toggle('on', j === i));
      recent.forEach((r, j) => r.classList.toggle('is-active', j === i));
    }
    function go(i) {
      i = (i + slides.length) % slides.length;
      const s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: 'smooth' });
      paint(i);
    }
    document.querySelector('.arrow.prev').addEventListener('click', () => go(idx - 1));
    document.querySelector('.arrow.next').addEventListener('click', () => go(idx + 1));
    recent.forEach((r, i) => r.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
      track.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }));
    let raf;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bd = Infinity;
        slides.forEach((s, j) => {
          const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
          if (d < bd) { bd = d; best = j; }
        });
        paint(best);
      });
    });
    paint(0);
  }

  // Contact form: delivered to your inbox through FormSubmit (no server needed on GitHub Pages).
  // If JavaScript fails, the form still posts the normal way via its action attribute.
  const form = document.querySelector('#contact-form');
  if (form) {
    const note = form.querySelector('.form-note');
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      if (data._honey) return; // bot trap
      const subj = data.subject ? `Portfolio inquiry: ${data.subject}` : 'New portfolio inquiry';
      data._subject = subj;
      data._replyto = data.email;
      btn.disabled = true; btn.textContent = 'Sending...';
      note.className = 'form-note'; note.textContent = '';
      try {
        const res = await fetch(form.dataset.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || String(json.success) === 'false') throw new Error(json.message || 'Send failed');
        form.reset();
        note.className = 'form-note ok';
        note.textContent = "Thanks! Your message is on its way. I'll get back to you soon.";
        btn.textContent = 'Message Sent';
      } catch (err) {
        note.className = 'form-note err';
        note.innerHTML = 'Something went wrong. Please email me directly at <a href="mailto:smusseau.jobs@gmail.com">smusseau.jobs@gmail.com</a>.';
        btn.disabled = false; btn.textContent = 'Send Message';
      }
    });
  }
})();
