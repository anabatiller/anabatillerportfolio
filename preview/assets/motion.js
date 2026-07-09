/* ============================================================
   MOTION ENGINE — Ana Batiller portfolio · single source of truth
   ------------------------------------------------------------
   Loaded once (helmet <script src="motion.js">). Every page's DC
   logic calls window.ABMotion.initMotion(this.props) from
   componentDidMount. All behaviors are gated on element presence,
   so the same engine drives the landing page, the case shell, and
   the case studies. Edit here → every page updates.

   props: { accent?:string, motionLevel?:'full'|'subtle' }
   ============================================================ */
(function () {
  if (window.ABMotion && window.ABMotion.__loaded) return;

  var EASE = 'cubic-bezier(.16,1,.3,1)';
  var started = false; // initMotion runs its one-time global setup once
  var _fine = false;   // fine-pointer device (set in initMotion, read by refreshWordmarks)

  function initMotion(props) {
    var p = props || {};
    var root = document.documentElement;

    // per-page accent override (the live handle the design system exposes)
    if (p.accent) root.style.setProperty('--accent', p.accent);

    if (!root.classList.contains('js-anim')) return;
    if (started) return;            // guard double-init across components
    started = true;

    var subtle = p.motionLevel === 'subtle';

    initReveal();

    var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    _fine = fine;
    initIndex(fine);                // index hover works partly without fine pointer
    if (!fine) return;

    initStamp();
    initMagnetic(subtle);
    initTilt(subtle);
    initMarquee();
    refreshWordmarks();
  }

  /* ---- reveal-on-scroll + masked line wipe -------------------- */
  function initReveal() {
    var ioFired = false;
    var targets = document.querySelectorAll('[data-reveal],[data-mask]');

    // auto-stagger: direct [data-reveal] siblings that share a parent and
    // have no explicit transition-delay rise in a gentle cascade.
    var groups = new Map();
    targets.forEach(function (el) {
      if (!el.hasAttribute('data-reveal')) return;
      if (el.style.transitionDelay) return;
      var key = el.parentNode;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    groups.forEach(function (els) {
      if (els.length < 2) return;
      els.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 0.06, 0.36) + 's';
      });
    });

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        ioFired = true;
        var el = e.target;
        el.classList.add('in');
        io.unobserve(el);
        if (el.hasAttribute('data-mask')) {
          setTimeout(function () { el.style.overflow = 'visible'; }, 1200);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });

    // failsafe: offscreen iframe / PDF / image export — never leave hidden
    setTimeout(function () {
      if (!ioFired) {
        io.disconnect();
        document.documentElement.classList.add('reveal-all');
        targets.forEach(function (el) { el.classList.add('in'); });
      }
    }, 1400);
  }

  /* ---- click stamp (coral ink dots) --------------------------- */
  function initStamp() {
    var layer = document.getElementById('ab-stamp-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'ab-stamp-layer';
      Object.assign(layer.style, {
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '9998', mixBlendMode: 'multiply', overflow: 'visible'
      });
      document.body.style.position = document.body.style.position || 'relative';
      document.body.appendChild(layer);
    }
    if (!document.getElementById('ab-stamp-kf')) {
      var st = document.createElement('style');
      st.id = 'ab-stamp-kf';
      st.textContent = '@keyframes ab-stamp-pop{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}45%{opacity:.62}100%{transform:translate(-50%,-50%) scale(1);opacity:.5}}@keyframes ab-stamp-fade{from{opacity:.5;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-50%) scale(1.35)}}';
      document.head.appendChild(st);
    }
    window.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      var t = e.target;
      if (t && t.closest && t.closest('a,button,[role="button"],input,textarea,select')) return;
      var size = 34 + Math.random() * 30;
      var dot = document.createElement('div');
      Object.assign(dot.style, {
        position: 'absolute',
        left: e.pageX + 'px', top: e.pageY + 'px',
        width: size + 'px', height: size + 'px', borderRadius: '50%',
        background: 'var(--ab-cursor,#FB885B)', filter: 'blur(7px)',
        transform: 'translate(-50%,-50%)',
        animation: 'ab-stamp-pop .5s ' + EASE + ' both'
      });
      layer.appendChild(dot);
      var life = 3000 + Math.random() * 2000;
      setTimeout(function () {
        dot.style.animation = 'ab-stamp-fade 1.3s ' + EASE + ' forwards';
        setTimeout(function () { dot.remove(); }, 1400);
      }, life);
    });
  }

  /* ---- magnetic links ----------------------------------------- */
  function initMagnetic(subtle) {
    var k = subtle ? 0.12 : 0.34;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.style.transition = 'transform .5s ' + EASE;
      el.style.willChange = 'transform';
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + dx * k + 'px,' + dy * k + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---- pointer tilt on media / cards -------------------------- */
  function initTilt(subtle) {
    if (subtle) return;
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.style.transition = 'transform .6s ' + EASE;
      el.style.willChange = 'transform';
      var inner = el.querySelector('[data-tilt-in]');
      var liftEl = inner || el;
      var baseShadow = liftEl.style.boxShadow;
      if (inner) inner.style.transition = 'transform .6s ' + EASE + ', box-shadow .6s ' + EASE;
      else el.style.transition += ', box-shadow .6s ' + EASE;
      el.addEventListener('pointerenter', function () {
        if (baseShadow) liftEl.style.boxShadow = '0 44px 80px -34px rgba(55,27,5,.42)';
      });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + px * 12 + 'deg) rotateX(' + (-py * 12) + 'deg)';
        if (inner) inner.style.transform = 'translate(' + px * 20 + 'px,' + py * 20 + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        // clear inline transform so the card settles back to its CSS rest
        // state — which carries the scrapbook rotate(var(--rot)) if any.
        el.style.transform = '';
        if (inner) inner.style.transform = 'translate(0,0)';
        liftEl.style.boxShadow = baseShadow;
      });
    });
  }

  /* ---- velocity marquee --------------------------------------- */
  function initMarquee() {
    var tracks = document.querySelectorAll('[data-mq]');
    if (!tracks.length) return;
    var vel = 0, last = window.scrollY;
    window.addEventListener('scroll', function () {
      var now = window.scrollY;
      vel = Math.min(Math.abs(now - last) * 0.6, 24); last = now;
    }, { passive: true });
    (function loop() {
      tracks.forEach(function (t) {
        var base = parseFloat(t.dataset.base || '34');
        var dur = Math.max(7, base - vel);
        t.style.animationDuration = dur + 's';
      });
      vel += (0 - vel) * 0.05;
      requestAnimationFrame(loop);
    })();
  }

  /* ---- hero wordmark letter repulsion --------------------------
     Works on the hand-split landing wordmark (.ab-wordmark) AND on
     any heading tagged [data-wordmark] — those get auto-split into
     per-letter spans here (entrance handled separately by the mask
     wipe, so auto-split letters carry no rise animation). */
  function splitLetters(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {                  // text node — split into letters
        var text = node.nodeValue;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < text.length; i++) {
          var ch = text[i];
          if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
          var s = document.createElement('span');
          s.className = 'ab-ltr-in';
          s.style.display = 'inline-block';
          s.style.willChange = 'transform';
          s.textContent = ch;
          frag.appendChild(s);
        }
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 &&           // element wrapper (e.g. a {{hole}} <span>)
                 !node.classList.contains('ab-ltr-in') &&
                 !node.querySelector('.ab-ltr-in') &&
                 (node.textContent || '').trim()) { // skip the empty dot span
        splitLetters(node);
      }
    });
  }

  function bindWordmark(wrap) {
    if (wrap.__abWord) return;
    if (!wrap.querySelector('.ab-ltr-in')) {
      if (!(wrap.textContent || '').trim()) return;   // text not loaded yet — try again later
      splitLetters(wrap);
    }
    var letters = Array.prototype.slice.call(wrap.querySelectorAll('.ab-ltr-in'));
    if (!letters.length) return;
    wrap.__abWord = true;
    letters.forEach(function (l) { l.style.transition = 'transform .35s ' + EASE; });
    var R = 140;
    wrap.addEventListener('pointermove', function (e) {
      letters.forEach(function (l) {
        var r = l.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var dist = Math.hypot(dx, dy) || 1;
        if (dist < R) {
          var f = 1 - dist / R;
          var rot = (dx / dist) * f * 10; // subtle lean toward the cursor
          l.style.transform = 'translate(' + (dx / dist) * f * 13 + 'px,' + ((dy / dist) * f * 13 - f * 8) + 'px) rotate(' + rot + 'deg) scale(' + (1 + f * 0.18) + ')';
        } else {
          l.style.transform = 'none';
        }
      });
    }, { passive: true });
    wrap.addEventListener('pointerleave', function () {
      letters.forEach(function (l) { l.style.transform = 'none'; });
    });
  }

  // Bind every wordmark on the page. Safe to call repeatedly — used by
  // pages whose titles arrive asynchronously (data-bound case heroes).
  function refreshWordmarks() {
    if (!_fine) return;
    document.querySelectorAll('.ab-wordmark, [data-wordmark]').forEach(bindWordmark);
  }

  /* ---- work index hover (landing only) ------------------------ */
  function initIndex(fine) {
    var rows = document.querySelectorAll('.ab-idx-row');
    if (!rows.length) return;
    var status = document.querySelector('.ab-idx-status');
    var numEl = status && status.querySelector('.ab-idx-status-num');
    var catEl = status && status.querySelector('.ab-idx-status-cat');
    function setStatus(n, c) { if (numEl) numEl.textContent = n; if (catEl) catEl.textContent = c; }
    rows.forEach(function (row) {
      row.addEventListener('pointerenter', function () { setStatus(row.dataset.num || '', row.dataset.cat || ''); });
    });
    var idx = document.getElementById('ab-index');
    if (idx) idx.addEventListener('pointerleave', function () { setStatus(rows[0].dataset.num || '', rows[0].dataset.cat || ''); });
  }

  window.ABMotion = { initMotion: initMotion, refreshWordmarks: refreshWordmarks, __loaded: true };
})();
